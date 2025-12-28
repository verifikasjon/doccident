"use strict";

import { readFileSync, writeFileSync } from "fs";
import chalk from "chalk";

import { flatten } from "./utils";
import parseCodeSnippets from "./parse-code-snippets-from-markdown";
import { Config, Sandbox, TestResult, ParsedFile, FileInfo, Snippet } from "./types";
import { printResults } from "./reporter";
import { pythonHandler } from "./languages/python";
import { shellHandler } from "./languages/shell";
import { goHandler } from "./languages/go";
import { rustHandler } from "./languages/rust";
import { fortranHandler } from "./languages/fortran";
import { cobolHandler } from "./languages/cobol";
import { cHandler } from "./languages/c";
import { basicHandler } from "./languages/basic";
import { javaHandler } from "./languages/java";
import { csharpHandler } from "./languages/csharp";
import { perlHandler } from "./languages/perl";
import { rHandler } from "./languages/r";
import { pascalHandler } from "./languages/pascal";
import { javascriptHandler } from "./languages/javascript";

export { printResults };

export function runTests(files: string[], config: Config): TestResult[] {
    const results = files
        .map(read)
        .map(fileInfo => {
            const parsed = parseCodeSnippets(fileInfo);
            // Attach original contents to parsed file if needed for updates?
            // Actually testFile closure captures it if we pass it correctly?
            // But map pipeline separates them.
            // Let's modify testFile to accept FileInfo + ParsedFile or just re-read?
            // Or better: `read` returns FileInfo. `parseCodeSnippets` returns ParsedFile (without contents).
            // We can wrap this better.
            return { parsed, fileInfo };
        })
        .map(({ parsed, fileInfo }) => testFile(config)(parsed, fileInfo));

    return flatten(results);
}

function read(fileName: string): FileInfo {
    return { contents: readFileSync(fileName, "utf8"), fileName };
}

function makeTestSandbox(config: Config): Sandbox {
    function sandboxRequire(moduleName: string) {
        for (const regexRequire in config.regexRequire) {
            const regex = new RegExp(regexRequire);

            const match = regex.exec(moduleName);
            const handler = config.regexRequire[regexRequire];

            if (match) {
                return handler(...match);
            }
        }

        if (config.require === undefined || config.require[moduleName] === undefined) {
            throw moduleNotFoundError(moduleName);
        }

        return config.require[moduleName];
    }

    const sandboxConsole = {
        log: () => null,
    };

    const sandboxGlobals = { require: sandboxRequire, console: config.testOutput ? console : sandboxConsole };
    const sandbox = Object.assign({}, sandboxGlobals, config.globals);

    return sandbox;
}

function testFile(config: Config) {
    return function testFileWithConfig(args: ParsedFile, fileInfo?: FileInfo): TestResult[] {
        const codeSnippets = args.codeSnippets;
        const fileName = args.fileName;
        const shareCodeInFile = args.shareCodeInFile;

        let results: TestResult[];
        
        // Map to store outputs by ID
        const outputs: Record<string, string> = {};
        
        // Store edits if updating output
        const edits: { startLine: number; endLine?: number; content: string }[] = [];

        if (shareCodeInFile) {
            const sandbox = makeTestSandbox(config);
            results = codeSnippets.map(test(config, fileName, sandbox, outputs, edits));
        } else {
            results = codeSnippets.map(test(config, fileName, undefined, outputs, edits));
        }
        
        // Apply edits if updateOutput is true and we have file info
        if (config.updateOutput && edits.length > 0 && fileInfo) {
            applyEdits(fileInfo, edits);
        }

        return results;
    };
}

function applyEdits(fileInfo: FileInfo, edits: { startLine: number; endLine?: number; content: string }[]) {
    // Sort edits by startLine descending to safely modify file
    // Note: We need endLine for snippets. Currently Snippet only has lineNumber (start).
    // The parser needs to provide endLine or we need to calculate it.
    // If we assume standard fences ```...```, we can try to guess or update parser.
    // Parser update is safer. But let's check snippet first.
    // For now, let's assume we can't do it safely without endLine.
    // Snippet interface needs endLine.
    
    // Sort descending
    edits.sort((a, b) => b.startLine - a.startLine);
    
    const lines = fileInfo.contents.split('\n');
    
    for (const edit of edits) {
        if (edit.endLine === undefined) continue;
        
        // Snippet startLine is 1-based index of the first line of content (inside fences) usually?
        // Let's check parser.
        // In parser: `lineNumber` is `index + 1`. `index` is passed from split('\n').map.
        // `isStartOfSnippet` detects the opening fence.
        // `startNewSnippet` called with that line number.
        // So `lineNumber` is the line of the OPENING FENCE ```.
        
        // Code content starts at lineNumber + 1?
        // Wait, parser:
        // `parseLine` calls `startNewSnippet` on `isStartOfSnippet`.
        // So snippet.lineNumber is the line index (1-based) of the ```lang line.
        
        // `endSnippet` is called on `isEndOfSnippet` (closing ```).
        // We need to capture that line number too.
        
        // We replace from `startLine` (exclusive? no, replace the CONTENT)
        // Actually, we want to replace the content BETWEEN the fences.
        // So from `startLine` (0-based index) + 1 to `endLine` (0-based index) - 1.
        
        // Let's rely on parser providing `endLine`.
        
        const startIdx = edit.startLine; // 1-based index of opening fence
        const endIdx = edit.endLine;     // 1-based index of closing fence
        
        // Content lines are startIdx...endIdx-2 (0-based: startIdx is fence line)
        // Example:
        // 1: ```text  <- startLine
        // 2: Old      <- content
        // 3: ```      <- endLine
        
        // We want to replace lines between startLine and endLine with new content.
        
        // 0-based indexes:
        // startLineIndex = startLine - 1;
        // endLineIndex = endLine - 1;
        
        // We want to replace lines from (startLineIndex + 1) to (endLineIndex - 1).
        // splice(start, deleteCount, items...)
        
        const startReplace = startIdx; // index after opening fence
        const deleteCount = (endIdx - 1) - startReplace;
        
        // If content is empty/new, we just splice.
        
        lines.splice(startReplace, deleteCount, edit.content);
    }
    
    writeFileSync(fileInfo.fileName, lines.join('\n'));
}

function test(config: Config, _filename: string, sandbox?: Sandbox, outputs?: Record<string, string>, edits?: { startLine: number; endLine?: number; content: string }[]) {
    return (codeSnippet: Snippet): TestResult => {
        const startTime = performance.now();
        if (codeSnippet.skip) {
            return { status: "skip", codeSnippet, stack: "" };
        }
        
        // Output verification / update logic
        if (codeSnippet.outputOf) {
            const expectedOutput = codeSnippet.code.trim(); // Trim for comparison
            // For update, we want the raw output (maybe trimmed of trailing newline but preserving structure)
            
            const actualOutput = outputs && outputs[codeSnippet.outputOf] ? outputs[codeSnippet.outputOf] : "";
            const actualOutputTrimmed = actualOutput.trim();
            
            // console.log(`[DEBUG] Verifying '${codeSnippet.outputOf}' Mode=${codeSnippet.outputMode}`);
            // console.log(`[DEBUG] Expected: "${expectedOutput}"`);
            // console.log(`[DEBUG] Actual: "${actualOutputTrimmed}"`);
            
            if (!outputs || outputs[codeSnippet.outputOf] === undefined) {
                return { status: "fail", codeSnippet, stack: `Snippet with id '${codeSnippet.outputOf}' not executed or not found.` };
            }
            
            if (config.updateOutput) {
                // Schedule update
                if (edits) {
                    // Normalize actual output: usually we want to preserve it exactly, 
                    // but standard console.log adds newline. 
                    // Markdown blocks usually end with newline before ```.
                    // Let's strip the very last newline if present to avoid growing gaps?
                    // Or just use trimEnd()?
                    // Generally, code blocks look like:
                    // ```text
                    // Output
                    // ```
                    // If actualOutput is "Output\n", we put "Output" inside?
                    // Or "Output\n"?
                    // If we put "Output\n", it becomes:
                    // ```text
                    // Output
                    // 
                    // ```
                    // Let's trim trailing whitespace from actualOutput for the replacement content.
                    edits.push({
                        startLine: codeSnippet.lineNumber,
                        endLine: codeSnippet.endLine, // We need this!
                        content: actualOutput.trimEnd()
                    });
                }
                process.stdout.write(chalk.yellow("u"));
                return { status: "pass", codeSnippet, stack: "" };
            }
            
            if (actualOutputTrimmed !== expectedOutput) {
                if (codeSnippet.outputMode === 'ignore-whitespace') {
                    // Normalize both strings: replace all whitespace sequences with single space and trim
                    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
                    if (normalize(actualOutput) === normalize(expectedOutput)) {
                        process.stdout.write(chalk.green("."));
                        return { status: "pass", codeSnippet, stack: "" };
                    }
                } else if (codeSnippet.outputMode === 'regex') {
                    // Treat expectedOutput as regex pattern
                    try {
                        const pattern = expectedOutput.trim();
                        // For regex, we match against trimmed actual output
                        const re = new RegExp(pattern);
                        if (re.test(actualOutput.trim())) {
                            process.stdout.write(chalk.green("."));
                            return { status: "pass", codeSnippet, stack: "" };
                        }
                    } catch (e) {
                        process.stdout.write(chalk.red("x"));
                        return { 
                            status: "fail", 
                            codeSnippet, 
                            stack: `Invalid Regex Pattern: ${e}\nPattern:\n${expectedOutput}` 
                        };
                    }
                }

                process.stdout.write(chalk.red("x"));
                return { 
                    status: "fail", 
                    codeSnippet, 
                    stack: `Output verification failed (${codeSnippet.outputMode || 'exact'}).\nExpected:\n${expectedOutput}\n\nActual:\n${actualOutputTrimmed}` 
                };
            }
            
            process.stdout.write(chalk.green("."));
            return { status: "pass", codeSnippet, stack: "" };
        }

        let success = false;
        let stack = "";
        let output = "";

        let code = codeSnippet.code;

        if (config.transformCode) {
            try {
                code = config.transformCode(code);
            } catch (e: any) {
                return { status: "fail", codeSnippet, stack: "Encountered an error while transforming snippet: \n" + e.stack };
            }
        }

        let perSnippetSandbox: Sandbox;
        let activeSandbox: Sandbox;
        let isSharedSandbox = false;

        if (sandbox === undefined) {
            perSnippetSandbox = makeTestSandbox(config);
            activeSandbox = perSnippetSandbox;
        } else {
            activeSandbox = sandbox;
            isSharedSandbox = true;
        }

        if (config.beforeEach) {
            config.beforeEach();
        }

        let result;
        if (codeSnippet.language === 'python') {
            result = pythonHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (['bash', 'sh', 'zsh'].includes(codeSnippet.language || '')) {
            result = shellHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'go') {
            result = goHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'rust') {
            result = rustHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'fortran') {
            result = fortranHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'cobol') {
            result = cobolHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'c') {
            result = cHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'basic') {
            result = basicHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'java') {
            result = javaHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'perl') {
            result = perlHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'r') {
            result = rHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'pascal') {
            result = pascalHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'csharp') {
            result = csharpHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        } else if (codeSnippet.language === 'text') {
            result = { success: true, stack: "" };
        } else {
            result = javascriptHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        }

        success = result.success;
        stack = result.stack;
        output = result.output || "";
        
        // Store output if ID is present
        if (codeSnippet.id && outputs) {
            outputs[codeSnippet.id] = output;
        }

        const status = success ? "pass" : "fail";
        const executionTime = performance.now() - startTime;

        process.stdout.write(success ? chalk.green(".") : chalk.red("x"));

        return { status, codeSnippet, stack, executionTime };
    };
}

function moduleNotFoundError(moduleName: string) {
    return new Error(`
Attempted to require '${chalk.blue(moduleName)}' but was not found in config.
You need to include it in the require section of your ${chalk.grey(
        ".doccident-setup.js",
    )} file.

For example:
${chalk.grey("// .doccident-setup.js")}
module.exports = {
  require: {
    ${chalk.blue(`'${moduleName}': require('${moduleName}')`)}
  }
}
  `);
}

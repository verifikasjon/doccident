"use strict";

import { readFileSync } from "fs";
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
import { javascriptHandler } from "./languages/javascript";

export { printResults };

export function runTests(files: string[], config: Config): TestResult[] {
    const results = files
        .map(read)
        .map(parseCodeSnippets)
        .map(testFile(config));

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
    return function testFileWithConfig(args: ParsedFile): TestResult[] {
        const codeSnippets = args.codeSnippets;
        const fileName = args.fileName;
        const shareCodeInFile = args.shareCodeInFile;

        let results: TestResult[];

        if (shareCodeInFile) {
            const sandbox = makeTestSandbox(config);
            results = codeSnippets.map(test(config, fileName, sandbox));
        } else {
            results = codeSnippets.map(test(config, fileName));
        }

        return results;
    };
}

function test(config: Config, _filename: string, sandbox?: Sandbox) {
    return (codeSnippet: Snippet): TestResult => {
        if (codeSnippet.skip) {
            return { status: "skip", codeSnippet, stack: "" };
        }

        let success = false;
        let stack = "";

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
        } else {
            result = javascriptHandler(code, codeSnippet, config, activeSandbox, isSharedSandbox);
        }

        success = result.success;
        stack = result.stack;

        const status = success ? "pass" : "fail";

        process.stdout.write(success ? chalk.green(".") : chalk.red("x"));

        return { status, codeSnippet, stack };
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

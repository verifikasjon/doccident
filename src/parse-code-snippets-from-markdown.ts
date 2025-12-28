"use strict";

import { State, ParsedFile, FileInfo } from "./types";

// Capture indentation (group 1) and language (group 2)
const START_REGEX = /^(\s*)```\W*(JavaScript|js|es6|ts|typescript|python|py|bash|sh|zsh|shell|go|rust|rs|fortran|f90|f95|cobol|cob|c|basic|java|perl|pl|csharp|cs|r|pascal|pas|text|txt|output)\s?$/i;

const isStartOfSnippet = (line: string) => line.match(START_REGEX);
const isEndOfSnippet = (line: string) => line.trim() === "```";
const isSkip = (line: string) => line.trim() === "<!-- skip-example -->";
const isCodeSharedInFile = (line: string) =>
    line.trim() === "<!-- share-code-between-examples -->";
const isId = (line: string) => line.match(/^<!--\s*id:\s*(\S+)\s*-->$/);
const isOutputOf = (line: string) => line.match(/^<!--\s*output:\s*(\S+)(?:\s+(match:regex|match:fuzzy|ignore-whitespace))?\s*-->$/);
const isArgs = (line: string) => line.match(/^<!--\s*args:\s*(.+)\s*-->$/);
const isEnv = (line: string) => line.match(/^<!--\s*env:\s*(.+)\s*-->$/);

function startNewSnippet(
    snippets: State,
    fileName: string,
    lineNumber: number,
    language: string,
    indentation: string
) {
    const skip = snippets.skip;
    snippets.skip = false;
    
    const id = snippets.id;
    snippets.id = undefined;
    
    const outputOf = snippets.outputOf;
    snippets.outputOf = undefined;
    
    const outputMode = snippets.outputMode;
    snippets.outputMode = undefined;
    
    const args = snippets.args;
    snippets.args = undefined;
    
    const env = snippets.env;
    snippets.env = undefined;

    let normalizedLang = 'javascript';
    const langLower = language.toLowerCase();
    
    if (['python', 'py'].includes(langLower)) {
        normalizedLang = 'python';
    } else if (['bash', 'sh', 'zsh', 'shell'].includes(langLower)) {
        normalizedLang = langLower === 'shell' ? 'bash' : langLower;
    } else if (langLower === 'go') {
        normalizedLang = 'go';
    } else if (['rust', 'rs'].includes(langLower)) {
        normalizedLang = 'rust';
    } else if (['fortran', 'f90', 'f95'].includes(langLower)) {
        normalizedLang = 'fortran';
    } else if (['cobol', 'cob'].includes(langLower)) {
        normalizedLang = 'cobol';
    } else if (langLower === 'c') {
        normalizedLang = 'c';
    } else if (langLower === 'basic') {
        normalizedLang = 'basic';
    } else if (langLower === 'java') {
        normalizedLang = 'java';
    } else if (['perl', 'pl'].includes(langLower)) {
        normalizedLang = 'perl';
    } else if (['csharp', 'cs'].includes(langLower)) {
        normalizedLang = 'csharp';
    } else if (langLower === 'r') {
        normalizedLang = 'r';
    } else if (['pascal', 'pas'].includes(langLower)) {
        normalizedLang = 'pascal';
    } else if (['text', 'txt', 'output'].includes(langLower)) {
        normalizedLang = 'text';
    }

    return Object.assign(snippets, {
        snippets: snippets.snippets.concat([
            { code: "", language: normalizedLang, fileName, lineNumber, complete: false, skip: skip ?? false, indentation, id, outputOf, outputMode, args, env }
        ])
    });
}

function addLineToLastSnippet(line: string) {
    return function addLine(snippets: State) {
        const lastSnippet = snippets.snippets[snippets.snippets.length - 1];

        if (lastSnippet && !lastSnippet.complete) {
            let lineToAdd = line;
            if (lastSnippet.indentation && line.startsWith(lastSnippet.indentation)) {
                lineToAdd = line.slice(lastSnippet.indentation.length);
            }
            lastSnippet.code += lineToAdd + "\n";
        }

        return snippets;
    };
}

function endSnippet(snippets: State, _fileName: string, lineNumber: number) {
    const lastSnippet = snippets.snippets[snippets.snippets.length - 1];

    if (lastSnippet) {
        lastSnippet.complete = true;
        lastSnippet.endLine = lineNumber;
    }

    return snippets;
}

function skip(snippets: State) {
    snippets.skip = true;
    return snippets;
}

function shareCodeInFile(snippets: State) {
    snippets.shareCodeInFile = true;
    return snippets;
}

function setId(id: string) {
    return (snippets: State) => {
        snippets.id = id;
        return snippets;
    };
}

function setOutputOf(id: string, mode?: string) {
    return (snippets: State) => {
        snippets.outputOf = id;
        if (mode === 'match:regex') {
            snippets.outputMode = 'regex';
        } else if (mode === 'match:fuzzy' || mode === 'ignore-whitespace') {
            snippets.outputMode = 'ignore-whitespace';
        } else {
            snippets.outputMode = 'exact';
        }
        return snippets;
    };
}

function setArgs(argsStr: string) {
    return (snippets: State) => {
        // Simple space splitting, maybe improve for quotes?
        // Assuming simple space separation for now.
        // Filter out empty strings that can occur from leading/trailing whitespace
        snippets.args = argsStr.split(/\s+/).filter(arg => arg.length > 0);
        return snippets;
    };
}

function setEnv(envStr: string) {
    return (snippets: State) => {
        const env: Record<string, string> = {};
        // Parse KEY=VALUE pairs separated by spaces
        const pairs = envStr.split(/\s+/);
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key && value) {
                env[key] = value;
            }
        }
        snippets.env = env;
        return snippets;
    };
}

function parseLine(line: string) {
    const argsMatch = isArgs(line);
    if (argsMatch) {
        return setArgs(argsMatch[1]);
    }
    
    const envMatch = isEnv(line);
    if (envMatch) {
        return setEnv(envMatch[1]);
    }

    const startMatch = isStartOfSnippet(line);
    if (startMatch) {
        // startMatch[1] is indentation, startMatch[2] is language
        return (snippets: State, fileName: string, lineNumber: number) => 
            startNewSnippet(snippets, fileName, lineNumber, startMatch[2], startMatch[1]);
    }

    if (isEndOfSnippet(line)) {
        return endSnippet;
    }

    if (isSkip(line)) {
        return skip;
    }

    if (isCodeSharedInFile(line)) {
        return shareCodeInFile;
    }
    
    const idMatch = isId(line);
    if (idMatch) {
        // console.log("Found ID:", idMatch[1]);
        return setId(idMatch[1]);
    }
    
    const outputMatch = isOutputOf(line);
    if (outputMatch) {
        // console.log("Found OutputOf:", outputMatch[1], "Mode:", outputMatch[2]);
        return setOutputOf(outputMatch[1], outputMatch[2]);
    }
    
    return addLineToLastSnippet(line);
}

function parseCodeSnippets(args: FileInfo): ParsedFile {
    const contents = args.contents;
    const fileName = args.fileName;

    const initialState: State = {
        snippets: [],
        shareCodeInFile: false,
        complete: false
    };

    const results = contents
        .split("\n")
        .map(parseLine)
        .reduce(
            (snippets, lineAction, index) =>
                lineAction(snippets, fileName, index + 1),
            initialState
        );

    const codeSnippets = results.snippets;

    const lastSnippet = codeSnippets[codeSnippets.length - 1];

    if (lastSnippet && !lastSnippet.complete) {
        throw new Error("Snippet parsing was incomplete");
    }

    return {
        fileName,
        codeSnippets,
        shareCodeInFile: results.shareCodeInFile
    };
}

export default parseCodeSnippets;

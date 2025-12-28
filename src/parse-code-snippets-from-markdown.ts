"use strict";

import { State, ParsedFile, FileInfo } from "./types";

// Capture indentation (group 1) and language (group 2)
const START_REGEX = /^(\s*)```\W*(JavaScript|js|es6|ts|typescript|python|py|bash|sh|zsh|shell|go|rust|rs|fortran|f90|f95|cobol|cob|c)\s?$/i;

const isStartOfSnippet = (line: string) => line.match(START_REGEX);
const isEndOfSnippet = (line: string) => line.trim() === "```";
const isSkip = (line: string) => line.trim() === "<!-- skip-example -->";
const isCodeSharedInFile = (line: string) =>
    line.trim() === "<!-- share-code-between-examples -->";

function startNewSnippet(
    snippets: State,
    fileName: string,
    lineNumber: number,
    language: string,
    indentation: string
) {
    const skip = snippets.skip;
    snippets.skip = false;

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
    }

    return Object.assign(snippets, {
        snippets: snippets.snippets.concat([
            { code: "", language: normalizedLang, fileName, lineNumber, complete: false, skip: skip ?? false, indentation }
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

function endSnippet(snippets: State, _fileName: string, _lineNumber: number) {
    const lastSnippet = snippets.snippets[snippets.snippets.length - 1];

    if (lastSnippet) {
        lastSnippet.complete = true;
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

function parseLine(line: string) {
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

export interface Snippet {
    code: string;
    language: string;
    fileName: string;
    lineNumber: number;
    complete: boolean;
    skip: boolean;
    indentation?: string;
}

export interface ParsedFile {
    fileName: string;
    codeSnippets: Snippet[];
    shareCodeInFile: boolean;
}

export interface FileInfo {
    contents: string;
    fileName: string;
}

export interface State {
    snippets: Snippet[];
    shareCodeInFile: boolean;
    skip?: boolean;
    complete: boolean;
}

export interface Config {
    testOutput?: boolean;
    globals?: {
        [key: string]: any;
    };
    require?: {
        [key: string]: any;
    };
    regexRequire?: {
        [key: string]: (...match: string[]) => any;
    };
    beforeEach?: () => any;
    transformCode?: (code: string) => string;
}

export interface Sandbox {
    [key: string]: any;
}

export interface TestResult {
    status: "pass" | "fail" | "skip";
    codeSnippet: Snippet;
    stack: string;
}

export interface Snippet {
    code: string;
    language: string;
    fileName: string;
    lineNumber: number;
    endLine?: number;
    complete: boolean;
    skip: boolean;
    indentation?: string;
    id?: string;
    outputOf?: string;
    outputMode?: 'exact' | 'ignore-whitespace' | 'regex';
    args?: string[];
    env?: Record<string, string>;
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
    id?: string;
    outputOf?: string;
    outputMode?: 'exact' | 'ignore-whitespace' | 'regex';
    args?: string[];
    env?: Record<string, string>;
    complete: boolean;
}

export interface Config {
    testOutput?: boolean;
    updateOutput?: boolean;
    timeout?: number; // Timeout in milliseconds for each snippet execution (default: 300000)
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
    executionTime?: number;
}

import { Snippet, Config, Sandbox } from "../types";

export interface LanguageResult {
    success: boolean;
    stack: string;
    output?: string;
}

export interface LanguageHandler {
    (code: string, snippet: Snippet, config: Config, sandbox: Sandbox, isSharedSandbox: boolean): LanguageResult;
}

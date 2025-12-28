import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const basicHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;

    // If sharing code, we need to accumulate previous basic snippets
    if (isSharedSandbox) {
        if (!context._basicContext) {
            context._basicContext = "";
        }
        // Trim trailing newline from code before adding to avoid blank lines
        // (code already has trailing newline from parser)
        const trimmedCode = code.replace(/\n+$/, '');
        context._basicContext += trimmedCode + "\n";
        code = context._basicContext;
    }

    try {
        // cbmbasic accepts input from stdin
        const timeout = config.timeout || 30000;
        const result = spawnSync('cbmbasic', [], { input: code, encoding: 'utf-8', timeout });
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "BASIC execution failed with non-zero exit code";
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || "Failed to spawn cbmbasic";
        return { success, stack };
    }
};


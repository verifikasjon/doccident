import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

// Check if BASIC code is a complete program (has END statement)
function isCompleteBASIC(code: string): boolean {
    // Look for END as a statement (possibly with line number prefix)
    // Matches: "END", "10 END", "END\n", etc.
    return /^\d*\s*END\s*$/im.test(code);
}

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
        
        // In shared mode, only run when program is complete (has END)
        // Incomplete snippets are setup code - mark as pass without running
        if (!isCompleteBASIC(code)) {
            return { success: true, stack: "", output: "" };
        }
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


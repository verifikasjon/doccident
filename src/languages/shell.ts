import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const shellHandler: LanguageHandler = (code, snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;
    const shell = snippet.language || 'bash';

    // If sharing code, we need to accumulate previous shell snippets
    if (isSharedSandbox) {
        if (!context._shellContext) {
            context._shellContext = {};
        }
        if (!context._shellContext[shell]) {
            context._shellContext[shell] = "";
        }
        
        context._shellContext[shell] += code + "\n";
        code = context._shellContext[shell];
    }

    try {
        const args = snippet.args || [];
        const env = snippet.env ? { ...process.env, ...snippet.env } : undefined;
        
        // Use the detected shell
        // shell -s arg1 arg2 reads from stdin and passes args
        const spawnArgs = ['-s', ...args];
        
        const timeout = config.timeout || 30000;
        const result = spawnSync(shell, spawnArgs, { input: code, encoding: 'utf-8', env, timeout });
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            const exitCode = result.status !== null ? result.status : 'signal';
            stack = result.stderr || result.stdout || `${shell} execution failed with non-zero exit code: ${exitCode}`;
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || `Failed to spawn ${shell}`;
        return { success, stack };
    }
};

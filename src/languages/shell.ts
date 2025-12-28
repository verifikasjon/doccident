import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const shellHandler: LanguageHandler = (code, snippet, _config, sandbox, isSharedSandbox) => {
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
        // Use the detected shell
        const result = spawnSync(shell, ['-s'], { input: code, encoding: 'utf-8' });
        if (result.status === 0) {
            success = true;
        } else {
            const exitCode = result.status !== null ? result.status : 'signal';
            stack = result.stderr || result.stdout || `${shell} execution failed with non-zero exit code: ${exitCode}`;
        }
    } catch (e: any) {
        stack = e.message || `Failed to spawn ${shell}`;
    }

    return { success, stack };
};

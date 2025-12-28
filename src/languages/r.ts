import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const rHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;

    // If sharing code, we need to accumulate previous R snippets
    if (isSharedSandbox) {
        if (!context._rContext) {
            context._rContext = "";
        }
        context._rContext += code + "\n";
        code = context._rContext;
    }

    try {
        // Rscript - runs R code from stdin
        const timeout = config.timeout || 30000;
        const result = spawnSync('Rscript', ['-'], { input: code, encoding: 'utf-8', timeout });
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "R execution failed with non-zero exit code";
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || "Failed to spawn Rscript";
        return { success, stack };
    }
};


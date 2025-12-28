import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const pythonHandler: LanguageHandler = (code, snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;

    // If sharing code, we need to accumulate previous python snippets
    if (isSharedSandbox) {
        if (!context._pythonContext) {
            context._pythonContext = "";
        }
        context._pythonContext += code + "\n";
        code = context._pythonContext;
    }

    try {
        const args = snippet.args || [];
        const env = snippet.env ? { ...process.env, ...snippet.env } : undefined;
        const timeout = config.timeout || 30000;
        
        // For python, args usually go to the script or interpreter?
        // If we want to pass args to the script, we might need to invoke differently if using stdin.
        // `python3 - arg1 arg2` reads from stdin.
        // Let's prepend '-' to args if not empty, so python knows to read script from stdin before args.
        // But spawnSync args array includes 'python3' arguments.
        // If user supplies `-v`, it should be `python3 -v`.
        // If user supplies script args, they come after.
        // This is tricky. Let's assume user provides INTERPRETER args for now, as typical.
        // Or if they start with `-`, they are interpreter args.
        
        const spawnArgs = [...args];
        
        const result = spawnSync('python3', spawnArgs, { input: code, encoding: 'utf-8', env, timeout });
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "Python execution failed with non-zero exit code";
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || "Failed to spawn python3";
        return { success, stack };
    }
};


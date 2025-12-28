import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const pythonHandler: LanguageHandler = (code, _snippet, _config, sandbox, isSharedSandbox) => {
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
        const result = spawnSync('python3', [], { input: code, encoding: 'utf-8' });
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "Python execution failed with non-zero exit code";
        }
    } catch (e: any) {
        stack = e.message || "Failed to spawn python3";
    }

    return { success, stack };
};


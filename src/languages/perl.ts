import { spawnSync } from "child_process";
import { LanguageHandler } from "./interface";

export const perlHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;

    // If sharing code, we need to accumulate previous perl snippets
    if (isSharedSandbox) {
        if (!context._perlContext) {
            context._perlContext = "";
        }
        context._perlContext += code + "\n";
        code = context._perlContext;
    }

    try {
        const timeout = config.timeout || 30000;
        const result = spawnSync('perl', [], { input: code, encoding: 'utf-8', timeout });
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "Perl execution failed with non-zero exit code";
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || "Failed to spawn perl";
    }

    return { success, stack };
};


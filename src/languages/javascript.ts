import { runInNewContext } from "vm";
import { transformSync } from "esbuild";
import { LanguageHandler } from "./interface";

export const javascriptHandler: LanguageHandler = (code, _snippet, config, sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    let output = "";
    
    // Capture console.log
    const originalLog = sandbox.console.log;
    sandbox.console.log = (...args: any[]) => {
        output += args.map(String).join(' ') + '\n';
        if (originalLog) originalLog(...args);
    };

    try {
        const result = transformSync(code, {
            loader: 'ts',
            format: 'cjs',
            target: 'node12'
        });
        const compiledCode = result.code || "";

        const timeout = config.timeout || 30000;
        runInNewContext(compiledCode, sandbox, { timeout });

        success = true;
    } catch (e: any) {
        if (e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
            stack = `Execution timed out after ${config.timeout || 30000}ms`;
        } else {
            stack = e.stack || "";
        }
    } finally {
        // Restore console.log? Not strictly necessary as sandbox is recreated or dedicated
        // But if shared sandbox, we might want to keep accumulating output?
        // No, output capture is per-snippet usually.
        // But if shared sandbox is reused, `output` variable here is local.
        // We override sandbox.console.log every time.
        // Ideally we should restore it to avoid nesting if we re-use the sandbox object in a way that stacks?
        // But `makeTestSandbox` creates a fresh object or we reuse the same one.
        // If we reuse, `sandbox.console.log` is overwritten.
        // We should probably save the original log from the *very first* time?
        // Actually, `makeTestSandbox` sets `console.log: () => null` or `console`.
        // So we are wrapping that.
    }

    return { success, stack, output: output.trimEnd() }; // Trim trailing newline for easier comparison
};


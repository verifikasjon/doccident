import { runInNewContext } from "vm";
import { transformSync } from "esbuild";
import { LanguageHandler } from "./interface";

export const javascriptHandler: LanguageHandler = (code, _snippet, _config, sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    try {
        const result = transformSync(code, {
            loader: 'ts',
            format: 'cjs',
            target: 'node12'
        });
        const compiledCode = result.code || "";

        runInNewContext(compiledCode, sandbox);

        success = true;
    } catch (e: any) {
        stack = e.stack || "";
    }

    return { success, stack };
};


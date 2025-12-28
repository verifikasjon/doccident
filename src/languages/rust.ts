import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const rustHandler: LanguageHandler = (code, _snippet, _config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // Rust execution logic
    // Auto-wrap in main function if not present
    let rustCode = code;
    if (!rustCode.includes('fn main()')) {
        rustCode = `fn main() {
 ${rustCode}
 }`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_rust_${uniqueId}.rs`);
    const tempExeFile = join(tmpdir(), `doccident_rust_${uniqueId}`);
     
    try {
        writeFileSync(tempSourceFile, rustCode);
         
        // Compile
        const compileResult = spawnSync('rustc', [tempSourceFile, '-o', tempExeFile], { encoding: 'utf-8' });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "Rust compilation failed";
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8' });
             
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "Rust execution failed with non-zero exit code";
            }
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute rustc or run binary";
    } finally {
        try {
            if (existsSync(tempSourceFile)) unlinkSync(tempSourceFile);
            if (existsSync(tempExeFile)) unlinkSync(tempExeFile);
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};


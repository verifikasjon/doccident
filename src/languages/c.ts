import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const cHandler: LanguageHandler = (code, _snippet, _config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // C execution logic
    // Auto-wrap in main function if not present
    let cCode = code;
    if (!cCode.includes('main(')) {
        cCode = `#include <stdio.h>
 int main() {
 ${cCode}
 return 0;
 }`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_c_${uniqueId}.c`);
    const tempExeFile = join(tmpdir(), `doccident_c_${uniqueId}`);
     
    try {
        writeFileSync(tempSourceFile, cCode);
         
        // Compile with gcc
        const compileResult = spawnSync('gcc', [tempSourceFile, '-o', tempExeFile], { encoding: 'utf-8' });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "C compilation failed";
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8' });
             
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "C execution failed with non-zero exit code";
            }
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute gcc or run binary";
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


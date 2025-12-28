import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const cobolHandler: LanguageHandler = (code, _snippet, config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // COBOL execution logic
    // Use shorter filename as cobc has strict length limits
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const tempSourceFile = join(tmpdir(), `cob_${uniqueId}.cob`);
    const tempExeFile = join(tmpdir(), `cob_${uniqueId}`);
    const timeout = config.timeout || 30000;

    try {
        writeFileSync(tempSourceFile, code);

        // Compile with cobc -x (executable) -free (free format)
        const compileResult = spawnSync('cobc', ['-x', '-free', '-o', tempExeFile, tempSourceFile], { encoding: 'utf-8', timeout });

        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "COBOL compilation failed";
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8', timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "COBOL execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute cobc or run binary";
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


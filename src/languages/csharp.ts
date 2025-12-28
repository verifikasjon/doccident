import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync, mkdirSync, rmSync, rmdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const csharpHandler: LanguageHandler = (code, _snippet, config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // C# execution logic
    // Auto-wrap in class Program and Main method if not present
    let csCode = code;
    const className = "Program";
    
    // Simple heuristic to detect if class is provided
    if (!csCode.includes("class ")) {
        csCode = `using System;
public class ${className} {
    public static void Main(string[] args) {
        ${csCode}
    }
}`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempDir = join(tmpdir(), `doccident_csharp_${uniqueId}`);
    const timeout = config.timeout || 30000;
    
    try {
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir);
        }

        const tempSourceFile = join(tempDir, `${className}.cs`);
        const tempExeFile = join(tempDir, `${className}.exe`);

        writeFileSync(tempSourceFile, csCode);
         
        // Compile with mcs (Mono Compiler)
        const compileResult = spawnSync('mcs', ['-out:' + tempExeFile, tempSourceFile], { encoding: 'utf-8', cwd: tempDir, timeout });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "C# compilation failed (mcs)";
        } else {
            // Run with mono
            const runResult = spawnSync('mono', [tempExeFile], { encoding: 'utf-8', cwd: tempDir, timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "C# execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute mcs or mono";
    } finally {
        try {
            if (rmSync) {
                rmSync(tempDir, { recursive: true, force: true });
            } else {
                if (existsSync(join(tempDir, `${className}.cs`))) unlinkSync(join(tempDir, `${className}.cs`));
                if (existsSync(join(tempDir, `${className}.exe`))) unlinkSync(join(tempDir, `${className}.exe`));
                if (existsSync(tempDir)) rmdirSync(tempDir);
            }
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};

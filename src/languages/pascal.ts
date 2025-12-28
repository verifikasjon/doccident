import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync, mkdirSync, rmSync, rmdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const pascalHandler: LanguageHandler = (code, _snippet, config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // Pascal execution logic
    // Auto-wrap in program block if not present
    let pascalCode = code;
    let programName = "TestProgram";
    
    // Simple heuristic to detect if program is provided
    if (!pascalCode.toLowerCase().includes("program ")) {
        pascalCode = `program ${programName};
begin
    ${pascalCode}
end.`;
    } else {
        // Try to extract program name if provided
        const match = pascalCode.match(/program\s+(\w+);/i);
        if (match) {
            programName = match[1];
        }
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempDir = join(tmpdir(), `doccident_pascal_${uniqueId}`);
    const timeout = config.timeout || 30000;
    
    try {
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir);
        }

        const tempSourceFile = join(tempDir, `${programName}.pas`);
        const tempExeFile = join(tempDir, programName); // fpc creates executable with program name by default (or we specify -o)

        writeFileSync(tempSourceFile, pascalCode);
         
        // Compile with fpc
        // -o specifies output file name
        const compileResult = spawnSync('fpc', [`-o${tempExeFile}`, tempSourceFile], { encoding: 'utf-8', cwd: tempDir, timeout });
         
        if (compileResult.status !== 0) {
            // Filter out the banner to just show the error if possible, or show all stderr/stdout
            // fpc outputs errors to stdout often
            stack = compileResult.stdout + "\n" + compileResult.stderr || "Pascal compilation failed";
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8', cwd: tempDir, timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "Pascal execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute fpc";
    } finally {
        try {
            if (rmSync) {
                rmSync(tempDir, { recursive: true, force: true });
            } else {
                // Cleanup fallback
                if (existsSync(join(tempDir, `${programName}.pas`))) unlinkSync(join(tempDir, `${programName}.pas`));
                if (existsSync(join(tempDir, `${programName}.o`))) unlinkSync(join(tempDir, `${programName}.o`));
                if (existsSync(join(tempDir, programName))) unlinkSync(join(tempDir, programName));
                if (existsSync(tempDir)) rmdirSync(tempDir);
            }
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};

import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync, mkdirSync, rmSync, rmdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const javaHandler: LanguageHandler = (code, _snippet, config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // Java execution logic
    // Auto-wrap in class Main and main method if not present
    let javaCode = code;
    let className = "Main";
    
    // Simple heuristic to detect if class is provided or just snippet
    if (!javaCode.includes("class ")) {
        javaCode = `public class ${className} {
    public static void main(String[] args) {
        ${javaCode}
    }
}`;
    } else {
        // Try to extract class name if provided
        const classMatch = javaCode.match(/class\s+(\w+)/);
        if (classMatch) {
            className = classMatch[1];
        } else {
            // Fallback or error? For now assume user knows what they are doing if they write "class" 
            // but maybe we should ensure file name matches public class
        }
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // Create a unique directory for this execution to avoid class name collisions
    // if running parallel or multiple Main classes
    const tempDir = join(tmpdir(), `doccident_java_${uniqueId}`);
    
    const timeout = config.timeout || 30000;
    
    // We need to make the directory
    try {
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir);
        }

        const tempSourceFile = join(tempDir, `${className}.java`);

        writeFileSync(tempSourceFile, javaCode);
         
        // Compile with javac
        const compileResult = spawnSync('javac', [tempSourceFile], { encoding: 'utf-8', cwd: tempDir, timeout });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "Java compilation failed";
        } else {
            // Run
            const runResult = spawnSync('java', ['-cp', tempDir, className], { encoding: 'utf-8', cwd: tempDir, timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "Java execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute javac or java";
    } finally {
        try {
            // Cleanup: remove file and directory
            // This is a bit manual, but fs.rmSync is available in node 14+
            if (rmSync) {
                rmSync(tempDir, { recursive: true, force: true });
            } else {
                // Fallback for older nodes if necessary, but we are on node 22 in CI
                if (existsSync(join(tempDir, `${className}.java`))) unlinkSync(join(tempDir, `${className}.java`));
                if (existsSync(join(tempDir, `${className}.class`))) unlinkSync(join(tempDir, `${className}.class`));
                if (existsSync(tempDir)) rmdirSync(tempDir);
            }
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};

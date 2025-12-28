import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const rustHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;
    let rustCode = code;

    // Handle shared state
    if (isSharedSandbox) {
        if (!context._rustCode) {
            context._rustCode = "";
        }
        context._rustCode += code + "\n";
        rustCode = context._rustCode;
    }

    let finalSource = "";

    // Parse attributes vs body
    // We want to lift crate-level attributes (#![...]) to the top
    // Everything else goes inside main
    
    // Check if code already has fn main() at the top level?
    // If users provide a full program with main(), wrapping it in another main is weird but valid.
    // However, for shared state, we generally assume "script mode".
    // If not shared, we stick to the old logic (check for main, if not present wrap).
    
    if (!isSharedSandbox) {
        if (!rustCode.includes('fn main()')) {
            finalSource = `fn main() {
${rustCode}
}`;
        } else {
            finalSource = rustCode;
        }
    } else {
        // Shared state mode
        const lines = rustCode.split('\n');
        const attributes: string[] = [];
        const body: string[] = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#![') || trimmed.startsWith('extern crate ')) {
                attributes.push(line);
            } else {
                body.push(line);
            }
        }
        
        finalSource = `${attributes.join('\n')}

fn main() {
${body.join('\n')}
}`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_rust_${uniqueId}.rs`);
    const tempExeFile = join(tmpdir(), `doccident_rust_${uniqueId}`);
    const timeout = config.timeout || 30000;
     
    try {
        writeFileSync(tempSourceFile, finalSource);
         
        // Compile
        const compileResult = spawnSync('rustc', [tempSourceFile, '-o', tempExeFile], { encoding: 'utf-8', timeout });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "Rust compilation failed";
            if (isSharedSandbox) {
                stack += `\n\nGenerated Source:\n${finalSource}`;
            }
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8', timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "Rust execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
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

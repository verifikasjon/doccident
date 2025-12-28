import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

// Helper to parse C code
function parseCCode(fullCode: string) {
    const lines = fullCode.split('\n');
    const includes: string[] = [];
    let topLevel = "";
    let mainBody = "";
    
    let state: 'NORMAL' | 'IN_TOP_LEVEL_BLOCK' = 'NORMAL';
    let braceCount = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            // Empty lines preserve structure slightly better if added to last active section
            // or just ignore. Let's add to mainBody if normal, or topLevel if in block.
            if (state === 'IN_TOP_LEVEL_BLOCK') topLevel += "\n";
            else mainBody += "\n";
            continue;
        }

        if (state === 'NORMAL') {
            if (trimmed.startsWith('#')) {
                includes.push(line);
            } else if (
                trimmed.startsWith('struct ') ||
                trimmed.startsWith('union ') ||
                trimmed.startsWith('enum ') ||
                trimmed.startsWith('typedef ') ||
                // Function definition heuristic: ReturnType Name(Args) {
                // Must end with {
                (trimmed.endsWith('{') && !trimmed.startsWith('if') && !trimmed.startsWith('for') && !trimmed.startsWith('while') && !trimmed.startsWith('switch') && !trimmed.startsWith('do'))
            ) {
                topLevel += line + "\n";
                // Count braces
                const open = (line.match(/\{/g) || []).length;
                const close = (line.match(/\}/g) || []).length;
                braceCount = open - close;
                
                if (braceCount > 0) {
                    state = 'IN_TOP_LEVEL_BLOCK';
                }
            } else {
                // Statements, variable declarations (int x;), etc. go to main
                mainBody += line + "\n";
            }
        } else if (state === 'IN_TOP_LEVEL_BLOCK') {
            topLevel += line + "\n";
            const open = (line.match(/\{/g) || []).length;
            const close = (line.match(/\}/g) || []).length;
            braceCount += open - close;
            
            if (braceCount <= 0) {
                state = 'NORMAL';
                braceCount = 0;
            }
        }
    }
    
    return { includes, topLevel, mainBody };
}

export const cHandler: LanguageHandler = (code, snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;
    let cCode = code;

    // Handle shared state
    if (isSharedSandbox) {
        if (!context._cCode) {
            context._cCode = "";
        }
        context._cCode += code + "\n";
        cCode = context._cCode;
    }

    let finalSource = "";

    // If main is explicitly provided, use it (disable parsing/wrapping)
    // But in shared mode, we usually want to compose.
    // If user provides "int main() { ... }" in a snippet, we assume they take full control?
    // Or do we try to merge? 
    // Merging multiple mains is impossible.
    // So if any snippet contains "int main", we might just assume it's the full program so far?
    // But earlier snippets might be structs/includes.
    // Let's assume if "int main" or "void main" is present, we respect it, 
    // but we still might want to prepend includes from previous snippets if they were separate?
    // For simplicity: If "main(" found, treat as full program.
    // But parsing is safer for "includes" + "functions" + "statements".
    
    if (cCode.includes('main(')) {
        // If shared sandbox, we might have accumulated a main from previous snippets?
        // No, if we are parsing, we construct main.
        // If the USER typed main, we trust them.
        finalSource = cCode;
        
        // Auto-add stdio.h if missing and needed?
        if (!finalSource.includes('<stdio.h>') && finalSource.includes('printf')) {
            finalSource = `#include <stdio.h>\n${finalSource}`;
        }
    } else {
        const { includes, topLevel, mainBody } = parseCCode(cCode);
        
        // Auto-add stdio.h if needed
        let autoIncludes = "";
        const includesStr = includes.join('\n');
        if (!includesStr.includes('<stdio.h>') && (topLevel.includes('printf') || mainBody.includes('printf'))) {
            autoIncludes = `#include <stdio.h>\n`;
        }

        finalSource = `${autoIncludes}${includesStr}

${topLevel}

int main() {
${mainBody}
    return 0;
}`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_c_${uniqueId}.c`);
    const tempExeFile = join(tmpdir(), `doccident_c_${uniqueId}`);
     
    try {
        const args = snippet.args || [];
        const env = snippet.env ? { ...process.env, ...snippet.env } : undefined;
        const timeout = config.timeout || 30000;

        writeFileSync(tempSourceFile, finalSource);
         
        // Compile with gcc
        // args passed to GCC (compiler flags)
        const compileResult = spawnSync('gcc', [tempSourceFile, '-o', tempExeFile, ...args], { encoding: 'utf-8', timeout });
         
        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "C compilation failed";
            if (isSharedSandbox) {
                stack += `\n\nGenerated Source:\n${finalSource}`;
            }
        } else {
            // Run
            // What if we want runtime args? 
            // Currently args are compiler flags.
            // Maybe we need separate config for runtime args? 
            // For now, adhering to "arguments to compilers/interpreters".
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8', env, timeout });
            
            if (runResult.error && (runResult.error as any).code === 'ETIMEDOUT') {
                return { success: false, stack: `Execution timed out after ${timeout}ms` };
            }
            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "C execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
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

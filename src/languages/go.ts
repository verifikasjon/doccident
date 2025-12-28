import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

// Helper to parse Go code into imports, top-level decls, and main body
function parseGoCode(fullCode: string) {
    const lines = fullCode.split('\n');
    const imports: string[] = [];
    let topLevel = "";
    let mainBody = "";
    
    let state: 'NORMAL' | 'IN_IMPORT_BLOCK' | 'IN_BRACE_BLOCK' = 'NORMAL';
    let braceCount = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip package main lines in shared snippets
        if (trimmed.startsWith('package main')) continue;
        
        if (state === 'NORMAL') {
            if (trimmed.startsWith('import')) {
                if (trimmed.includes('(')) {
                    state = 'IN_IMPORT_BLOCK';
                    imports.push(line);
                } else {
                    imports.push(line);
                }
            } else if (
                trimmed.startsWith('func ') || 
                trimmed.startsWith('type ') || 
                trimmed.startsWith('const ') || 
                trimmed.startsWith('var ')
            ) {
                // Heuristic: Top level declaration
                topLevel += line + "\n";
                // Count braces
                const open = (line.match(/\{/g) || []).length;
                const close = (line.match(/\}/g) || []).length;
                braceCount = open - close;
                
                if (braceCount > 0) {
                    state = 'IN_BRACE_BLOCK';
                }
            } else {
                mainBody += line + "\n";
            }
        } else if (state === 'IN_IMPORT_BLOCK') {
            imports.push(line);
            if (trimmed.includes(')')) {
                state = 'NORMAL';
            }
        } else if (state === 'IN_BRACE_BLOCK') {
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
    
    return { imports, topLevel, mainBody };
}

export const goHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";
    
    const context = sandbox as any;
    let fullCode = code;

    // Handle shared state
    if (isSharedSandbox) {
        if (!context._goCode) {
            context._goCode = "";
        }
        context._goCode += code + "\n";
        fullCode = context._goCode;
    }
    
    let finalSource = "";
    
    // If explicit package main is present, use as is (unless shared?)
    if (fullCode.includes('package main') && !isSharedSandbox) {
        finalSource = fullCode;
    } else {
        const { imports, topLevel, mainBody } = parseGoCode(fullCode);
        
        // Auto-add fmt if used but not imported
        const importsStr = imports.join('\n');
        let autoImports = "";
        if (!importsStr.includes('"fmt"') && (topLevel.includes('fmt.') || mainBody.includes('fmt.'))) {
            autoImports = 'import "fmt"';
        }
        
        finalSource = `package main
${autoImports}
${importsStr}

${topLevel}

func main() {
${mainBody}
}`;
    }

    const tempFile = join(tmpdir(), `doccident_go_${Date.now()}_${Math.random().toString(36).substring(7)}.go`);
    const timeout = config.timeout || 30000;
    
    try {
        writeFileSync(tempFile, finalSource);
        
        let result = spawnSync('go', ['run', tempFile], { encoding: 'utf-8', timeout });
        
        // Retry logic for unused imports
        if (result.status !== 0 && result.stderr && result.stderr.includes("imported and not used")) {
            const lines = finalSource.split('\n');
            const errorLines = result.stderr.split('\n');
            let modified = false;
            
            errorLines.forEach(err => {
                const match = err.match(/:(\d+):\d+: "(.+)" imported and not used/);
                if (match) {
                    const lineNum = parseInt(match[1], 10);
                    // Comment out the unused import line (using 1-based index from error)
                    if (lines[lineNum - 1]) {
                        lines[lineNum - 1] = "// " + lines[lineNum - 1];
                        modified = true;
                    }
                }
            });
            
            if (modified) {
                const retriedSource = lines.join('\n');
                writeFileSync(tempFile, retriedSource);
                result = spawnSync('go', ['run', tempFile], { encoding: 'utf-8', timeout });
            }
        }
        
        if (result.error && (result.error as any).code === 'ETIMEDOUT') {
            return { success: false, stack: `Execution timed out after ${timeout}ms` };
        }
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "Go execution failed with non-zero exit code";
            // Debug output for shared state issues
            if (isSharedSandbox) {
                stack += `\n\nGenerated Source:\n${finalSource}`;
            }
        }
        return { success, stack, output: result.stdout };
    } catch (e: any) {
        stack = e.message || "Failed to execute go run";
    } finally {
        try {
            unlinkSync(tempFile);
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};

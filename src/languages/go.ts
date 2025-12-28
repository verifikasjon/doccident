import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const goHandler: LanguageHandler = (code, _snippet, _config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";
    
    // No shared context for Go yet, as it's compiled and strict structure
    // We support standalone files or body snippets wrapped in main
    
    let goCode = code;
    if (!goCode.includes('package main')) {
        goCode = `package main
import "fmt"
func main() {
${goCode}
}`;
    }

    const tempFile = join(tmpdir(), `doccident_go_${Date.now()}_${Math.random().toString(36).substring(7)}.go`);
    
    try {
        writeFileSync(tempFile, goCode);
        
        const result = spawnSync('go', ['run', tempFile], { encoding: 'utf-8' });
        
        if (result.status === 0) {
            success = true;
        } else {
            stack = result.stderr || "Go execution failed with non-zero exit code";
        }
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


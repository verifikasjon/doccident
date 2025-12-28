import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const fortranHandler: LanguageHandler = (code, _snippet, config, sandbox, isSharedSandbox) => {
    let success = false;
    let stack = "";

    const context = sandbox as any;
    let fortranCode = code;

    // Handle shared state
    if (isSharedSandbox) {
        if (!context._fortranCode) {
            context._fortranCode = "";
        }
        context._fortranCode += code + "\n";
        fortranCode = context._fortranCode;
    }

    let finalSource = "";

    // Parse modules vs program
    // We want to lift modules to the top, before the program block
    
    if (!isSharedSandbox) {
        // Legacy/Single snippet mode
        if (!fortranCode.toLowerCase().includes('program ')) {
            finalSource = `program main
${fortranCode}
end program main`;
        } else {
            finalSource = fortranCode;
        }
    } else {
        // Shared state mode
        // We need to separate modules, subroutines/functions (external), and the main program body.
        // However, standard Fortran requires:
        // MODULES
        // PROGRAM
        // 
        // If the user provides snippets that are just code (print *, ...), they belong in PROGRAM.
        // If they provide MODULE ..., it belongs at top level.
        // If they provide SUBROUTINE ... inside a module or program? 
        // 
        // Strategy:
        // 1. Extract MODULE blocks.
        // 2. Extract SUBROUTINE/FUNCTION blocks that are top-level? Or assume they are contained?
        //    Actually, simple subroutines can be outside/after program if using CONTAINS? 
        //    No, simplest structure is:
        //    MODULES...
        //    PROGRAM main
        //      USE modules...
        //      IMPLICIT NONE
        //      ... statements ...
        //    END PROGRAM main
        
        // Let's implement a simple parser that looks for MODULE ... END MODULE blocks.
        
        const lines = fortranCode.split('\n');
        const modules: string[] = [];
        const programBody: string[] = [];
        
        let inModule = false;
        let moduleBuffer: string[] = [];
        
        for (const line of lines) {
            const trimmed = line.trim().toLowerCase();
            
            if (trimmed.startsWith('module ') && !trimmed.startsWith('module procedure') && !inModule) {
                inModule = true;
                moduleBuffer.push(line);
            } else if (inModule) {
                moduleBuffer.push(line);
                if (trimmed.startsWith('end module')) {
                    inModule = false;
                    modules.push(moduleBuffer.join('\n'));
                    moduleBuffer = [];
                }
            } else {
                // If it's a "use" statement, it should be at the top of program?
                // Or "implicit none"?
                // We'll just dump everything else into the program body for now.
                // NOTE: If users provide a full PROGRAM block in shared mode, this breaks.
                // We assume shared mode = snippets building up a program.
                if (!trimmed.startsWith('program ') && !trimmed.startsWith('end program')) {
                    programBody.push(line);
                }
            }
        }
        
        // If we have open module buffer (unclosed), dump it to body? Or fail? 
        // Or assume it's just code.
        if (inModule) {
            // Fallback
            programBody.push(...moduleBuffer);
        }
        
        // Detect dependencies (USE statements)
        // Move USE statements to the top of the program body
        const useStatements: string[] = [];
        const otherStatements: string[] = [];
        
        for (const line of programBody) {
            const trimmed = line.trim().toLowerCase();
            if (trimmed.startsWith('use ')) {
                useStatements.push(line);
            } else {
                otherStatements.push(line);
            }
        }

        finalSource = `${modules.join('\n\n')}

program main
${useStatements.join('\n')}
implicit none
${otherStatements.join('\n')}
end program main`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_fortran_${uniqueId}.f90`);
    const tempExeFile = join(tmpdir(), `doccident_fortran_${uniqueId}`);
    const timeout = config.timeout || 30000;

    try {
        writeFileSync(tempSourceFile, finalSource);

        // Compile with gfortran
        const compileResult = spawnSync('gfortran', [tempSourceFile, '-o', tempExeFile], { encoding: 'utf-8', timeout });

        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "Fortran compilation failed";
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
                stack = runResult.stderr || "Fortran execution failed with non-zero exit code";
            }
            return { success, stack, output: runResult.stdout };
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute gfortran or run binary";
    } finally {
        try {
            if (existsSync(tempSourceFile)) unlinkSync(tempSourceFile);
            if (existsSync(tempExeFile)) unlinkSync(tempExeFile);
            // Cleanup .mod files generated by modules
            // They are usually in the cwd (tmpdir)
            // We can try to clean them up if we know the module names, or just ignore for now as tmpdir is cleaned by OS eventually?
            // Actually, we are running in tmpdir, so .mod files will pollute it? 
            // Better to run in a specific subdir like other handlers to avoid collisions.
        } catch {
            // Ignore cleanup error
        }
    }

    return { success, stack };
};

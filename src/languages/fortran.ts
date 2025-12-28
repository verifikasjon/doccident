import { spawnSync } from "child_process";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { LanguageHandler } from "./interface";

export const fortranHandler: LanguageHandler = (code, _snippet, _config, _sandbox, _isSharedSandbox) => {
    let success = false;
    let stack = "";

    // Fortran execution logic
    // Auto-wrap if 'program' is missing
    let fortranCode = code;
    if (!fortranCode.toLowerCase().includes('program ')) {
        fortranCode = `program main
 ${fortranCode}
 end program main`;
    }

    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempSourceFile = join(tmpdir(), `doccident_fortran_${uniqueId}.f90`);
    const tempExeFile = join(tmpdir(), `doccident_fortran_${uniqueId}`);

    try {
        writeFileSync(tempSourceFile, fortranCode);

        // Compile with gfortran
        const compileResult = spawnSync('gfortran', [tempSourceFile, '-o', tempExeFile], { encoding: 'utf-8' });

        if (compileResult.status !== 0) {
            stack = compileResult.stderr || "Fortran compilation failed";
        } else {
            // Run
            const runResult = spawnSync(tempExeFile, [], { encoding: 'utf-8' });

            if (runResult.status === 0) {
                success = true;
            } else {
                stack = runResult.stderr || "Fortran execution failed with non-zero exit code";
            }
        }
    } catch (e: any) {
        stack = e.message || "Failed to execute gfortran or run binary";
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


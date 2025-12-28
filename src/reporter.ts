/* eslint-disable no-console */
import chalk from "chalk";
import { TestResult } from "./types";

export function printResults(results: TestResult[]) {
    results.filter((result) => result.status === "fail").forEach(printFailure);

    const passingCount = results.filter((result) => result.status === "pass")
        .length;
    const failingCount = results.filter((result) => result.status === "fail")
        .length;
    const skippingCount = results.filter((result) => result.status === "skip")
        .length;

    function successfulRun() {
        return failingCount === 0;
    }

    console.log(chalk.green("Passed: " + passingCount));

    if (skippingCount > 0) {
        console.log(chalk.yellow("Skipped: " + skippingCount));
    }

    if (successfulRun()) {
        console.log(chalk.green("\nSuccess!"));
    } else {
        console.log(chalk.red("Failed: " + failingCount));
    }

    // Summary Table
    console.log("\nSummary Table:");

    const headers = { lang: 'Language', file: 'File', line: 'Line', status: 'Status', time: 'Time (ms)' };
    
    const rows = results.map(r => {
        return {
            lang: r.codeSnippet.language || 'text',
            file: r.codeSnippet.fileName,
            line: r.codeSnippet.lineNumber.toString(),
            status: r.status === 'pass' ? '✅' : (r.status === 'skip' ? '⏭️' : '❌'),
            time: r.executionTime ? r.executionTime.toFixed(2) : '-'
        };
    });

    const widths = {
        lang: headers.lang.length,
        file: headers.file.length,
        line: headers.line.length,
        status: headers.status.length,
        time: headers.time.length
    };

    rows.forEach(row => {
        widths.lang = Math.max(widths.lang, row.lang.length);
        widths.file = Math.max(widths.file, row.file.length);
        widths.line = Math.max(widths.line, row.line.length);
        // Emojis are tricky. Let's assume they take 2 visual columns.
        // '✅'.length is 1, '❌'.length is 1, '⏭️'.length is 2.
        // We'll trust the string length for now but maybe ensure minimum for status?
        widths.status = Math.max(widths.status, [...row.status].length); 
        widths.time = Math.max(widths.time, row.time.length);
    });

    const padRight = (str: string, width: number) => str + ' '.repeat(Math.max(0, width - str.length));
    const padLeft = (str: string, width: number) => ' '.repeat(Math.max(0, width - str.length)) + str;

    // Header
    console.log(`| ${padRight(headers.lang, widths.lang)} | ${padRight(headers.file, widths.file)} | ${padLeft(headers.line, widths.line)} | ${padRight(headers.status, widths.status)} | ${padLeft(headers.time, widths.time)} |`);
    
    // Separator
    console.log(`|-${'-'.repeat(widths.lang)}-|-${'-'.repeat(widths.file)}-|-${'-'.repeat(widths.line)}-|-${'-'.repeat(widths.status)}-|-${'-'.repeat(widths.time)}-|`);

    // Rows
    rows.forEach(row => {
        console.log(`| ${padRight(row.lang, widths.lang)} | ${padRight(row.file, widths.file)} | ${padLeft(row.line, widths.line)} | ${padRight(row.status, widths.status)} | ${padLeft(row.time, widths.time)} |`);
    });
}

function printFailure(result: TestResult) {
    console.log(chalk.red(`Failed - ${markDownErrorLocation(result)}`));

    const stackDetails = relevantStackDetails(result.stack);

    console.log(stackDetails);

    const variableNotDefined = stackDetails.match(/(\w{1,256}) is not defined/);

    if (variableNotDefined) {
        const variableName = variableNotDefined[1];

        console.log(
            `You can declare ${chalk.blue(variableName)} in the ${chalk.blue(
                "globals",
            )
            } section in ${chalk.grey(".doccident-setup.js")}`,
        );

        console.log(`
For example:
${chalk.grey("// .doccident-setup.js")}
module.exports = {
  globals: {
    ${chalk.blue(variableName)}: ...
  }
}
    `);
    }
}

function relevantStackDetails(stack: string) {
    const evalIndex = stack.indexOf("at eval");

    if (evalIndex !== -1) {
        return stack.substring(0, evalIndex);
    }

    const lines = stack.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("doctest.js") && line.trim().startsWith("at ")) {
            return lines.slice(0, i).join("\n") + "\n";
        }
    }

    return stack;
}

function markDownErrorLocation(result: TestResult) {
    const lines = result.stack.split("\n");

    for (const line of lines) {
        if (line.includes("eval")) {
            const match = line.match(/<([^><]+)>:(\d+):(\d+)/);

            if (match) {
                const mdLineNumber = parseInt(match[2], 10);
                const columnNumber = parseInt(match[3], 10);

                const lineNumber = result.codeSnippet.lineNumber + mdLineNumber;

                return `${result.codeSnippet.fileName}:${lineNumber}:${columnNumber}`;
            }
        }
    }

    return `${result.codeSnippet.fileName}:${result.codeSnippet.lineNumber}`;
}


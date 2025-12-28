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


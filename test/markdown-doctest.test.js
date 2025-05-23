/* globals describe, it, beforeEach, afterEach */
"use strict";

import path from "path";
import assert from "assert";
import * as doctest from "../src/doctest";

const getTestFilePath = (testFile) => {
    return path.join(__dirname, "/test_files/", testFile);
};

describe("runTests", () => {
    it("pass", () => {
        const files = [getTestFilePath("pass.md")];

        const config = {};
        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");

        assert.strictEqual(passingResults.length, 1);
    });

    it("fail", () => {
        const files = [getTestFilePath("fail-with-text.md")];
        const config = {};
        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");

        assert.strictEqual(
            passingResults.length,
            1,
            JSON.stringify(results, null, 2),
        );
        assert.strictEqual(failingResults.length, 2);
    });

    it("skip", () => {
        const files = [getTestFilePath("skip.md")];
        const config = {};
        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 1);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 1);
    });

    it("config", () => {
        const files = [getTestFilePath("require-override.md")];
        const config = {
            require: {
                lodash: { range: () => [] },
            },
        };

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 1, results[0].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("globals", () => {
        const files = [getTestFilePath("globals.md")];
        const config = {
            globals: {
                name: "Nick",
            },
        };

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 1, results[0].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("es6", () => {
        const files = [getTestFilePath("es6.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 2, results[0].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("joins tests", () => {
        const files = [getTestFilePath("environment.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 3, results[1].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("supports regex imports", () => {
        const files = [getTestFilePath("require-override.md")];
        const config = {
            regexRequire: {
                "lo(.*)": function (fullPath, matchedName) {
                    assert.strictEqual(matchedName, "dash");

                    return {
                        range: () => [],
                    };
                },
            },
        };

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 1, results[0].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("runs the beforeEach hook prior to each example", () => {
        const files = [getTestFilePath("before-each.md")];
        const a = {
            value: 0,
        };

        const config = {
            globals: {
                a,
            },

            beforeEach: () => a.value = 0,
        };

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 3, results[0].stack);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);

        assert.strictEqual(a.value, 1);
    });

    it("ignores json examples", () => {
        const files = [getTestFilePath("json.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        assert.strictEqual(passingResults.length, 0);
        assert.strictEqual(failingResults.length, 0);
        assert.strictEqual(skippedResults.length, 0);
    });

    it("skip custom", () => {
        const files = [getTestFilePath("skip-custom.md")];
        const config = {
            transformCode(code) {
                return code.replace(/\.\.\./g, "");
            },
        };
        const results = doctest.runTests(files, config);
        const passingResults = results.filter((result) => result.status === "pass");

        assert.strictEqual(passingResults.length, 1);
    });
});

describe("Results printing and error handling", () => {
    let originalConsoleLog;
    let originalStdoutWrite;
    let logOutput = [];
    let writeOutput = [];

    beforeEach(() => {
        logOutput = [];
        writeOutput = [];
        // eslint-disable-next-line no-console
        originalConsoleLog = console.log;
        originalStdoutWrite = process.stdout.write;

        // eslint-disable-next-line no-console
        console.log = (...args) => {
            logOutput.push(args.join(" "));
        };

        process.stdout.write = (str) => {
            writeOutput.push(str);
            return true;
        };
    });

    afterEach(() => {
        // eslint-disable-next-line no-console
        console.log = originalConsoleLog;
        process.stdout.write = originalStdoutWrite;
    });

    it("prints results with passing, failing and skipped tests", () => {
        const mockResults = [
            { status: "pass", codeSnippet: { fileName: "test.md", lineNumber: 10 }, stack: "" },
            { status: "fail", codeSnippet: { fileName: "test.md", lineNumber: 20 }, stack: "Error at eval" },
            { status: "skip", codeSnippet: { fileName: "test.md", lineNumber: 30 }, stack: "" }
        ];

        doctest.printResults(mockResults);

        // Check that it counted correctly
        assert(logOutput.some(line => line.includes("Passed: 1")));
        assert(logOutput.some(line => line.includes("Failed: 1")));
        assert(logOutput.some(line => line.includes("Skipped: 1")));
    });

    it("prints success message when no failures", () => {
        const mockResults = [
            { status: "pass", codeSnippet: { fileName: "test.md", lineNumber: 10 }, stack: "" },
            { status: "skip", codeSnippet: { fileName: "test.md", lineNumber: 30 }, stack: "" }
        ];

        doctest.printResults(mockResults);

        assert(logOutput.some(line => line.includes("Success!")));
        assert(!logOutput.some(line => line.includes("Failed:")));
    });

    it("prints helpful message for undefined variables", () => {
        const mockResults = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 20 },
                stack: "ReferenceError: myVariable is not defined\n    at eval"
            }
        ];

        doctest.printResults(mockResults);

        // Verify it suggests adding myVariable to globals
        assert(logOutput.some(line => line.includes("myVariable")));
        assert(logOutput.some(line => line.includes("globals")));
    });

    it("handles module not found errors in tests", () => {
        const files = [getTestFilePath("module-not-found.md")];
        const config = {
            require: {} // Empty require config so the require in the test file will fail
        };

        const results = doctest.runTests(files, config);
        const failingResults = results.filter(result => result.status === "fail");

        assert.strictEqual(failingResults.length, 1);
        assert(failingResults[0].stack.includes("Attempted to require"));
    });

    it("parses markdown error locations from stack traces", () => {
        const files = [getTestFilePath("fail-with-line-numbers.md")];
        const config = {};

        const results = doctest.runTests(files, config);
        const failingResults = results.filter(result => result.status === "fail");

        // Print the results to trigger markDownErrorLocation
        doctest.printResults(results);

        // Verify that the error location was printed with line numbers
        assert(logOutput.some(line => {
            return line.includes("Failed - ") &&
                (line.includes(":") || line.includes(failingResults[0].codeSnippet.fileName));
        }));
    });
});

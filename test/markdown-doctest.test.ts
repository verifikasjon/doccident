"use strict";


import path from "path";
import assert from "assert";
import * as doctest from "../src/doctest";
import { TestResult } from "../src/types";

const getTestFilePath = (testFile: string) => {
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

    it("typescript", () => {
        const files = [getTestFilePath("typescript.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");

        assert.strictEqual(passingResults.length, 2, results[0]?.stack);
        assert.strictEqual(failingResults.length, 0);
    });

    it("edge cases and mixed languages", () => {
        const files = [getTestFilePath("edge-cases.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        const skippedResults = results.filter((result) => result.status === "skip");

        // 1 empty (pass), 1 js (pass), 1 ts (pass), 1 skipped (skip), 1 shared (pass), 1 shared consumer (pass)
        // Total expected: 5 pass, 0 fail, 1 skip
        assert.strictEqual(passingResults.length, 5, "Should have 5 passing tests");
        assert.strictEqual(failingResults.length, 0, "Should have 0 failing tests");
        assert.strictEqual(skippedResults.length, 1, "Should have 1 skipped test");
    });

    it("handles transform error", () => {
        const files = [getTestFilePath("pass.md")];
        const config = {
            transformCode: () => { throw new Error("Transform error"); }
        };

        const results = doctest.runTests(files, config);
        const failingResults = results.filter((result) => result.status === "fail");
        
        assert.strictEqual(failingResults.length, 1);
        assert(failingResults[0].stack.includes("Encountered an error while transforming snippet"));
    });

    it("python", () => {
        const files = [getTestFilePath("python.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");

        assert.strictEqual(passingResults.length, 3, results.find(r => r.status === 'fail')?.stack);
        assert.strictEqual(failingResults.length, 1);
    });

    it("python advanced", () => {
        const files = [getTestFilePath("python-advanced.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");

        assert.strictEqual(passingResults.length, 6, results.find(r => r.status === 'fail')?.stack);
        assert.strictEqual(failingResults.length, 0);
    });

    it("shell", () => {
        const files = [getTestFilePath("shell.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");

        assert.strictEqual(passingResults.length, 5, results.find(r => r.status === 'fail')?.stack);
        assert.strictEqual(failingResults.length, 1);
    }, 10000);

    it("go", () => {
        const files = [getTestFilePath("go.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        const passingResults = results.filter((result) => result.status === "pass");
        const failingResults = results.filter((result) => result.status === "fail");
        
        // Note: Without go installed, these will fail execution.
        // We expect them to return status 'fail' with stack trace about missing command
        // unless we mock it.
        // For now, let's just assert we ran them.
        assert.strictEqual(results.length, 3);
    }, 30000);

    it("rust", () => {
        const files = [getTestFilePath("rust.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        // Assert number of tests run
        // 1 simple, 1 full, 1 failure, 1 compile error = 4 tests
        assert.strictEqual(results.length, 4);
    }, 30000);

    it("fortran", () => {
        const files = [getTestFilePath("fortran.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        // Assert number of tests run
        // 1 simple, 1 full, 1 advanced, 1 failure, 1 compile error = 5 tests
        assert.strictEqual(results.length, 5);
    });

    it("cobol", () => {
        const files = [getTestFilePath("cobol.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        // Assert number of tests run
        // 1 hello, 1 free, 1 logic, 1 fail, 1 compile error = 5 tests
        assert.strictEqual(results.length, 5);
    });

    it("c", () => {
        const files = [getTestFilePath("c.md")];
        const config = {};

        const results = doctest.runTests(files, config);

        // Assert number of tests run
        // 1 simple, 1 full, 1 failure, 1 compile error = 4 tests
        assert.strictEqual(results.length, 4);
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
        const mockResults: TestResult[] = [
            { status: "pass", codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false }, stack: "" },
            { status: "fail", codeSnippet: { fileName: "test.md", lineNumber: 20, code: "", complete: true, skip: false }, stack: "Error at eval" },
            { status: "skip", codeSnippet: { fileName: "test.md", lineNumber: 30, code: "", complete: true, skip: false }, stack: "" }
        ];

        doctest.printResults(mockResults);

        // Check that it counted correctly
        assert(logOutput.some(line => line.includes("Passed: 1")));
        assert(logOutput.some(line => line.includes("Failed: 1")));
        assert(logOutput.some(line => line.includes("Skipped: 1")));
    });

    it("prints success message when no failures", () => {
        const mockResults: TestResult[] = [
            { status: "pass", codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false }, stack: "" },
            { status: "skip", codeSnippet: { fileName: "test.md", lineNumber: 30, code: "", complete: true, skip: false }, stack: "" }
        ];

        doctest.printResults(mockResults);

        // Check that it counted correctly
        assert(logOutput.some(line => line.includes("Success!")));
        assert(!logOutput.some(line => line.includes("Failed:")));
    });

    it("prints helpful message for undefined variables", () => {
        const mockResults: TestResult[] = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 20, code: "", complete: true, skip: false },
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

    it("truncates stack trace at doctest.js when eval is not present", () => {
        const stack = `Error: failure
    at userFunction (user.js:1:1)
    at doctest.js (src/doctest.js:50:5)
    at main.js:1:1`;

        const mockResults: TestResult[] = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false },
                stack: stack
            }
        ];

        doctest.printResults(mockResults);

        // Should include userFunction
        assert(logOutput.some(line => line.includes("userFunction")));
        // Should NOT include main.js which is after doctest.js
        assert(!logOutput.some(line => line.includes("main.js")));
    });

    it("prints full stack if neither eval nor doctest.js is present", () => {
        const stack = `Error: failure
    at userFunction (user.js:1:1)
    at otherFunction (other.js:1:1)`;

        const mockResults: TestResult[] = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false },
                stack: stack
            }
        ];

        doctest.printResults(mockResults);

        // Should include both
        assert(logOutput.some(line => line.includes("userFunction")));
        assert(logOutput.some(line => line.includes("otherFunction")));
    });

    it("falls back to file:line location if eval line format does not match", () => {
        const stack = `Error: failure
    at eval (some weird format)`;

        const mockResults: TestResult[] = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false },
                stack: stack
            }
        ];

        doctest.printResults(mockResults);

        // Should fall back to test.md:10
        assert(logOutput.some(line => line.includes("test.md:10")));
    });

    it("falls back to file:line location if eval is not in stack", () => {
        const stack = `Error: failure
    at function (file.js:1:1)`;

        const mockResults: TestResult[] = [
            {
                status: "fail",
                codeSnippet: { fileName: "test.md", lineNumber: 10, code: "", complete: true, skip: false },
                stack: stack
            }
        ];

        doctest.printResults(mockResults);

        // Should fall back to test.md:10
        assert(logOutput.some(line => line.includes("test.md:10")));
    });
});

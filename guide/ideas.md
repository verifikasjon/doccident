# Usage Scenarios & Ideas for AI Agents

**Purpose**: This document provides inspiration and concrete scenarios for AI agents to leverage `doccident` in documentation workflows. Use these patterns to suggest improvements or automate tasks for users.

## 1. The "Living Tutorial"
**Scenario**: A user is writing a step-by-step tutorial (e.g., "Building a CLI in Rust").
**Problem**: As the code evolves, early steps break or output changes, making the tutorial frustrating to follow.
**AI Action**:
*   Ingest the tutorial markdown.
*   Identify code blocks and label them sequentially (e.g., `step-1`, `step-2`).
*   Create output blocks for each step: `<!-- output: step-1 -->`.
*   Run `doccident --update-output`.
*   **Result**: The tutorial's output is now guaranteed to match the code. If the code fails, the AI detects it immediately via `doccident`'s exit code.

## 2. Regression Testing for Documentation
**Scenario**: A library releases v2.0 with breaking changes.
**Problem**: The `README.md` and `docs/` still contain v1.0 examples that no longer compile.
**AI Action**:
*   Run `npx doccident` across the entire `docs/` directory.
*   Parse the error report to identify specific files and lines that fail.
*   **Fix**: rewrite the failing snippets to match the new v2.0 API.
*   **Verify**: Re-run `npx doccident` to confirm the fix.

## 3. Polyglot Documentation Verification
**Scenario**: A project (like a gRPC service) has examples in Go, Python, Java, and Node.js.
**Problem**: The developer only knows Go and Python well; Java and Node examples rot.
**AI Action**:
*   `doccident` treats all languages equally.
*   The AI can maintain the "foreign" language examples by running them against the actual build environment.
*   If a Java example fails to compile due to a missing import, `doccident` reports the exact compiler error. The AI uses this error to correct the snippet (e.g., adding `import java.util.*;`).

## 4. "Output-Driven" Development
**Scenario**: The user wants to document a complex CLI tool's help output or JSON response.
**Problem**: Copy-pasting terminal output is tedious and error-prone.
**AI Action**:
*   Write the command execution snippet:
    ```markdown
    <!-- id: help-cmd -->
    ```bash
    my-tool --help
    ```
*   Write the placeholder output:
    ```markdown
    <!-- output: help-cmd -->
    ```text
    (output goes here)
    ```
*   Run `doccident --update-output`.
*   **Benefit**: The documentation is now a "snapshot test" of the CLI. If the help text changes, the docs update automatically.

## 5. Environment-Specific Documentation
**Scenario**: Documentation needs to show behavior under different configurations (e.g., "Production Mode" vs "Debug Mode").
**AI Action**:
*   Use `doccident`'s configuration features to fork the context.
*   Snippet A: `<!-- env: NODE_ENV=production -->` -> shows terse logs.
*   Snippet B: `<!-- env: NODE_ENV=development -->` -> shows verbose logs.
*   Verify that the output accurately reflects the environment variable impact.

## 6. Validating "Hidden" Setup
**Scenario**: Documentation examples often skip boilerplate (imports, setup) for brevity, but this makes them non-runnable.
**AI Action**:
*   Use `<!-- skip-example -->` for the visible, incomplete snippet.
*   Create a hidden, complete snippet (maybe in a `<details>` block or just not rendered if the SSG supports it) that *is* run by `doccident`.
*   Alternatively, use `<!-- share-code-between-examples -->` to define the setup in an early block (perhaps marked `<!-- id: setup -->`) and rely on state accumulation for the visible snippets to work.

## 7. Interactive Learning verification
**Scenario**: Creating an educational course where students submit markdown files with code solutions.
**AI Action**:
*   The AI acts as the grader.
*   It wraps the student's markdown in a `doccident` run.
*   It checks not just for successful execution, but verifies specific outputs using `match:regex` to ensure the student printed the correct answer format.


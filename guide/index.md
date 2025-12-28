# AI Agent Guide: doccident

**Role**: You are an AI assistant tasked with validating, testing, and maintaining documentation code examples using `doccident`.

**Goal**: Ensure all code snippets in Markdown documentation are executable, correct, and produce the expected output.

## Core Capabilities

`doccident` is a multi-language documentation testing tool. It extracts code blocks from Markdown files and executes them.

*   **Executes**: JS, TS, Python, Shell, Go, Rust, Fortran, C, C#, Java, Perl, R, Pascal, BASIC.
*   **Verifies**: Checks exit codes (must be 0) and stdout (optional exact/fuzzy matching).
*   **Context**: Supports shared state between snippets (linear accumulation) for most languages.

## Usage Instructions

### 1. Basic Validation
To verify all code snippets in a project:
```bash
npx doccident
```
*Failure Condition*: Any snippet returns a non-zero exit code or fails output verification.

### 2. Output Verification (Golden Master)
To assert that a snippet produces specific output:

1.  **Label** the source snippet: `<!-- id: example-1 -->`
2.  **Label** the expected output block: `<!-- output: example-1 -->`

```markdown
<!-- id: hello -->
```javascript
console.log("Hello");
```

<!-- output: hello -->
```text
Hello
```
```

**Matching Modes**:
*   Default: Exact string match (trimmed).
*   `<!-- output: id ignore-whitespace -->`: Ignores whitespace differences.
*   `<!-- output: id match:regex -->`: Treats output block content as a JavaScript RegExp.

### 3. Updating Snapshots
If output is outdated or missing, **do not manually edit**. Run:
```bash
npx doccident --update-output
```
This updates all `<!-- output: ... -->` blocks with the actual stdout from the latest execution.

### 4. Shared State
To chain examples (variables defined in A are used in B):
*   Add `<!-- share-code-between-examples -->` at the top of the Markdown file.
*   **Constraint**: Code must be idempotent if possible (e.g., `mkdir -p`), as accumulation re-runs previous snippets.

### 5. Configuration (Per-Snippet)
*   **Arguments**: `<!-- args: -v -O3 -->` (Compiler flags or interpreter args).
*   **Env Vars**: `<!-- env: NODE_ENV=test API_KEY=123 -->`.

### 6. Timeout
Each snippet has a 5-minute (300,000ms) timeout by default. Customize with:
```bash
npx doccident --timeout 60000  # 60 second timeout
```
**Important**: This prevents infinite loops from hanging CI pipelines.

## Integration Strategy

When updating documentation:
1.  **Write** the code example in a fenced block.
2.  **Tag** it with `<!-- id: ... -->`.
3.  **Create** an empty output block tagged `<!-- output: ... -->`.
4.  **Run** `npx doccident --update-output` to auto-generate the correct output.
5.  **Commit** the changes.

## Troubleshooting
*   **Missing Dependencies**: Ensure the environment has the required runtime/compiler (e.g., `python3`, `go`, `rustc`).
*   **Shared State Errors**: If a later snippet fails, check if a previous snippet introduced a side effect or syntax error that propagated.


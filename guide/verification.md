# Advanced Features: Output Verification & Updates

**Purpose**: Guide for using the "Golden Master" testing features to ensure documentation accuracy.

## The Workflow

1.  **Define**: Write code snippet with `<!-- id: name -->`.
2.  **Assert**: Write output block with `<!-- output: name -->`.
3.  **Run**: `doccident` executes code -> captures stdout -> compares with output block.
4.  **Update**: `doccident --update-output` overwrites output block with actual stdout.

## Matching Modes

By default, verification requires an **exact string match** (trailing whitespace trimmed). You can relax this using modifiers.

### 1. Exact Match (Default)
Use for precise output validation.

```markdown
<!-- output: my-id -->
```text
Exact Output
```

### 2. Ignore Whitespace
Use when spacing/formatting might vary but content is constant. Collapses all whitespace runs to a single space.

```markdown
<!-- output: my-id ignore-whitespace -->
```text
Col 1 Col 2
```
*Matches*: `Col 1    Col 2` or `Col 1\nCol 2`

### 3. Regex Matching
Use for dynamic content (timestamps, PIDs, random values). The content of the block is treated as a JavaScript RegExp source string.

```markdown
<!-- output: my-id match:regex -->
```text
^Server started on port \d+$
```
*Matches*: `Server started on port 8080`

## Auto-Update Strategy

**Prompt for AI**:
"Run the code in this file, execute it, and paste the actual output into the document."

**Command**:
```bash
npx doccident --update-output
```

**Behavior**:
*   Executes all snippets.
*   Captures stdout.
*   Locates corresponding `<!-- output: ... -->` blocks.
*   **REPLACES** the content between the fences with the captured stdout.
*   **Trims** trailing newlines to maintain clean formatting.

**Safety**:
*   Only modifies blocks explicitly tagged with `<!-- output: ... -->`.
*   Does not modify code snippets.


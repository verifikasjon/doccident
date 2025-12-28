# Configuration & Environment

**Purpose**: Guide for configuring execution parameters per snippet.

## Directives

You can control the execution environment using comments immediately preceding the code block.

### 1. Arguments (`args`)
Passes command-line arguments to the interpreter or compiler.

**Syntax**: `<!-- args: arg1 arg2 ... -->`

*   **Interpreted (Python, Shell)**: Passed as arguments to the script/interpreter.
    *   `python`: Passed to interpreter (e.g., `-v`).
    *   `bash`: Passed as positional params (`$1`, `$2`).
*   **Compiled (C, Go)**: Passed as compiler flags.
    *   `c`: Passed to `gcc` (e.g., `-DDEBUG`, `-O3`).

**Example**:
```markdown
<!-- args: -DTEST_MODE -->
```c
#ifdef TEST_MODE
// ...
#endif
```

### 2. Environment Variables (`env`)
Sets environment variables for the process execution.

**Syntax**: `<!-- env: KEY=VALUE KEY2=VAL2 -->`

*   Merged with current `process.env`.
*   Applies only to that specific snippet execution.

**Example**:
```markdown
<!-- env: DATABASE_URL=postgres://localhost:5432 -->
```python
import os
print(os.environ["DATABASE_URL"])
```

### 3. Timeout (CLI)
Controls maximum execution time per snippet to prevent infinite loops or hangs.

**Syntax**: `--timeout <milliseconds>` (CLI flag)

*   **Default**: 300000 (5 minutes)
*   **Purpose**: Safety mechanism to prevent runaway processes

**Example**:
```bash
npx doccident --timeout 60000  # 60 second timeout
```

If a snippet exceeds the timeout, it fails with: `Execution timed out after Xms`

## Shared State vs Configuration

*   **Shared State**: Affects *memory/context* (variables, functions). Enabled via file-level `<!-- share-code-between-examples -->`.
*   **Configuration**: Affects *process execution* (flags, env vars, timeout). Enabled per-snippet or globally.

You can combine them. For example, setting an env var for one step in a shared shell script flow:

```markdown
<!-- share-code-between-examples -->

```bash
# Setup
```

<!-- env: FORCE=true -->
```bash
# Run with env var, accessing state from Setup
./script.sh
```


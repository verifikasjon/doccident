# doccident

[![npm version](https://badge.fury.io/js/doccident.svg)](http://badge.fury.io/js/doccident)
[![Doccident Tested](https://img.shields.io/badge/doccident-tested-brightgreen.svg)](README.md)

**Test the code examples in your Markdown documentation.**

## Overview

As an open source developer, few things are more frustrating for users than encountering broken examples in a README. `doccident` ensures your documentation remains accurate by treating your examples as testable code. It parses your Markdown files, extracts code blocks for multiple languages, and executes them in a sandboxed environment to verify they run without errors.

**Supported Languages:**
*   JavaScript (Node.js)
*   TypeScript
*   Python
*   Shell (Bash, Sh, Zsh)
*   Go
*   Rust
*   Fortran
*   COBOL
*   C

> **Note**: `doccident` primarily verifies that your code *runs* without throwing exceptions. While you can add assertions to your examples to test correctness, its main goal is to ensure your documentation examples are valid and runnable.

## Installation

<!-- skip-example -->
```bash
npm install --save-dev @doccident/doccident
```

## Usage

Run `doccident` in your project root. By default, it recursively checks all `.md` and `.markdown` files (excluding `node_modules`).

<!-- skip-example -->
```bash
npx doccident
```

You can also target specific files or directories:

<!-- skip-example -->
```bash
npx doccident docs/**/*.md
```

### Language Support & Recipes

`doccident` executes code inside fenced code blocks for the following languages:

*   **JavaScript**: `js`, `javascript`, `es6`
*   **TypeScript**: `ts`, `typescript`
*   **Python**: `py`, `python`
*   **Shell**: `sh`, `bash`, `zsh`, `shell`
*   **Go**: `go`
*   **Rust**: `rust`, `rs`
*   **Fortran**: `fortran`, `f90`, `f95`
*   **COBOL**: `cobol`, `cob`
*   **C**: `c`

It automatically transforms modern JavaScript and TypeScript using **esbuild** before execution.

#### JavaScript

Use `js`, `javascript`, or `es6` for JavaScript examples.

**Execution Model:**
Runs directly in a Node.js `vm` sandbox.

**Recipe:**

1.  Use `js` fenced code blocks.
2.  Write standard JavaScript (ES6+ supported).
3.  Use `require` to load dependencies defined in your configuration.

    ```js
    const { sum } = require('./math-utils');
    const result = sum(1, 2);
    ```

#### TypeScript

Use `ts` or `typescript` for TypeScript examples.

**Execution Model:**
Transpiled via `esbuild`, then runs in a Node.js `vm` sandbox.

**Recipe:**

1.  Use `ts` fenced code blocks.
2.  Include type annotations to demonstrate correct usage.
3.  `doccident` strips types during execution, so your examples serve as both documentation and functional tests.

    ```ts
    interface User {
      id: number;
      name: string;
    }

    const user: User = { id: 1, name: 'Doccident' };
    console.log(user.name);
    ```

#### Python

Use `py` or `python` for Python examples.

**Prerequisites:**
*   `python3` must be installed and available in your system path.
    *   **macOS**: `brew install python`
    *   **Ubuntu/Debian**: `sudo apt-get install python3`

**Execution Model:**
Spawns a `python3` subprocess with the code piped to stdin.

**Recipe:**

1.  Use `python` fenced code blocks.
2.  Standard library imports work out of the box.
3.  State can be shared between blocks using `<!-- share-code-between-examples -->`.

    ```python
    import json
    data = {"key": "value"}
    assert json.loads('{"key": "value"}') == data
    ```

#### Shell Scripts

Use `sh`, `bash`, `zsh` or `shell` (defaults to bash) for shell examples.

**Prerequisites:**
*   The specified shell (`bash`, `sh`, or `zsh`) must be available in your system path.

**Execution Model:**
Spawns a subprocess using the specified shell, with the code piped to stdin.

**Recipe:**

1.  Use specific shell tags like `bash` or `zsh` if your script relies on shell-specific syntax.
2.  Use `sh` for POSIX-compliant scripts.
3.  State (variables) can be shared between blocks using `<!-- share-code-between-examples -->`.

    ```bash
    export MY_VAR="hello"
    ```
    
    ```bash
    if [ "$MY_VAR" != "hello" ]; then exit 1; fi
    ```

#### Go

Use `go` for Go examples.

**Prerequisites:**
*   `go` must be installed and available in your system path.
    *   **macOS**: `brew install go`
    *   **Ubuntu/Debian**: `sudo apt-get install golang-go`

**Execution Model:**
Writes code to a temporary file and executes it via `go run`.

**Recipe:**

1.  Use `go` fenced code blocks.
2.  You can provide a full program (including `package main`) OR a simple snippet.
3.  Simple snippets (without `package main`) are automatically wrapped in a `main` function and include `import "fmt"`.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for Go.

    **Simple Snippet:**
    ```go
    fmt.Println("Hello Go")
    ```

#### Rust

Use `rust` or `rs` for Rust examples.

**Prerequisites:**
*   `rustc` (Rust compiler) must be installed and available in your system path.
    *   **macOS**: `brew install rust`
    *   **Ubuntu/Debian**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` or `sudo apt-get install rustc`

**Execution Model:**
Compiles the code using `rustc` into a temporary binary, then executes the binary.

**Recipe:**

1.  Use `rust` fenced code blocks.
2.  You can provide a full program (including `fn main()`) OR a simple snippet.
3.  Simple snippets (without `fn main`) are automatically wrapped in a `main` function.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for Rust.

    **Simple Snippet:**
    ```rust
    println!("Hello Rust");
    let x = 5;
    assert_eq!(x, 5);
    ```

#### Fortran

Use `fortran`, `f90`, or `f95` for Fortran examples.

**Prerequisites:**
*   `gfortran` must be installed and available in your system path.
    *   **macOS**: `brew install gcc` (includes gfortran)
    *   **Ubuntu/Debian**: `sudo apt-get install gfortran`

**Execution Model:**
Compiles the code using `gfortran` into a temporary binary, then executes the binary.

**Recipe:**

1.  Use `fortran` fenced code blocks.
2.  You can provide a full program (starting with `program name`) OR a simple snippet.
3.  Simple snippets are automatically wrapped in a `program main ... end program main` block.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for Fortran.

    **Simple Snippet:**
    ```fortran
    print *, "Hello Fortran"
    ```

#### COBOL

Use `cobol` or `cob` for COBOL examples.

**Prerequisites:**
*   `cobc` (GnuCOBOL) must be installed and available in your system path.
    *   **macOS**: `brew install gnucobol`
    *   **Ubuntu/Debian**: `sudo apt-get install gnucobol`

**Execution Model:**
Compiles the code using `cobc -x -free` into a temporary executable, then runs it.

**Recipe:**

1.  Use `cobol` fenced code blocks.
2.  Provide a full COBOL program (including `IDENTIFICATION DIVISION`).
3.  The compiler is run in free-format mode (`-free`).
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for COBOL.

    ```cobol
    IDENTIFICATION DIVISION.
    PROGRAM-ID. HELLO.
    PROCEDURE DIVISION.
    DISPLAY 'Hello COBOL'.
    STOP RUN.
    ```

#### C

Use `c` for C examples.

**Prerequisites:**
*   `gcc` must be installed and available in your system path.
    *   **macOS**: `xcode-select --install` or `brew install gcc`
    *   **Ubuntu/Debian**: `sudo apt-get install build-essential`

**Execution Model:**
Compiles the code using `gcc` into a temporary binary, then executes the binary.

**Recipe:**

1.  Use `c` fenced code blocks.
2.  You can provide a full program (including `main()`) OR a simple snippet.
3.  Simple snippets are automatically wrapped in a `main` function and include `stdio.h`.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for C.

    **Simple Snippet:**
    ```c
    printf("Hello C\n");
    ```

### Skipping Examples

To skip a specific code block, add the `<!-- skip-example -->` comment immediately before it:

    <!-- skip-example -->
    ```js
    // This code will not be executed
    fetch('https://example.com');
    ```

### Sharing Code Between Examples

By default, each code block is executed in isolation. To share state (variables, functions, classes) between multiple code blocks in the same file, add the `<!-- share-code-between-examples -->` comment. This applies to the entire file.

> **Note**: This feature is currently supported for JavaScript, TypeScript, Python, and Shell, but **not** compiled languages like Go, Rust, Fortran, COBOL, and C.

    <!-- share-code-between-examples -->

    ```python
    x = 10
    ```

    ```python
    # x is still available here
    assert x == 10
    ```

## Configuration

Create a `.doccident-setup.js` file in your project root to configure the test environment.

### Injecting Dependencies (`require`)

If your examples use external libraries, provide them here. This allows your examples to `require` modules just like users would:

```javascript
// .doccident-setup.js
module.exports = {
  require: {
    // Make 'my-library' available when examples call require('my-library')
    'my-library': require('./index.js'),
    'lodash': require('lodash')
    }
};
```

### Global Variables

Define global variables available to all snippets:

```javascript
module.exports = {
  globals: {
    $: require('jquery'),
    window: {}
  }
};
```

### Advanced Configuration

*   **`regexRequire`**: Handle dynamic requires that match a pattern.
*   **`beforeEach`**: Function to run before each snippet (e.g., to reset global state).
*   **`transformCode`**: Pre-process code before execution (e.g., to strip out display-only syntax).

## Architecture and Approach

`doccident` is designed to be a lightweight, flexible testing harness for documentation. The codebase is modularized to separate parsing, execution, and reporting, ensuring maintainability and extensibility.

### Core Modules

1.  **Parser (`src/parse-code-snippets-from-markdown.ts`)**
    *   Reads Markdown content line-by-line.
    *   Uses a robust state machine to identify code fences and control comments (like `skip-example`).
    *   Extracts valid snippets into structured objects containing code, file paths, and line numbers.
    *   **Multi-Language Support**: Recognizes `js`, `ts`, `python`, `shell`, `go`, `rust`, `fortran`, `cobol`, and `c` blocks.

2.  **Test Runner (`src/doctest.ts`)**
    *   The orchestrator of the application.
    *   Iterates through parsed snippets and manages the execution lifecycle.
    *   **Sandboxing**: Uses Node.js's `vm` module (`runInNewContext`) to execute JS/TS code in isolation.
    *   **Subprocess Execution**: Spawns `python3`, `go`, `rustc`, `gfortran`, `cobc`, `gcc`, or shell subprocesses for non-JS languages.
    *   **Transformation**: Uses **esbuild** to compile modern JavaScript and TypeScript code down to a compatible format before execution.

3.  **Reporter (`src/reporter.ts`)**
    *   Collects execution results (pass, fail, skip).
    *   Formats output using `chalk` for readability.
    *   **Error Mapping**: Crucially, it maps execution errors back to the specific line number in the original Markdown file, making it easy to identify exactly which line in your documentation caused the failure.

4.  **Types & Utils**
    *   Shared interfaces (`src/types.ts`) ensure type safety across the application.
    *   Utility functions (`src/utils.ts`) provide common helpers.

This separation of concerns allows `doccident` to be easily extended—for example, by adding new parsers for different documentation formats or custom reporters for CI environments.

# doccident

[![npm version](https://badge.fury.io/js/doccident.svg)](http://badge.fury.io/js/doccident)
[![Doccident Tested](https://img.shields.io/badge/doccident-tested-brightgreen.svg)](README.md)

**Test the code examples in your Markdown documentation.**

## Overview

As an open source developer, few things are more frustrating for users than encountering broken examples in a README. `doccident` ensures your documentation remains accurate by treating your examples as testable code. It parses your Markdown files, extracts code blocks for multiple languages, and executes them in a sandboxed environment to verify they run without errors.

### The "Why"

This project was born out of frustration. The author once wrote a massive technical book, only to be haunted by the realization that subtle bugs had crept into the code examples and output listings during the editing process. 

`doccident` solves this by automating the verification of your documentation. It doesn't just check if your code compiles; it can **execute** your snippets and **verify their output** matches what you claim in your docs. This "living documentation" approach guarantees that your readers always see correct, working code and accurate output.

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
*   BASIC
*   Java
*   Perl
*   C#
*   R
*   Pascal

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

### Timeout

By default, each code snippet has a 5-minute (300,000ms) timeout to prevent infinite loops or hangs. You can customize this with the `--timeout` flag (in milliseconds):

<!-- skip-example -->
```bash
npx doccident --timeout 60000  # 60 second timeout
```

If a snippet exceeds the timeout, it will fail with an error message indicating the timeout was reached.

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
*   **BASIC**: `basic`
*   **Java**: `java`
*   **Perl**: `perl`, `pl`
*   **C#**: `csharp`, `cs`
*   **R**: `r`
*   **Pascal**: `pascal`, `pas`
*   **Text/Output**: `text`, `txt`, `output` (for output verification)

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
4.  **Note**: `<!-- share-code-between-examples -->` is supported for Go snippets (auto-wrapped). Declarations (`func`, `type`, `import`) are extracted to top-level.

    **Simple Snippet:**
    <!-- skip-example -->
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
4.  **Note**: `<!-- share-code-between-examples -->` is supported for Rust. Attributes like `#![...]` and `extern crate` are hoisted to the crate root. Other code is wrapped in `fn main()`.

    **Simple Snippet:**
    <!-- skip-example -->
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
4.  **Note**: `<!-- share-code-between-examples -->` is supported for Fortran. Modules are extracted to the top level; `use` statements are moved to the top of `program main`.

    **Simple Snippet:**
    <!-- skip-example -->
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

    <!-- skip-example -->
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
4.  **Note**: `<!-- share-code-between-examples -->` is supported for C. Includes and definitions (`struct`, `func`) are hoisted; statements are placed in `main()`.

    **Simple Snippet:**
    ```c
    printf("Hello C\n");
    ```

#### BASIC

Use `basic` for BASIC examples.

**Prerequisites:**
*   `cbmbasic` must be installed and available in your system path.
    *   **macOS**: `brew install cbmbasic`
    *   **Ubuntu/Debian**: Build from source (see `test.yml` for example).

**Execution Model:**
Spawns a `cbmbasic` subprocess with the code piped to stdin.

**Recipe:**

1.  Use `basic` fenced code blocks.
2.  Write standard Commodore BASIC V2 code.
3.  State can be shared between blocks using `<!-- share-code-between-examples -->`.

    <!-- skip-example -->
    ```basic
    10 PRINT "HELLO BASIC"
    20 END
    ```

#### Java

Use `java` for Java examples.

**Prerequisites:**
*   `javac` and `java` must be installed and available in your system path.
    *   **macOS**: `brew install openjdk`
    *   **Ubuntu/Debian**: `sudo apt-get install default-jdk`

**Execution Model:**
Compiles the code using `javac` into a temporary class file in a unique directory, then executes it with `java`.

**Recipe:**

1.  Use `java` fenced code blocks.
2.  You can provide a full class (e.g. `public class MyClass { ... }`) OR a simple snippet.
3.  Simple snippets are automatically wrapped in a `public class Main { public static void main(String[] args) { ... } }`.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for Java.

    **Simple Snippet:**
    <!-- skip-example -->
    ```java
    System.out.println("Hello Java");
    ```

    **Full Class:**
    <!-- skip-example -->
    ```java
    public class Greeting {
        public static void main(String[] args) {
            System.out.println("Hello from Greeting class");
        }
    }
    ```

#### Perl

Use `perl` or `pl` for Perl examples.

**Prerequisites:**
*   `perl` must be installed and available in your system path.
    *   **macOS**: Pre-installed or `brew install perl`
    *   **Ubuntu/Debian**: Pre-installed or `sudo apt-get install perl`

**Execution Model:**
Spawns a `perl` subprocess with the code piped to stdin.

**Recipe:**

1.  Use `perl` fenced code blocks.
2.  Standard library imports work out of the box.
3.  State can be shared between blocks using `<!-- share-code-between-examples -->`.

    ```perl
    print "Hello Perl\n";
    ```

#### C#

Use `csharp` or `cs` for C# examples.

**Prerequisites:**
*   `mono` (includes `mcs` compiler) must be installed and available in your system path.
    *   **macOS**: `brew install mono`
    *   **Ubuntu/Debian**: `sudo apt-get install mono-devel`

**Execution Model:**
Compiles the code using `mcs` into a temporary executable, then runs it with `mono`.

**Recipe:**

1.  Use `csharp` fenced code blocks.
2.  You can provide a full class (e.g. `public class Program { ... }`) OR a simple snippet.
3.  Simple snippets are automatically wrapped in a `public class Program { public static void Main(string[] args) { ... } }` and include `using System;`.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for C#.

    **Simple Snippet:**
    <!-- skip-example -->
    ```csharp
    Console.WriteLine("Hello C#");
    ```

    **Full Class:**
    <!-- skip-example -->
    ```csharp
    using System;
    public class Test {
        public static void Main(string[] args) {
            Console.WriteLine("Hello from Test class");
        }
    }
    ```

#### R

Use `r` for R examples.

**Prerequisites:**
*   `Rscript` must be installed and available in your system path.
    *   **macOS**: `brew install r`
    *   **Ubuntu/Debian**: `sudo apt-get install r-base`

**Execution Model:**
Spawns an `Rscript` subprocess with the code piped to stdin.

**Recipe:**

1.  Use `r` fenced code blocks.
2.  Standard R syntax works out of the box.
3.  State can be shared between blocks using `<!-- share-code-between-examples -->`.

    ```r
    print("Hello R")
    ```

#### Pascal

Use `pascal` or `pas` for Pascal examples.

**Prerequisites:**
*   `fpc` (Free Pascal Compiler) must be installed and available in your system path.
    *   **macOS**: `brew install fpc`
    *   **Ubuntu/Debian**: `sudo apt-get install fpc`

**Execution Model:**
Compiles the code using `fpc` into a temporary executable, then runs it.

**Recipe:**

1.  Use `pascal` fenced code blocks.
2.  You can provide a full program (including `program Name;`) OR a simple snippet.
3.  Simple snippets are automatically wrapped in a `program TestProgram; begin ... end.` block.
4.  **Note**: `<!-- share-code-between-examples -->` is **not** supported for Pascal.

    **Simple Snippet:**
    <!-- skip-example -->
    ```pascal
    writeln('Hello Pascal');
    ```

    **Full Program:**
    <!-- skip-example -->
    ```pascal
    program Hello;
    begin
        writeln('Hello from Pascal program');
    end.
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

> **Note**: This feature is currently supported for JavaScript, TypeScript, Python, Shell, BASIC, Perl, R, Go, Rust, Fortran, and C, but **not** compiled languages like COBOL, Java, C#, and Pascal.

    <!-- share-code-between-examples -->

    ```python
    x = 10
    ```

    ```python
    # x is still available here
    assert x == 10
    ```

### Configuration Comments

You can configure execution behavior for specific snippets using comments immediately preceding the code block.

**Arguments:** Pass arguments to the compiler or interpreter.

    <!-- args: -v -->
    ```python
    import sys
    print("Running with verbose output")
    ```

**Environment Variables:** Set environment variables for the execution.

    <!-- env: API_KEY=secret123 MODE=test -->
    ```bash
    echo "Key: $API_KEY"
    ```

### Output Verification

You can verify that a code snippet produces specific output by assigning it an ID and then referencing that ID in a subsequent block.

1.  Assign an ID to the code snippet using `<!-- id: my-snippet-name -->`.
2.  Create an output block (usually `text` or `json`) and reference the ID using `<!-- output: my-snippet-name -->`.

`doccident` will execute the first snippet, capture its stdout, and verify that it matches the content of the output block.

**Example:**

    <!-- id: hello-world -->
    ```js
    console.log("Hello Output");
    ```

    <!-- output: hello-world -->
    ```text
    Hello Output
    ```

This is useful for ensuring your documentation's "Output:" sections stay in sync with the actual code behavior.

### Output Matching Modes

When verifying output, you can optionally specify a matching mode to handle whitespace or dynamic content.

*   `exact` (default): Exact string match (trailing whitespace is trimmed).
*   `ignore-whitespace`: Collapses all whitespace sequences to a single space and trims ends before comparing.
*   `match:regex`: Treats the output block content as a regular expression.

**Examples:**

**Ignore Whitespace:**

    <!-- id: fuzzy-output -->
    ```js
    console.log("  A   B  \n  C  ");
    ```

    <!-- output: fuzzy-output ignore-whitespace -->
    ```text
    A B C
    ```

**Regex Matching:**

    <!-- id: dynamic-output -->
    ```js
    console.log("Timestamp: " + Date.now());
    ```

    <!-- output: dynamic-output match:regex -->
    ```text
    ^Timestamp: \d+$
    ```

### Updating Output (Snapshots)

If you want `doccident` to automatically update your output blocks with the actual output from execution, run with the `--update-output` flag.

<!-- skip-example -->
```bash
npx doccident --update-output
```

This will replace the content of any `<!-- output: ... -->` block with the latest captured output from the corresponding ID. This is extremely useful when writing documentation: you can write the code example, add a placeholder output block, and let `doccident` fill it in for you.

## Configuration

Create a `.doccident-setup.js` file in your project root to configure the test environment.

### Injecting Dependencies (`require`)

If your examples use external libraries, provide them here. This allows your examples to `require` modules just like users would:

<!-- skip-example -->
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

<!-- skip-example -->
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
    *   **Multi-Language Support**: Recognizes `js`, `ts`, `python`, `shell`, `go`, `rust`, `fortran`, `cobol`, `c`, `basic`, `java`, `perl`, `csharp`, `r`, and `pascal` blocks.

2.  **Test Runner (`src/doctest.ts`)**
    *   The orchestrator of the application.
    *   Iterates through parsed snippets and manages the execution lifecycle.
    *   **Sandboxing**: Uses Node.js's `vm` module (`runInNewContext`) to execute JS/TS code in isolation.
    *   **Subprocess Execution**: Spawns `python3`, `go`, `rustc`, `gfortran`, `cobc`, `gcc`, `cbmbasic`, `javac`/`java`, `perl`, `mcs`/`mono`, `Rscript`, `fpc`, or shell subprocesses for non-JS languages.
    *   **Transformation**: Uses **esbuild** to compile modern JavaScript and TypeScript code down to a compatible format before execution.

3.  **Reporter (`src/reporter.ts`)**
    *   Collects execution results (pass, fail, skip).
    *   Formats output using `chalk` for readability.
    *   **Error Mapping**: Crucially, it maps execution errors back to the specific line number in the original Markdown file, making it easy to identify exactly which line in your documentation caused the failure.

4.  **Types & Utils**
    *   Shared interfaces (`src/types.ts`) ensure type safety across the application.
    *   Utility functions (`src/utils.ts`) provide common helpers.

This separation of concerns allows `doccident` to be easily extended—for example, by adding new parsers for different documentation formats or custom reporters for CI environments.

## License & History

This project is licensed under the Apache License, Version 2.0.

Copyright (c) 2025 Billaud Cipher

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

---

**Note**: This project was originally forked from [markdown-doctest](https://github.com/nick-johnstone/markdown-doctest) by Nick Johnstone. While the original inspiration and some core concepts remain, the **entire codebase has been replaced** and significantly expanded by Billaud Cipher to support a wide range of compiled and interpreted languages, shared state mechanisms, and output verification. All subsequent additions and modifications are covered by the Apache 2.0 Software License.

## Agentic AI Guide

This repository contains a dedicated guide for AI agents to understand how to use `doccident`. If you are an AI model tasked with maintaining this project or using it to verify documentation, please refer to:

[**doccident/guide/index.md**](./guide/index.md)

This directory contains instructions on capabilities, verification workflows, and configuration specifically structured for machine consumption.

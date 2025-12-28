# doccident

[![npm version](https://badge.fury.io/js/doccident.svg)](http://badge.fury.io/js/doccident)

**Test the code examples in your Markdown documentation.**

## Overview

As an open source developer, few things are more frustrating for users than encountering broken examples in a README. `doccident` ensures your documentation remains accurate by treating your examples as testable code. It parses your Markdown files, extracts JavaScript and TypeScript code blocks, and executes them in a sandboxed environment to verify they run without errors.

> **Note**: `doccident` primarily verifies that your code *runs* without throwing exceptions. While you can add assertions to your examples to test correctness, its main goal is to ensure your documentation examples are valid and runnable.

## Installation

```bash
npm install --save-dev @doccident/doccident
```

## Usage

Run `doccident` in your project root. By default, it recursively checks all `.md` and `.markdown` files (excluding `node_modules`).

```bash
npx doccident
```

You can also target specific files or directories:

```bash
npx doccident docs/**/*.md
```

### Writing Testable Examples

`doccident` executes code inside `js`, `javascript`, `es6`, `ts`, or `typescript` fenced code blocks:

    ```js
    const result = 1 + 1;
    console.log(result); // Output verified
    ```

    ```ts
    const x: number = 42;
    console.log(x);
    ```

### Skipping Examples

To skip a specific code block, add the `<!-- skip-example -->` comment immediately before it:

    <!-- skip-example -->
    ```js
    // This code will not be executed
    fetch('https://example.com');
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
    *   **TypeScript Support**: Now recognizes `ts` and `typescript` blocks in addition to JS.

2.  **Test Runner (`src/doctest.ts`)**
    *   The orchestrator of the application.
    *   Iterates through parsed snippets and manages the execution lifecycle.
    *   **Sandboxing**: Uses Node.js's `vm` module (`runInNewContext`) to execute code in isolation. This prevents examples from polluting the global scope of the runner itself, while allowing controlled injection of dependencies via the configuration.
    *   **Transformation**: Uses **esbuild** to compile modern JavaScript and TypeScript code down to a compatible format before execution. This ensures that modern syntax and type annotations run correctly in all environments, and is significantly faster than the previous Babel implementation.

3.  **Reporter (`src/reporter.ts`)**
    *   Collects execution results (pass, fail, skip).
    *   Formats output using `chalk` for readability.
    *   **Error Mapping**: Crucially, it maps execution errors back to the specific line number in the original Markdown file, making it easy to identify exactly which line in your documentation caused the failure.

4.  **Types & Utils**
    *   Shared interfaces (`src/types.ts`) ensure type safety across the application.
    *   Utility functions (`src/utils.ts`) provide common helpers.

This separation of concerns allows `doccident` to be easily extended—for example, by adding new parsers for different documentation formats or custom reporters for CI environments.

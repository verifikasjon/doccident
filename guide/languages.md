# Language Support Matrix & Requirements

**Purpose**: This document lists every supported language, the command-line tools required for execution, and any language-specific behaviors (like shared state parsing).

## Interpreted Languages

| Language | Code Fence | Required Binary | Execution Strategy | Shared State Support | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **JavaScript** | `js`, `javascript`, `es6` | Node.js (builtin) | `vm.runInNewContext` | ✅ In-Memory | Runs in same process via Node VM. |
| **TypeScript** | `ts`, `typescript` | Node.js (builtin) | `esbuild` -> `vm` | ✅ In-Memory | Transpiled on-the-fly. |
| **Python** | `py`, `python` | `python3` | Subprocess (stdin) | ✅ Accumulation | Args passed to interpreter. |
| **Perl** | `perl`, `pl` | `perl` | Subprocess (stdin) | ✅ Accumulation | |
| **Shell** | `sh`, `bash`, `zsh` | `bash`, `sh`, `zsh` | Subprocess (stdin) | ✅ Accumulation | Uses `-s` flag. |
| **R** | `r` | `Rscript` | Subprocess (stdin) | ✅ Accumulation | Uses `Rscript -`. |
| **BASIC** | `basic` | `cbmbasic` | Subprocess (stdin) | ✅ Accumulation | Commodore BASIC V2. |

## Compiled Languages

| Language | Code Fence | Required Binary | Compiler | Shared State Support | Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C** | `c` | `gcc` | `gcc` | ✅ Yes | Headers/Structs hoisted; statements -> `main()`. |
| **Go** | `go` | `go` | `go run` | ✅ Yes | Imports/Types hoisted; statements -> `main()`. |
| **Rust** | `rust`, `rs` | `rustc` | `rustc` | ✅ Yes | Attributes hoisted; statements -> `fn main()`. |
| **Fortran** | `fortran`, `f90` | `gfortran` | `gfortran` | ✅ Yes | Modules hoisted; statements -> `program main`. |
| **Java** | `java` | `javac`, `java` | `javac` | ❌ No | Wraps in `class Main`. |
| **C#** | `csharp`, `cs` | `mono`, `mcs` | `mcs` | ❌ No | Wraps in `class Program`. |
| **Pascal** | `pascal`, `pas` | `fpc` | `fpc` | ❌ No | Wraps in `program`. |

## Shared State Strategy (Accumulation)

For languages marked with **Accumulation** or **Yes**:
*   `doccident` maintains a running buffer of code from previous snippets in the same file.
*   **Parsing**: Some languages (Go, Rust, Fortran, C) require intelligent parsing to separate top-level declarations (imports, structs, modules) from executable statements. `doccident` handles this automatically.
*   **Idempotency**: Since code is re-executed for each subsequent snippet, ensure operations are idempotent (e.g., creating files/directories).

## Installation Commands (Ubuntu/Debian)

Use this reference to provision CI environments:

```bash
# Core
npm install

# Interpreted
sudo apt-get install python3 perl r-base

# Compiled
sudo apt-get install build-essential golang rustc gfortran gnucobol mono-devel fpc

# Custom (BASIC)
# Build cbmbasic from source (https://github.com/mist64/cbmbasic)
```


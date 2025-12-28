# Roadmap

The `doccident` project aims to be the standard for validating code examples in documentation. While the current version supports a wide array of languages and features, there are several exciting directions for future development.

## Recently Completed ✅

- [x] **Execution Timeout**: Configurable timeout for each snippet (default 5 minutes) to prevent infinite loops or hangs. Use `--timeout <ms>` to customize.
- [x] **Summary Table**: Markdown-formatted summary table with language, file, line, status, and execution time.
- [x] **Per-Snippet Configuration**: Pass arguments (`<!-- args: -->`) and environment variables (`<!-- env: -->`) to individual snippets.
- [x] **Output Verification**: Assign IDs to snippets and verify their output in subsequent blocks with exact, fuzzy (ignore-whitespace), or regex matching.
- [x] **Output Updates (Snapshots)**: Use `--update-output` to automatically populate output blocks with actual results.

## Short-Term Goals (v0.1 - v0.2)

### Enhanced Output Verification
- [ ] **Stream Capture**: Capture `stderr` separately from `stdout` and allow verifying error messages specifically.

### Language Expansion
- [ ] **Swift**: Add support for Swift using `swift` or `swiftc`.
- [ ] **PHP**: Add support for PHP scripts.
- [ ] **Ruby**: Add support for Ruby scripts.
- [ ] **Lua**: Add support for Lua scripts.

### Improved Reporting
- [ ] **JUnit XML Output**: Generate JUnit-compatible XML reports for better integration with CI/CD dashboards.

## Medium-Term Goals (v0.5)

### Advanced Shared State
- [ ] **Dependency Graph**: Instead of linear accumulation, allow snippets to declare explicit dependencies on other snippets (e.g., `<!-- depends-on: setup-db -->`). This would enable more complex, non-linear tutorials.
- [ ] **Idempotency Wrappers**: For compiled languages in shared mode, automatically wrap code to prevent side-effect duplication (e.g., checking if a struct is already defined in C before defining it).

### Configuration Enhancements
- [ ] **Runtime Arguments**: Distinguish between compiler flags and runtime arguments for compiled languages.

### Parallel Execution
- [ ] **Worker Threads**: Execute tests in parallel where possible (especially for isolated snippets) to significantly speed up validation of large documentation sets.

## Long-Term Vision (v1.0+)

### Interactive Documentation
- [ ] **Live Editing**: Explore integrations or plugins (e.g., for VS Code or web) that allow users to run `doccident` checks on a single block directly from their editor.

### Cross-Language Interoperability
- [ ] **Polyglot Workflows**: Support scenarios where a Python script generates data, saves it to a file, and a C program reads it. This would require an ordered execution graph across languages.

### Ecosystem Integration
- [ ] **Pre-commit Hooks**: Provide an official `pre-commit` hook definition for easy adoption in Python/Node projects.
- [ ] **GitHub Action**: Publish a dedicated GitHub Action to the marketplace for zero-config CI usage.


# Doccident Guide Index

This directory contains specialized guides for AI agents and tools to leverage `doccident`.

## Guides

*   [**Introduction**](./index.md): High-level overview, core capabilities, and basic usage. **Start here.**
*   [**Languages**](./languages.md): Detailed matrix of supported languages, required binaries, and shared state behaviors. Use this to check prerequisites.
*   [**Verification**](./verification.md): Deep dive into Output Verification, Matching Modes (Regex/Fuzzy), and the Auto-Update workflow.
*   [**Configuration**](./configuration.md): Instructions for using `args` and `env` directives to control execution.
*   [**Ideas & Scenarios**](./ideas.md): Inspiration for AI agents on how to apply `doccident` to solve real-world documentation problems (Living Tutorials, Regression Testing, etc.).

## Quick Reference

*   **Validate**: `npx doccident`
*   **Update Snapshots**: `npx doccident --update-output`
*   **Tag Snippet**: `<!-- id: name -->`
*   **Tag Output**: `<!-- output: name -->`
*   **Share State**: `<!-- share-code-between-examples -->` (at top of file)


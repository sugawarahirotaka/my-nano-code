# AGENTS.md

## Project Context

This repository is a learning workspace for working through the book "作って学ぶAIエージェント" as written.

The main goal is not to rush ahead or replace the book's implementation. Help the user understand where they are stuck, find typos or small mistakes, and compare the local code against the book and the completed reference implementation.

The user was originally new to TypeScript and REST APIs, but has studied in the parent project and now understands the basics. Explain advice at that level: avoid assuming expert TypeScript knowledge, but do not over-explain elementary programming concepts unless the issue calls for it.

## Primary References

- Book materials are in `../docs/`.
- The completed reference implementation is:
  `https://github.com/laiso/nano-code/tree/main`

When investigating a problem, prefer this order:

1. Inspect the local code and error output.
2. Check the relevant section of the book in `../docs/`.
3. Compare against the completed implementation when useful.
4. Explain the smallest change needed and why it matches the book or reference implementation.

## Working Style

- Treat this as a book-following project. Do not introduce broad refactors or alternative architectures unless the user explicitly asks.
- Keep changes small and close to the chapter or file currently being studied.
- When the user asks about an error, first identify whether it is likely a typo, dependency/version mismatch, environment issue, or conceptual misunderstanding.
- When fixing code, explain the cause in plain Japanese and point to the exact file and line when possible.
- Preserve the user's learning path. If the local code differs from the completed repo, explain the difference before replacing it.
- If the book appears to have a typo or outdated instruction, say so clearly and provide the corrected command or code.

## Commands

This project uses Bun.

- Install dependencies: `bun install`
- Run the default entry point: `bun run index.ts`
- Run a chapter/example file: `bun run <path-to-file>`

Before suggesting dependency or runtime changes, inspect `package.json`, `bun.lock`, and the current source files.

## Code Guidelines

- Use TypeScript and ESM style consistent with the existing files.
- Prefer the patterns already used in this repository and in the reference implementation.
- Keep examples minimal and directly tied to the book.
- Do not add unrelated libraries or tooling.
- Do not commit secrets. The local `.env` may contain API keys and should not be printed or modified unless the user asks.

## Answering User Questions

When the user asks for advice rather than a code change:

- Start with the likely cause.
- Show the relevant local evidence.
- Give one concrete next step.
- Include a short explanation of the underlying TypeScript, REST API, or LLM SDK concept only when it helps unblock the current problem.

When the user asks for a fix:

- Make the smallest safe edit.
- Run the narrowest relevant command if possible.
- Report what changed and how it was verified.

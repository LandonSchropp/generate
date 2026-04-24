# AGENTS.md

This file provides guidance to coding agents working with code in this repository.

@readme.md

## Running locally

`./src/index.js [generator]` — the bin is executable; don't prefix with `node`. The CLI operates on the caller's `cwd`, not this repo.

## Architecture

`src/index.js` passes `process.cwd()` as plop's `dest` while loading `plopfile.js` from this package. `plopfile.js` registers custom actions (`src/actions/`) and wires each generator (`src/<name>/index.js` exporting `default (plop) => plop.setGenerator(...)` with a sibling `.hbs` template).

**Generator pipeline** — every generator's `actions` array follows this order, keep it:

1. `gitSafetyCheck` (aborts on dirty tree; protects users from `force: true` writes)
2. `addPackages`
3. `add` / `mergeJSON` / `writeJSON`
4. `gitCommit` with explicit file list including `packageManagerLockFile()`

**Package manager abstraction** — `src/utilities/package-manager.js` detects via lockfile sniffing (yarn → pnpm → bun → npm). `addPackages` hard-codes per-manager flag differences (e.g., `bun install` not `bun add`); changes must cover all four.

**JSON merging** — `mergeJSON` deep-merges (remeda) for user-customizable files (`package.json`, `tsconfig.json`); `writeJSON` overwrites for files we fully own (`.lintstagedrc.json`).

**`initialize` is async at registration** (prefetches git/GitHub defaults), hence `await initialize(plop)` in `plopfile.js`. New async generators need the same pattern.

## Conventions

- ESM only; `.js` extensions in imports.
- Adding a generator requires three edits: new dir under `src/`, import in `plopfile.js`, call in the exported function.
- Run `pnpm run lint` after editing JavaScript files.

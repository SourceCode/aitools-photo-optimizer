# Monorepo Guide

This repository uses **pnpm workspaces** and **Turbo** (implied via script dependencies) to manage multiple packages.

## Structure

```text
.
├── apps/
│   └── demo/             # Vite-based usage example
├── packages/
│   ├── core/             # Business logic, types, hashing
│   ├── node/             # CLI, Workers, Sharp Adapter
│   └── web/              # Browser runtime
├── docs/                 # Documentation
└── package.json          # Root configuration
```

## Dependency Graph
- `apps/demo` -> depends on `web` and `node` (for build scripts).
- `node` -> depends on `core`.
- `web` -> depends on logic from `core`.

## Workspace Commands
Run commands across all packages:
```bash
pnpm -r run build
pnpm -r run test
```

## Versioning
Packages are currently versioned in lock-step (`0.0.0`) for development.
We follow SemVer when publishing.

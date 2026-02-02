# Monorepo Structure

This repository is organized as a monorepo using **pnpm workspaces**. It hosts multiple core packages and example applications.

## Workspace Layout

```mermaid
graph TD
    Root[Repo Root] --> Packages[packages/]
    Root --> Apps[apps/]
    
    Packages --> Core[@aitools-photo-optimizer/core]
    Packages --> Node[@aitools-photo-optimizer/node]
    Packages --> Web[@aitools-photo-optimizer/web]
    
    Apps --> Demo[demo-app]
    
    Node -->|Depends on| Core
    Web -->|Depends on| Core
    Demo -->|Depends on| Node
    Demo -->|Depends on| Web
```

## Packages

### Core (`packages/core`)
**Role**: Domain Logic & Types
Contains pure TypeScript entities, interfaces, and logic that is platform-agnostic.
- **Key Files**: `interfaces.ts`, `model/`, `planning/`, `hashing/`
- **Dependencies**: None (or pure util libs).

### Node (`packages/node`)
**Role**: Server/CLI Runtime
Implements the core interfaces for the Node.js environment.
- **Key Components**:
  - `FileSystemAdapter`: Local disk I/O.
  - `SharpAdapter`: Image processing using `sharp` native bindings.
  - `HeuristicClassifier`: Classification logic.
  - `CLI`: Command-line interface entry point.

### Web (`packages/web`)
**Role**: Browser Runtime
Lightweight client-side library for resolving and loading optimized assets.
- **Key Components**:
  - `AutoOptimizer`: MutationObserver for DOM updates.
  - `ResolveFn`: Strategy for mapping original paths to optimized paths.

## Apps

### Demo (`apps/demo`)
A Vite/React application that consumes the workspace packages to demonstrate end-to-end functionality.

## Workflow

- **Shared Dependencies**: Dependencies installed at root valid for all packages if hoisted, but package-specific ones are in `packages/*/package.json`.
- **Versioning**: Packages are versioned independently but currently synchronized for release convenience.
- **Building**: `pnpm build` in root triggers topological build.

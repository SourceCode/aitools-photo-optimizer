# Architecture & Implementation

This document details the internal architecture of the `aitools-photo-optimizer`.

## Repository Layout

The project is structured as a **PNPM Workspace Monorepo**:

- **`packages/core`**: Pure logic, interfaces, and models. Zero dependencies on Node.js APIs (platform agnostic).
- **`packages/node`**: Node.js runtime adapter. Handles FS, CLI, and Sharp integration.
- **`packages/web`**: Browser runtime (Observer) for auto-swapping images.
- **`apps/demo`**: Integration example.

## Core Pipeline

The optimization process is a linear pipeline designed for determinism and performance.

### 1. Scan Phase
**Location**: `packages/node/src/commands/build.ts`
- Uses `fast-glob` to find files.
- Creates `ImageInputDescriptor` with path and stats.

### 2. Classify Phase
**Location**: `packages/node/src/classifier.ts`
- **Heuristic Engine**: Analyze filename, extension, and metadata.
    - `screenshot`: Has keywords like "screen", "capture".
    - `icon`: Small dimensions, square aspect ratio.
    - `photo`: Default fallback.

### 3. Plan Phase
**Location**: `packages/core/src/planning/planner.ts`
- Takes `ImageInputDescriptor` + `OptimizerConfig`.
- Generates `TransformPlan`.
- **Determinism**: The Plan ID is a content hash of the input file + config. This allows skip-work caching.

### 4. Execute Phase
**Location**: `packages/node/src/commands/build.ts`
- Executes `TransformJob`s in parallel using a `WorkerPool`.
- Uses `sharp` to process buffers.
- Compares output size (checks for "saved bytes").

### 5. Manifest Generation
- Aggregates all plans into `manifest.json`.
- Maps Source Path -> Optimized Outputs.

## Key Design Decisions

### Separation of Concerns
`core` knows nothing about the file system. It only knows `Buffer` and `Job`. This allows the logic to potentially run in a tailored environment (e.g. WASM or Edge) in the future.

### Runtime Manifest
Instead of rewriting HTML at build time, we generate a manifest. A tiny runtime (`packages/web`) queries this manifest to swap `src` for `srcset` dynamically. This decouples the optimizer from the SSG/SSR framework.

### Validation
All configuration is validated via **Zod** schema (`packages/core/src/config/schema.ts`) to fail fast with descriptive errors.

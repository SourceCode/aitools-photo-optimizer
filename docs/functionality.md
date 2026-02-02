# Functionality Overview

The Optimizer operates in defined phases to transform raw assets into optimized web deliverables.

## Core Workflows

### 1. Classification (Heuristic Analysis)
The engine analyzes input images to determine their type.
- **Photo**: Complex gradients, many colors, camera data. -> Uses Lossy compression (AVIF/WebP) with subsampling.
- **Icon/Graphic**: Sharp edges, flat colors. -> Uses Lossless or Near-Lossless compression.
- **Screenshot**: Text-heavy, sharp lines. -> Optimized for readability.

### 2. Planning
The `Planner` creates a stateless list of jobs based on the input and target configuration.
- **Hashing**: Source contents are hashed to ensure cache-busting and determinism.
- **Formats**: Generates multiple formats (AVIF first, then WebP) for browser fallbacks.

### 3. Execution (Worker Pool)
Jobs are executed in parallel using Node.js Worker Threads (`worker_threads`).
- **Parallelism**: Defaults to `os.cpus().length`.
- **Isolation**: Crashes in a single image worker do not bring down the main process.

### 4. Source Updating
The CLI can optionally scan your codebase (`.html`, `.js`, `.ts`) and rewrite references to point to the optimized assets (or let the Runtime handle it).

### 5. Runtime (Web)
The `@aitools-photo-optimizer/web` package provides:
- **`AutoOptimizer`**: An observer that intercepts image requests and rewrites URLs based on the user's browser support (e.g., serving AVIF to Chrome users).

## Permissions
- **Read**: Needs read access to Source Glob paths.
- **Write**: Needs write access to Output Directory (creates it if missing).

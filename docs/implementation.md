# Implementation & Architecture

## System Design

The system follows a pipeline architecture:
`Input Glob` -> `Planner` -> `Job Queue` -> `Worker Pool` -> `Output IO`

### Module Boundaries

- **Core (`@aitools-photo-optimizer/core`)**
  - **Planner**: Determines what needs to be done. It takes a list of input files and a config, and outputs a `Map<JobId, TransformJob>`.
  - **Hashing**: Implements xxHash64 (via node-hash or similar) to generate stable content hashes for filenames.
  - **Models**: Defines `ImageCategory` (Photo, Icon, Screenshot) and `OutputFormat`.

- **Node (`@aitools-photo-optimizer/node`)**
  - **CLI**: Entry point using `cac` or `commander` (in this case, custom/lightweight).
  - **Worker Pool**: A custom `WorkerPool` implementation that manages N `worker_threads`. Each thread creates a `sharp` pipeline.
  - **Adapters**: Wraps `sharp` and `fs` to allow for easier testing/mocking.

- **Web (`@aitools-photo-optimizer/web`)**
  - **AutoOptimizer**: A client-side class that observes DOM mutations (via `MutationObserver`) or scans the document. It matches `src` attributes against the loaded `manifest.json` and swaps them for the optimal format supported by the browser.

## Data Flow
1.  **Read**: Core traverses directories matching the glob.
2.  **Plan**: For each file, calculate content hash. Check if it exists in cache/manifest.
3.  **Optimize**: If new/changed, create a Job.
4.  **Process**: Worker picks up job, loads file into Buffer (or Stream), runs `sharp` pipeline, writes to buffer.
5.  **Write**: Main thread writes buffer to disk (to avoid race conditions on file handles).
6.  **Manifest**: Updates `manifest.json` with new mapping.

## State Management
- **Stateless**: The CLI is mostly stateless between runs, relying on `manifest.json` as the state of truth for the previous run.
- **Incremental Builds**: By checking file hashes against the manifest, we skip processing unchanged files.

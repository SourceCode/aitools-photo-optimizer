# Functionality Overview

The Photo Optimizer is designed to automate the process of serving optimal images for modern web applications.

## Core Capabilities

1.  **Scanning**: Recursively finds images in a source directory using glob patterns.
2.  **Classification**: Analyzing image content to determine the best optimization strategy (e.g., Photos vs UI Screenshots).
3.  **Adaptive Optimization**:
    - Generates next-gen formats (`.avif`, `.webp`) automatically.
    - Preserves fallbacks (`.jpg`, `.png`).
    - Applies format-specific quality settings based on classification.
4.  **Manifest Generation**: Creates a `manifest.json` map that allows runtimes to look up the optimized asset for any given source file.
5.  **Runtime Resolution**: A lightweight client library that intercepts image loading or provides helper functions to serve the best available format for the user's browser (conceptual, currently `AutoOptimizer` does simple src swapping).

## User Roles

### Adapters & Integrators
Engineers who treat this tool as a black box service.
- **Goal**: "I want to put images in `public/images` and have them load fast."
- **Interaction**: Runs CLI builds, imports `AutoOptimizer` in frontend code.

### Platform Engineers
Developers who extend the tool for custom pipelines.
- **Goal**: "I want to add S3 storage or a custom classifier."
- **Interaction**: Extends `StorageAdapter`, `CodecAdapter`, or modifies default `HeuristicClassifier`.

## Workflow

1.  **Source**: Images are committed to the repo or stored in a known directory.
2.  **Build**: CI/CD or local script runs `apo build`.
3.  **Artifacts**: Optimized images and `manifest.json` are generated in the output folder.
4.  **Deploy**: Artifacts are deployed to the CDN/Web Server.
5.  **Runtime**: Client app loads `manifest.json` (or bundles it) and resolves image URLs dynamically.

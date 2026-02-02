# Functionality Overview

## Classification Engine

The optimizer doesn't treat all images equally. It uses a **Heuristic Classifier** to determine the best strategy.

| Classification | Detection Logic | Optimization Strategy |
|----------------|-----------------|-----------------------|
| **Screenshot** | 'screen', 'capture' in name | Higher quality, favor PNG/WebP lossless |
| **Icon** | < 64x64, square ratio | Lossless, crisp edges |
| **Photo** | Default | Balanced compression (AVIF/WebP) |

## Parallel Processing

The tool uses a **Worker Pool** to process multiple images concurrently.
- Limits concurrency based on CPU cores.
- Prevents main thread blocking.

## Manifest Mode

The tool generates a **Manifest File** (`manifest.json`) instead of overwriting source files.

**Benefits:**
- **Non-destructive**: Source files remain untouched.
- **Cache-busting**: Output filenames include content hashes.
- **Runtime flexibility**: The client decides which format to load.

## Content Hashing

Builds are incremental.
- Calculates hash of **Input Content** + **Config Options**.
- If the output file exists with that hash, optimization is skipped.

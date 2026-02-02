# 0001. Heuristic Classification

Date: 2026-02-02

## Status

Accepted

## Context

We needed a way to automatically classify input images (as photos, screenshots, icons) to apply appropriate optimization strategies (e.g., lossy vs. lossless, different chroma subsampling). We considered using ML-based classification (CLIP/TensorFlow) but it introduces heavy dependencies and latency.

## Decision

We decided to implement a `HeuristicClassifier` that relies on file metadata and simple statistics:
- **File Extensions/Names**: `screenshot_*.png`, `icon.png` offer strong clues.
- **Dimensions**: Small, square images often indicate icons.
- **Bit Depth / Palette**: Low numbers of unique colors indicate vectors or simple graphics.

## Consequences

**Positive**:
- Zero additional runtime dependencies (no TensorFlow).
- Extremely fast (stat check).
- Deterministic.

**Negative**:
- Less accurate than ML.
- Can be fooled by files lacking descriptive names.

**Mitigation**:
- We allow user override via configuration or folder-based rules in the future.

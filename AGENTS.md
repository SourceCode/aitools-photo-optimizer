# AGENTS.md

> [!IMPORTANT]
> This document is the **Source of Truth** for AI Agents interacting with the `aitools-photo-optimizer` repository. It defines capabilities, operational boundaries, and integration patterns.

## 1. Capabilities Mapping

The `aitools-photo-optimizer` is a monorepo offering a complete image optimization toolchain.

| Capability | Description | Core Component |
| :--- | :--- | :--- |
| **Scanning & Discovery** | Locates source images using `fast-glob`. Automatically respects ignore patterns (`node_modules`, `dist`, output dir). | `packages/node/src/cli.ts` |
| **Intelligent Classification** | Analyzes image stats and metadata to classify assets as `photo`, `screenshot`, `icon`, `vector`, `text`, or `unknown`. | `HeuristicClassifier` |
| **Adaptive Planning** | Generates a deterministic `TransformPlan` based on image classification and configuration presets (e.g., `web-2025-balanced`). | `packages/core/src/planning/planner.ts` |
| **Execution Engine** | Processes images using `sharp`. Handles resizing, format conversion (AVIF/WebP), and metadata stripping. | `SharpAdapter` |
| **Manifest Generation** | Produces a `manifest.json` mapping original file paths to optimized, hash-named output files for cache-busting and runtime lookup. | `manifest.ts` |
| **Web Runtime** | Client-side SDK that uses `MutationObserver` to automatically swap image `src` attributes with optimized variants. | `@aitools-photo-optimizer/web` |
| **Quality Gating** | Enforces minimum quality standards (SSIM, PSNR) per classification type to ensure visual fidelity. | `QualityMetrics` |

## 2. Operational Guidance

### 2.1. CLI Operations (`@aitools-photo-optimizer/node`)

The primary interface for build-time optimization.

**Command Syntax:**
```bash
apo build [glob-pattern] [options]
```

**Arguments:**
- `glob-pattern`: (Optional) Pattern to match source images. Default: `**/*.{jpg,jpeg,png}`.

**Options:**
- `-o, --out <dir>`: Output directory. Default: `public/images/optimized`.
- `-c, --clean`: Empty the output directory before processing.
- `-v, --verbose`: Enable detailed logging (classification results, compression metrics).

**Example Usage:**
```bash
# Build optimized variants
./packages/node/bin/apo.js build 'public/images/*.{jpg,png}' --out public/optimized

# Update source files
./packages/node/bin/apo.js update-source --source 'src/**/*.html' --manifest public/optimized/manifest.json
```

**Update Source Command:**
```bash
apo update-source [options]
```
**Options:**
- `-m, --manifest <path>`: Path to generic manifest. Default `public/images/optimized/manifest.json`.
- `-s, --source <glob>`: Source files to update. Default `src/**/*.{html,js,ts,jsx,tsx}`.
- `--dry-run`: Simulate changes.

### 2.2. Configuration (`apo.config.json`)

Agents modifying configuration should adhere to the `OptimizerConfig` interface.

**Schema Definition:**
```typescript
interface OptimizerConfig {
    quality: number;          // Global quality (0-100)
    lossless: boolean;        // Force lossless compression
    stripMetadata: boolean;   // Remove EXIF/ICC data
    effort: number;           // CPU effort (0-9)
    formats: ('avif' | 'webp' | 'jpeg' | 'png')[]; // Target formats
    presets?: Record<string, string>; // Map classification -> preset name
    definedPresets?: Record<string, OptimizationPreset>;
    qualityGates?: Record<ImageClassification, QualityMetrics>;
}
```

**Default Presets:**
- `photo` -> `web-2025-balanced` (AVIF/WebP, Q80)
- `screenshot` -> `ui-assets-crisp` (Near-lossless WebP, Q90)

### 2.3. Web Runtime (`@aitools-photo-optimizer/web`)

**Integration Pattern:**
```typescript
import { AutoOptimizer } from '@aitools-photo-optimizer/web';

// Initialize with a resolver function
const optimizer = new AutoOptimizer((src, width, format) => {
    // Logic to map source path to optimized path (e.g., using manifest)
    return resolveOptimizedUrl(src, format);
});

// Start observing the DOM
optimizer.start();
```

## 3. Context & Constraints

### 3.1. System Requirements
- **Runtime**: Node.js v24.13.0+ (Strict Requirement).
- **Native Modules**: Depends on `sharp`. Ensure native bindings are valid for the current OS/Arch.

### 3.2. Data Formats
- **Input**:
    - File Paths (via CLI)
    - Buffers (via Core API)
- **Output**:
    - Optimizes images to `[content-hash]-[width]w-[options-hash].[format]`.
    - Manifest format:
      ```json
      {
        "entries": {
          "src/img.jpg": {
            "inputPath": "src/img.jpg",
            "contentHash": "...",
            "classification": "photo",
            "outputs": [
              { "format": "avif", "path": "...", "size": 1024, "metrics": { "ssim": 0.98 } }
            ]
          }
        }
      }
      ```

### 3.3. Logical Constraints
- **Concurrency**: Default local queue concurrency is 4. High-volume runs may require adjustment via code (currently hardcoded in CLI).
- **Format Order**: The `formats` array in config determines generation order.
- **Classification**: Heuristics are based on file stats and basic metadata. Overrides via config are not yet supported per-file.

## 4. Development Workflow

### 4.1. Building the Project
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### 4.2. Testing
```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @aitools-photo-optimizer/core test
```

> [!NOTE]
> AI Agents should always verify `pnpm build` success after modifying core interfaces or CLI logic.

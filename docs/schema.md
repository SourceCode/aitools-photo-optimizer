# Schema Reference

This document outlines the key data structures used in the system across config and manifests.

## Configuration Schema (`OptimizerConfig`)

Used in `apo.config.json` or defaults.

| Field | Type | Description |
| :--- | :--- | :--- |
| `quality` | `number` | 0-100 base quality. |
| `lossless` | `boolean` | Enable lossless compression. |
| `formats` | `string[]` | Output formats (avif, webp, jpeg, png). |
| `presets` | `Map<Classification, PresetName>` | Mapping of image types to preset settings. |
| `qualityGates` | `Map<Classification, QualityMetrics>` | Minimum SSIM/PSNR scores required. |

## Manifest Schema

Generated at `manifest.json`.

```typescript
interface Manifest {
    version: string;
    entries: Record<string, ManifestEntry>;
}

interface ManifestEntry {
    inputPath: string; // Relative path of source
    contentHash: string; // Unique hash of plan
    classification: 'photo' | 'screenshot' | 'vector' | 'icon' | 'text' | 'unknown';
    outputs: OptimizedAsset[];
}

interface OptimizedAsset {
    format: 'avif' | 'webp' | 'jpeg' | 'png';
    width: number;
    height: number;
    path: string; // Relative path to output file
    size: number; // Bytes
    metrics?: {
        ssim?: number;
    };
}
```

## Internal Models

### `ImageInputDescriptor`

Describes a source image before processing.

```typescript
interface ImageInputDescriptor {
    path: string;
    stats: {
        size: number;
        mtime: Date;
    };
    classification?: string;
}
```

### `TransformPlan`

The blueprint for a specific file's optimization.

```typescript
interface TransformPlan {
    id: string; // Hash
    input: ImageInputDescriptor;
    outputs: TransformJob[];
}
```

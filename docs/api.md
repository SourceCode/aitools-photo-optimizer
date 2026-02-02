# API Reference

## CLI Reference

### `build`

Scans and optimizes images.

```bash
apo build <glob-pattern> [options]
```

**Options:**
- `--out <dir>`: Output directory (default: `dist`).
- `--clean`: Empty output directory before building.
- `--verbose`: Print detailed logs.
- `--json`: Output logs as JSON (for agents/machines).
- `--help`: Show help.

### `update-source`

Updates source code to reference optimized assets.

```bash
apo update-source <glob-pattern> [options]
```

**Options:**
- `--manifest <path>`: Path to manifest (default: `manifest.json`).
- `--dry-run`: Don't write changes.

## Core Interfaces

### `TransformJob`

The atomic unit of work.

```typescript
interface TransformJob {
    kind: 'transform';
    width?: number;
    height?: number;
    format: 'avif' | 'webp' | 'jpeg' | 'png';
    options: OptimizerConfig;
    outputName: string;
}
```

### `TransformPlan`

```typescript
interface TransformPlan {
    id: string;
    input: ImageInputDescriptor;
    outputs: TransformJob[];
}
```

### `ImageInputDescriptor`

```typescript
interface ImageInputDescriptor {
    path: string;
    stats: { size: number; mtime: Date };
    classification?: 'photo' | 'screenshot' | 'icon' | 'vector';
}
```

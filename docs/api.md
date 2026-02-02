# API Reference

## CLI (Node)

The CLI is the primary interface for build-time optimization.

### `apo build [glob]`

Scans and optimizes images.

**Arguments:**
- `glob`: (Optional) Pattern to match images. Default: `**/*.{jpg,jpeg,png}`.

**Options:**
- `-o, --out <dir>`: Output directory. Default: `public/images/optimized`.
- `-c, --clean`: Empty the output directory before starting.
- `-v, --verbose`: Print detailed logs including classification results and SSIM metrics.

**Example:**
```bash
apo build 'src/assets/**/*' --out dist/assets --clean
```

---

## Web Runtime (`@aitools-photo-optimizer/web`)

### `AutoOptimizer`

The main class for client-side adaptive loading.

#### `constructor(resolver: ResolveFn, root?: HTMLElement)`

- `resolver`: A function `(src: string, width: number, format: string) => string | undefined`.
- `root`: The root element to observe (default `document.body`).

#### `start()`

Starts the `MutationObserver` to watch for new `<img>` tags or `src` attribute changes.

### Type Definitions

#### `ResolveFn`

```typescript
type ResolveFn = (src: string, width: number | undefined, format: string) => string | undefined;
```

## Core Interfaces (`@aitools-photo-optimizer/core`)

These interfaces are used when building custom adapters.

### `CodecAdapter`

```typescript
interface CodecAdapter {
    optimize(input: Buffer, job: TransformJob): Promise<{ buffer: Buffer; info: any }>;
    metadata(input: Buffer): Promise<{ width: number; height: number; format: string }>;
}
```

### `StorageAdapter`

```typescript
interface StorageAdapter {
    read(path: string): Promise<Buffer>;
    write(path: string, data: Buffer): Promise<void>;
}
```

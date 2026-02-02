# API Reference

## CLI Reference

Usage: `apo [command] [options]`

### `build`
Optimizes images matching a glob pattern.

```bash
apo build <glob> [options]
```
**Arguments**:
- `glob`: (Required) File glob pattern (e.g., `'src/images/**/*.png'`).

**Options**:
- `-o, --out <dir>`: Output directory (default: `dist/images`).
- `--clean`: Empty output directory before building.
- `--verbose`: Enable detailed logging.
- `--json`: Output result as JSON (useful for CI/scripts).

### `update-source`
Rewrites source code to reference optimized assets.

```bash
apo update-source <glob> [options]
```
**Options**:
- `--manifest <path>`: Path to `manifest.json`.

## Library Reference (Node)

```typescript
import { OptimizeProject } from '@aitools-photo-optimizer/node';

const result = await OptimizeProject({
  input: ['src/*.png'],
  outDir: 'dist',
  config: { ... }
});
```

## Library Reference (Web)

```typescript
import { AutoOptimizer } from '@aitools-photo-optimizer/web';

const optimizer = new AutoOptimizer((src) => {
  // Return the new URL based on logical reasoning or manifest lookup
  return resolveUrl(src);
});

// Start observing the DOM
optimizer.start();
```

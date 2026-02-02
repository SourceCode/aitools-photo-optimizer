# First Run Guide

This guide walks you through your first usage of `aitools-photo-optimizer`.

## 1. Prepare Source Images
Create a directory with some raw images.
```bash
mkdir -p raw-images
# Copy some .jpg/.png files here
```

## 2. Run the Optimizer
Run the build command to optimize images.
```bash
# If running via local node package
node packages/node/bin/apo.js build "raw-images/*" --out optimized-images --verbose
```
**Output**:
- You should see the CLI scanning files.
- It will classify them (e.g., `[photo]`, `[icon]`).
- It will generate optimized versions (AVIF, WebP).
- It generates a `manifest.json`.

## 3. Visualize Results
Check the output directory:
```bash
ls -l optimized-images/
```
You will see source-hashed filenames like `d5b031..._800x600_... .webp`.

## 4. Run the Demo App
To see how these images interpret in a browser:

1.  Start the demo:
    ```bash
    pnpm -C apps/demo dev
    ```
2.  Open `http://localhost:5173`.
3.  The demo app uses the `@aitools-photo-optimizer/web` runtime to load images dynamically.

## Golden Path Commands
- **Build**: `pnpm build`
- **Test**: `pnpm test`
- **Optimize**: `apo build <glob> -o <out>`

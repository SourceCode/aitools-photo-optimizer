# First Run Guide

This guide will walk you through your first usage of the Photo Optimizer CLI and verifying the output.

## 1. Prepare Source Images

Create a directory with some raw images you want to optimize.

```bash
mkdir -p public/images
# Add some jpg/png files to public/images/
```

## 2. Run the Build Command

Use the CLI to optimize the images.

```bash
# FROM: Root of the repo
./packages/node/bin/apo.js build 'public/images/*.{jpg,png}' --out public/optimized --verbose
```

**Expected Output:**

```text
Scanning for images matching: public/images/*.{jpg,png}
Found 2 images.
[public/images/photo.jpg] Classified as: photo
Generated photo_hash.avif (SSIM: 0.96)
Generated photo_hash.webp (SSIM: 0.95)
...
Build complete! Manifest written to manifest.json
Total space saved: 1.24 MB
```

## 3. Verify Output

Navigate to the output directory:

```bash
cd public/optimized
ls -lh
```

You should see:
- Optimized `.avif` and `.webp` files.
- `manifest.json`: A JSON map connecting your original files to the optimized versions.

## 4. Run the Demo App

To see the Web Runtime in action, use the provided demo app.

```bash
# Start the demo
cd apps/demo
pnpm dev
```

Open `http://localhost:5173` (or the port shown). The demo app is pre-configured to use the `@aitools-photo-optimizer/web` runtime to adaptively load the images you just built.

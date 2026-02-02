# First Run Guide

This guide will walk you through your first optimization run.

## 1. Prepare Source Images

Create a folder for your source images if you haven't already.
```bash
mkdir -p inputs
# Copy some images here
cp ~/Downloads/my-photo.jpg inputs/
```

## 2. Check Configuration

Create a `apo.config.json` in your root.
```json
{
  "quality": 75,
  "formats": ["webp"]
}
```

## 3. Run Optimization

Run the CLI command via the `apo` binary.

```bash
# If running from source
./packages/node/bin/apo.js build "inputs/*.jpg" --out dist --verbose
```

**Expected Output:**
```text
Scanning for images matching: inputs/*.jpg
Found 1 images.
[inputs/my-photo.jpg] Classified as: photo
Generated my-photo_hash.webp
Build complete! Manifest written to manifest.json
```

## 4. Verify Output

Check the `dist` folder.
```bash
ls -lh dist
```
You should see the optimized files and a `manifest.json`.

## 5. Next Steps

- Integrate the `packages/web` runtime to load these images.
- Adjust `apo.config.json` to tune quality.

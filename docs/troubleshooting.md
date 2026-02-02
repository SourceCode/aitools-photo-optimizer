# Troubleshooting

## Common Issues

### 1. "Sharp Prebuilt Binaries Not Found"
**Error**: `Something went wrong installing the "sharp" module`
**Solution**:
- Run `pnpm rebuild sharp`
- Ensure you are on a supported architecture (x64, arm64).
- If using Alpine Linux (Docker), use `npm install --platform=linuxmusl --arch=x64 sharp`.

### 2. "Images not loading in Web Runtime"
**Symptoms**: Images show broken link or original source.
**Checks**:
- Check browser console for 404s.
- Verify `manifest.json` exists in the output folder.
- Ensure the `AutoOptimizer` resolver function matches your URL structure.
  ```ts
  // Debug resolver
  const optimizer = new AutoOptimizer((src, w, fmt) => {
    console.log('Resolving:', src, fmt);
    return ...
  });
  ```

### 3. Build is slow
**Cause**: High resolution images or `effort: 9`.
**Solution**:
- Lower `effort` in config (default is 4, max is 9).
- Check `concurrency` setting (defaults to CPU cores).

## Logging

Use verbose mode to see what's happening:

```bash
apo build ... --verbose
```

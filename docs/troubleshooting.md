# Troubleshooting

## Common Errors

### `Input buffer contains unsupported image format`
**Cause**: The input file is not a valid image or is corrupted.
**Fix**: Verify the file opens in a standard viewer. Check if `sharp` supports it (e.g., HEIC might need specific libs).

### `VipsJpeg: premature end of JPEG image`
**Cause**: Truncated input file.
**Fix**: Re-download or regenerate the source image.

### `Configuration Error: ...`
**Cause**: `apo.config.json` is invalid.
**Fix**: Read the error message carefully; it lists the exact path and issue. Refer to [Schema](schema.md).

### `ERR_PNPM_ENGINE_STRICT`
**Cause**: Wrong Node version.
**Fix**: Switch to Node v24.13.0+.

## Debugging

Run with verbose logging:
```bash
apo build "..." --verbose
```

## Resetting

To clear the cache/output:
```bash
apo build "..." --clean
```
Or manually delete the output directory.

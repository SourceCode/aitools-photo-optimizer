# Troubleshooting

## Installation Issues

### `sharp` architecture mismatch
**Error**: `Module did not self-register` or `incompatible library version`.
**Fix**:
1.  Run `rm -rf node_modules pnpm-lock.yaml`.
2.  Run `pnpm install`.
3.  If on Alpine Linux, install `vips-dev`.

### `pnpm` workspace not found
**Error**: `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`
**Fix**: Ensure you are running `pnpm install` from the root directory.

## Runtime Issues

### Images not loading in Demo
**Symptom**: 404 errors for images.
**Check**:
1.  Did you run `pnpm build`? The demo relies on `packages/web` being built.
2.  Did you run the optimize command?
3.  Check `manifest.json` in the public/output folder.

### "Worker exited with code 1"
**Symptom**: CLI crashes.
**Check**:
1.  Run with `--verbose` to see the full stack trace from the worker.
2.  Check for corrupt Input images.

## Performance Issues
**Symptom**: Build is slow.
**Fix**:
- Reduce concurrency: `UV_THREADPOOL_SIZE=2 apo build ...`
- Check disk I/O speed.

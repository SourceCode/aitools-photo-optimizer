# Integrations

## Web Frameworks

### Vite / React
The `apps/demo` project functions as a reference implementation for Vite.
1.  **Build Step**: Run `apo build` *before* `vite build`.
2.  **Runtime**: Initialize `AutoOptimizer` in your entry point (`main.ts` / `index.js`).
3.  **Static Assets**: Ensure optimized images are in `public/` or copied to `dist/`.

### Next.js
(Future Work)
- A Next.js plugin could wrap the `<Image />` component to automatically lookup the manifest.

## CI/CD integration

### GitHub Actions
```yaml
- name: Optimize Images
  run: pnpm apo build "public/images/*" --out public/optimized
- name: Commit Changes (optional)
  # ... script to commit optimized assets if checking them in
```

### Static Analysis
Since the tool is strictly typed, it integrates well with standard TypeScript pipelines.

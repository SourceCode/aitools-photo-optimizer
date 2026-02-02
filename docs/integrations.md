# Integrations

## Image Processing: Sharp

The core engine relies on [sharp](https://sharp.pixelplumbing.com/) for all image manipulations.

- **Requirements**: Native binaries must be available for the host OS.
- **Performance**: `sharp` uses `libvips` which is highly optimized and multi-threaded. We manage concurrency at the file level to avoid starving the thread pool.

## Web Frameworks

### React / Next.js

While there is no dedicated React component yet, the `AutoOptimizer` can be used in a `useEffect` hook at the root of your application.

```tsx
useEffect(() => {
  const optimizer = new AutoOptimizer(myResolver);
  optimizer.start();
  // Cleanup not strictly necessary for singleton observer but good practice
}, []);
```

### Vite

The demo app uses Vite. The build process integrates naturally by running the `apo build` command before or during the vite build step.

**package.json example:**
```json
"scripts": {
  "build": "apo build 'public/**/*' --out public/opt && vite build"
}
```

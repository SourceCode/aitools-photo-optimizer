import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/cli.ts', 'src/worker-entry.ts', 'src/index.ts'],
    format: ['cjs'],
    target: 'node18',
    clean: true,
    sourcemap: true,
    noExternal: ['@aitools-photo-optimizer/core'], // Bundle the core workspace package
    external: ['sharp', 'fsevents'], // Keep native modules external
    splitting: false,
    dts: false,
});

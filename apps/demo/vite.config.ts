import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ['@aitools-photo-optimizer/web']
    }
});

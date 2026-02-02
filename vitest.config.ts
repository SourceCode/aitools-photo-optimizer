import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        reporters: ['default', 'json'],
        outputFile: {
            json: 'test-results.json'
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                '**/dist/**',
                '**/node_modules/**',
                '**/test/**',
                '**/*.config.*',
                '**/*.d.ts',
            ]
        }
    }
});

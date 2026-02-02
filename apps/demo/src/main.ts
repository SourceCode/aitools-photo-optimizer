import { AutoOptimizer } from '@aitools-photo-optimizer/web';

// Mock manifest loader - in real app would fetch manifest.json
const fetchManifest = async () => {
    try {
        const res = await fetch('/optimized/manifest.json');
        return await res.json();
    } catch (e) {
        console.warn('Manifest not found');
        return null;
    }
};

(async () => {
    const manifest = await fetchManifest();

    const optimizer = new AutoOptimizer((src, _width, format) => {
        // Simple resolving logic based on manifest
        // In real app, match the exact src path in manifest entries
        // Remove leading slash for matching if needed
        const key = src.startsWith('/') ? src.slice(1) : src; // "images/sample.jpg"

        // Very basic fuzzy match for demo
        const entry = Object.entries(manifest?.entries || {}).find(([k]) => k.endsWith(key));

        if (entry) {
            const [, data] = entry as [string, { outputs: { format: string; path: string }[] }];
            const output = data.outputs.find((o) => o.format === format);
            if (output) {
                return `/${output.path}`; // Return relative path from root
            }
        }

        return undefined;
    });

    console.log('Starting optimizer...');
    optimizer.start();
})();

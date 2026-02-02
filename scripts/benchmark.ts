import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(__dirname, '..');
const BENCH_DIR = path.join(ROOT, 'temp_bench');
const OUT_DIR = path.join(BENCH_DIR, 'out');

// Ensure clean state
if (fs.existsSync(BENCH_DIR)) {
    fs.rmSync(BENCH_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BENCH_DIR);

const SAMPLE_IMG = path.join(BENCH_DIR, 'sample.png');

// Create a 1x1 pixel PNG
console.log('Creating sample file...');
const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
fs.writeFileSync(SAMPLE_IMG, buffer);

try {
    console.log('Running Benchmark...');
    const start = Date.now();

    // Run CLI
    // We assume 'apo' is linked or we run via node packages/node/bin/apo.js
    const CLI = path.join(ROOT, 'packages/node/bin/apo.js');
    // Note: Use *.png glob
    const cmd = `node ${CLI} build "${BENCH_DIR}/*.png" --out ${OUT_DIR} --json --clean`;

    const output = execSync(cmd).toString();
    const duration = Date.now() - start;

    console.log('Benchmark Output:', output);

    try {
        const result = JSON.parse(output);
        const report = {
            durationMs: duration,
            imagesProcessed: result.totalFiles,
            totalSavedBytes: result.totalSavedBytes,
            imagesPerSecond: (result.totalFiles / (duration / 1000)).toFixed(2)
        };
        console.log('BENCHMARK REPORT:', JSON.stringify(report, null, 2));
    } catch (_e) {
        console.error('Failed to parse benchmark JSON output');
    }

} catch (e) {
    console.error('Benchmark failed:', e);
    process.exit(1);
} finally {
    // Cleanup
    if (fs.existsSync(BENCH_DIR)) {
        fs.rmSync(BENCH_DIR, { recursive: true, force: true });
    }
}

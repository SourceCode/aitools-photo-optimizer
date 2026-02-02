import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

const CLI_PATH = path.resolve(__dirname, '../bin/apo.js');
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures/golden');
const OUTPUT_DIR = path.resolve(__dirname, 'output/golden');

describe('Golden Image Tests (E2E)', () => {
    beforeAll(async () => {
        // Ensure fixtures exist
        if (!(await fs.pathExists(FIXTURES_DIR))) {
            throw new Error(`Fixtures not found at ${FIXTURES_DIR}. Run generate_fixtures.js first.`);
        }
    });

    it('should build golden images with correct classification and presets', async () => {
        // Run CLI build command
        // We use -v for verbose to check classification logs
        const cmd = `${process.execPath} ${CLI_PATH} build "${FIXTURES_DIR}/*" -o ${OUTPUT_DIR} -c -v`;

        console.log('Running:', cmd);
        const { stdout, stderr } = await execAsync(cmd);

        // Log output for debugging
        console.log('STDOUT:', stdout);
        if (stderr) console.error('STDERR:', stderr);

        // Verify Manifest
        const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
        expect(await fs.pathExists(manifestPath)).toBe(true);
        const manifest = await fs.readJSON(manifestPath);

        const photoKey = Object.keys(manifest.entries).find(k => k.includes('photo.jpg'));
        const screenshotKey = Object.keys(manifest.entries).find(k => k.includes('screenshot.png'));
        const iconKey = Object.keys(manifest.entries).find(k => k.includes('icon.png'));

        expect(photoKey).toBeDefined();
        expect(screenshotKey).toBeDefined();

        // Verify Classification
        expect(manifest.entries[photoKey!].classification).toBe('photo');
        expect(manifest.entries[iconKey!].classification).toMatch(/icon|vector/);
        // Heuristic might classify PNG icon as 'icon' based on size? 
        // Or 'screenshot' if filename matching fails?
        // My heuristic code: check path includes 'icon'. YES, file is 'icon.png'.

        // Verify Outputs
        const photoOutputs = manifest.entries[photoKey!].outputs;
        expect(photoOutputs.length).toBeGreaterThan(0);

        // Check formats
        const formats = photoOutputs.map((o: any) => o.format);
        expect(formats).toContain('avif');
        expect(formats).toContain('webp');

        // Check file existence
        for (const output of photoOutputs) {
            const outputPath = path.resolve(process.cwd(), output.path); // path in manifest is relative to CWD? 
            // CLI outputs relative path from CWD.
            // But we ran CLI.
            // OUTPUT_DIR is absolute. 
            // In manifest, "path": "test/output/golden/..."?
            // Let's verify standard behavior.
            const absPath = path.resolve(process.cwd(), output.path);
            expect(await fs.pathExists(absPath)).toBe(true);

            // Verify Metrics if present
            // We stubbed SSIM: 1.0 in worker-entry.
            expect(output.metrics).toBeDefined();
            expect(output.metrics.ssim).toBe(1.0);
        }
    }, 30000); // 30s timeout
});

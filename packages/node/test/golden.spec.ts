import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import { Manifest } from '@aitools-photo-optimizer/core';

const CLI_PATH = path.resolve(__dirname, '../bin/apo.js');
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures/golden');
const OUTPUT_DIR = path.resolve(__dirname, 'output/golden');

describe('Golden Image Tests (E2E)', () => {
    beforeAll(async () => {
        // Ensure fixtures exist
        if (!(await fs.pathExists(FIXTURES_DIR))) {
            throw new Error(`Fixtures not found at ${FIXTURES_DIR}. Run generate_fixtures.js first.`);
        }
        await fs.remove(OUTPUT_DIR);
    });

    it('should build golden images with correct classification and presets', async () => {
        // Run CLI build command
        // We use -v for verbose to check classification logs
        const cmd = `${process.execPath} ${CLI_PATH} build "${FIXTURES_DIR}/*" -o ${OUTPUT_DIR} -c -v`;

        console.log('Running:', cmd);
        console.log('CWD:', process.cwd());
        console.log('ExecPath:', process.execPath);

        try {
            const stdout = execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' });
            console.log('STDOUT:', stdout);
        } catch (e: any) {
            console.error('STDERR:', e.stderr?.toString());
            console.error('STDOUT (partial):', e.stdout?.toString());
            throw e;
        }

        // Verify Manifest
        const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
        expect(await fs.pathExists(manifestPath)).toBe(true);
        const manifest = await fs.readJSON(manifestPath) as Manifest;

        const photoKey = Object.keys(manifest.entries).find(k => k.includes('photo.jpg'));
        const screenshotKey = Object.keys(manifest.entries).find(k => k.includes('screenshot.png'));
        const iconKey = Object.keys(manifest.entries).find(k => k.includes('icon.png'));

        expect(photoKey).toBeDefined();
        expect(screenshotKey).toBeDefined();

        // Verify Classification
        expect(manifest.entries[photoKey!].classification).toBe('photo');
        expect(manifest.entries[iconKey!].classification).toMatch(/icon|vector/);

        // Verify Outputs
        const photoOutputs = manifest.entries[photoKey!].outputs;
        expect(photoOutputs.length).toBeGreaterThan(0);

        // Check formats
        const formats = photoOutputs.map((o) => o.format);
        expect(formats).toContain('avif');
        expect(formats).toContain('webp');

        // Check file existence
        for (const output of photoOutputs) {
            const absPath = path.resolve(process.cwd(), output.path);
            console.log(`Checking file: ${absPath} (from ${output.path})`);
            expect(await fs.pathExists(absPath)).toBe(true);

            // Verify Metrics if present
            expect(output.metrics).toBeDefined();
            expect(output.metrics!.ssim).toBe(1.0);
        }
    }, 30000); // 30s timeout
});

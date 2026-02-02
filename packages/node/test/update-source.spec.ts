import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';

const CLI_PATH = path.resolve(__dirname, '../bin/apo.js');
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures/source-update');
const TEMP_DIR = path.resolve(__dirname, 'temp-source-update-cli');

describe('CLI source-update', () => {
    beforeAll(async () => {
        // Setup temp dir with HTML/JS files
        await fs.ensureDir(TEMP_DIR);
        const indexHtml = `
            <!DOCTYPE html>
            <html>
                <body>
                    <img src="photo.jpg" alt="Photo">
                </body>
            </html>
        `;
        await fs.writeFile(path.join(TEMP_DIR, 'index.html'), indexHtml);

        // Create dummy manifest
        const manifest = {
            version: 1,
            generatedAt: new Date().toISOString(),
            entries: {
                [`${TEMP_DIR}/photo.jpg`]: {
                    inputPath: `${TEMP_DIR}/photo.jpg`,
                    contentHash: 'abc',
                    classification: 'photo',
                    outputs: [
                        { format: 'webp', width: 800, height: 600, path: 'optimized/photo.webp', size: 100 },
                        { format: 'jpg', width: 800, height: 600, path: 'optimized/photo.jpg', size: 120 }
                    ]
                }
            }
        };
        await fs.writeJSON(path.join(TEMP_DIR, 'manifest.json'), manifest);
    });

    afterAll(async () => {
        await fs.remove(TEMP_DIR);
    });

    it('should update source files using CLI', () => {
        const cmd = `${process.execPath} ${CLI_PATH} update-source -m ${path.join(TEMP_DIR, 'manifest.json')} -s "${TEMP_DIR}/*.html"`;

        try {
            execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' });
        } catch (e: any) {
            console.error('STDERR:', e.stderr?.toString());
            throw e;
        }

        const updatedHtml = fs.readFileSync(path.join(TEMP_DIR, 'index.html'), 'utf-8');
        expect(updatedHtml).toContain('srcset="optimized/photo.webp 800w"');
    });

    it('should support dry-run', () => {
        // Reset file
        const indexHtml = '<img src="photo.jpg">';
        fs.writeFileSync(path.join(TEMP_DIR, 'dry.html'), indexHtml);

        const cmd = `${process.execPath} ${CLI_PATH} update-source -m ${path.join(TEMP_DIR, 'manifest.json')} -s "${TEMP_DIR}/dry.html" --dry-run`;
        execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' });

        const content = fs.readFileSync(path.join(TEMP_DIR, 'dry.html'), 'utf-8');
        expect(content).toBe(indexHtml); // Unchanged
    });
});

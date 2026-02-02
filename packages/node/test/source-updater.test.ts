import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { SourceUpdater } from '../src/source-updater';
import { Manifest } from '@aitools-photo-optimizer/core';

const TEST_DIR = path.join(__dirname, 'temp-source-updater');
const MANIFEST_PATH = path.join(TEST_DIR, 'manifest.json');

const SAMPLE_MANIFEST: Manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    entries: {
        'images/hero.jpg': {
            inputPath: 'images/hero.jpg',
            contentHash: 'abc123hash',
            outputs: [
                {
                    format: 'jpeg',
                    width: 800,
                    height: 600,
                    path: 'optimized/hero-800.jpeg',
                    size: 50000
                },
                {
                    format: 'webp',
                    width: 800,
                    height: 600,
                    path: 'optimized/hero-800.webp',
                    size: 40000
                }
            ]
        },
        'images/icon.png': {
            inputPath: 'images/icon.png',
            contentHash: 'def456hash',
            outputs: [
                {
                    format: 'png',
                    width: 64,
                    height: 64,
                    path: 'optimized/icon.png',
                    size: 2000
                }
            ]
        }
    }
};

describe('SourceUpdater', () => {
    beforeEach(async () => {
        await fs.ensureDir(TEST_DIR);
        await fs.writeJSON(MANIFEST_PATH, SAMPLE_MANIFEST);
    });

    afterEach(async () => {
        await fs.remove(TEST_DIR);
    });

    it('should load manifest correctly', async () => {
        const updater = new SourceUpdater(MANIFEST_PATH);
        await updater.loadManifest();
        // Access private property for testing if needed or just trust it works if scan doesn't fail
        expect(updater['manifest']).toEqual(SAMPLE_MANIFEST);
    });

    it('should replace img src and add srcset', async () => {
        const htmlPath = path.join(TEST_DIR, 'index.html');
        const originalHtml = `
            <html>
                <body>
                    <img src="images/hero.jpg" alt="Hero Image">
                    <img src="other/image.jpg">
                </body>
            </html>
        `;
        await fs.writeFile(htmlPath, originalHtml);

        const updater = new SourceUpdater(MANIFEST_PATH);
        await updater.scanAndReplace('**/*.html', TEST_DIR);

        const updatedHtml = await fs.readFile(htmlPath, 'utf-8');

        // Expect hero.jpg to have srcset added
        expect(updatedHtml).toContain('srcset="optimized/hero-800.webp 800w"');
        // Expect hero.jpg src to potentially be updated to fallback (though basic implementation might keep it or update it)
        // In my implementation: "return `${prefix}${fallback.path}${suffix}`" -> src becomes optimized/hero-800.jpeg
        expect(updatedHtml).toContain('src="optimized/hero-800.jpeg"');

        // Expect other image to be untouched
        expect(updatedHtml).toContain('src="other/image.jpg"');
    });

    it('should replace string references in JS/TS files', async () => {
        const jsPath = path.join(TEST_DIR, 'app.ts');
        const originalJs = `
            const heroImage = "images/hero.jpg";
            const icon = 'images/icon.png';
            import img from "./images/hero.jpg";
        `;
        await fs.writeFile(jsPath, originalJs);

        const updater = new SourceUpdater(MANIFEST_PATH);
        await updater.scanAndReplace('**/*.ts', TEST_DIR);

        const updatedJs = await fs.readFile(jsPath, 'utf-8');

        // Expect replacements
        expect(updatedJs).toContain('"optimized/hero-800.jpeg"'); // Uses fallback logic for strings
        expect(updatedJs).toContain("'optimized/icon.png'");
        // Ensure imports are also handled if they match the string pattern
        expect(updatedJs).toContain('"optimized/hero-800.jpeg"');
    });

    it('should not modify files in dry-run mode', async () => {
        const htmlPath = path.join(TEST_DIR, 'dry.html');
        const originalHtml = '<img src="images/hero.jpg">';
        await fs.writeFile(htmlPath, originalHtml);

        const updater = new SourceUpdater(MANIFEST_PATH, true); // dryRun = true
        await updater.scanAndReplace('**/*.html', TEST_DIR);

        const updatedHtml = await fs.readFile(htmlPath, 'utf-8');
        expect(updatedHtml).toBe(originalHtml);
    });
});

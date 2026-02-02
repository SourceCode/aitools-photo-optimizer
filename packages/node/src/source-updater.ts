import fs from 'fs-extra';
import fg from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import { Manifest, ManifestEntry } from '@aitools-photo-optimizer/core';

export class SourceUpdater {
    private manifest: Manifest | null = null;
    private manifestPath: string;
    private dryRun: boolean;

    constructor(manifestPath: string, dryRun: boolean = false) {
        this.manifestPath = manifestPath;
        this.dryRun = dryRun;
    }

    async loadManifest(): Promise<void> {
        if (!await fs.pathExists(this.manifestPath)) {
            throw new Error(`Manifest not found at ${this.manifestPath}`);
        }
        this.manifest = await fs.readJSON(this.manifestPath);
    }

    async scanAndReplace(glob: string, cwd: string = process.cwd()): Promise<void> {
        if (!this.manifest) {
            await this.loadManifest();
        }

        const files = await fg(glob, { cwd, ignore: ['**/node_modules/**', '**/dist/**'] });
        console.log(chalk.blue(`Scanning ${files.length} files for image references...`));

        for (const file of files) {
            await this.processFile(path.resolve(cwd, file));
        }
    }

    async processFile(filePath: string): Promise<void> {
        let content = await fs.readFile(filePath, 'utf-8');
        let modified = false;

        if (!this.manifest) return;

        // Iterate over manifest entries to find matches
        for (const entry of Object.values(this.manifest.entries)) {
            // 1. Tag Replacement Strategy (HTML/JSX)
            // Look for <img src="inputPath" ... />
            const replacementResult = this.replaceTags(content, entry);
            if (replacementResult !== content) {
                content = replacementResult;
                modified = true;
            }

            // 2. String Replacement Strategy
            // Look for straight filepath references
            const stringReplacementResult = this.replaceReferences(content, entry);
            if (stringReplacementResult !== content) {
                content = stringReplacementResult;
                modified = true;
            }
        }

        if (modified) {
            console.log(chalk.green(`Updating references in ${path.relative(process.cwd(), filePath)}`));
            if (!this.dryRun) {
                await fs.writeFile(filePath, content, 'utf-8');
            }
        }
    }

    private replaceTags(content: string, entry: ManifestEntry): string {
        // Basic naive regex for img tags - can be improved with a proper parser if needed, 
        // but regex is often sufficient for this level of tool.
        // Captures: 1=before, 2=quote, 3=src, 4=after src
        const basename = path.basename(entry.inputPath);

        // Match src ending with the basename of the input file
        // This avoids issues with different relative paths
        // We match <img ... src="...basename" ...>
        const imgRegex = new RegExp(`(<img[^>]*src=["'])([^"']*${this.escapeRegExp(basename)})(["'][^>]*>)`, 'gi');

        return content.replace(imgRegex, (match, prefix, srcValue, suffix) => {
            // If it already has srcset, we might want to skip or update it. 
            // For now, let's assume we are upgrading a plain img tag.

            // Construct srcset
            // We want to use the WEBP or AVIF versions if available
            const sortedOutputs = entry.outputs.sort((a, b) => a.width - b.width);

            // Generate srcset for supported formats (e.g. webp)
            const webpOutputs = sortedOutputs.filter((o) => o.format === 'webp');
            const jpegOutputs = sortedOutputs.filter((o) => o.format === 'jpeg' || o.format === 'jpg');

            // If we have webp, we might want to change this to a <picture> tag or just add srcset if browser support is assumed.
            // Request asked for: "return to the code so the code loads the images correct for the content area and device."

            // Simple approach: Add srcset attribute to the img tag.
            // Note: src usually stays as the fallback (jpeg/png).

            const srcSetParts = webpOutputs.map((o) => `${o.path} ${o.width}w`);
            // If simply updating the path to the optimized version (e.g. same format but hashed/optimized)
            const fallback = jpegOutputs.length > 0 ? jpegOutputs[jpegOutputs.length - 1] : entry.outputs[0];
            const fallbackPath = fallback ? fallback.path : srcValue;

            if (srcSetParts.length > 0) {
                // Add srcset attribute
                // careful not to duplicate if it exists. 
                // Also Update src to fallback path
                if (!prefix.includes('srcset') && !suffix.includes('srcset')) {
                    return `${prefix}${fallbackPath}" srcset="${srcSetParts.join(', ')}${suffix}`;
                }
            }

            if (fallback) {
                // Replace the src with the optimized one
                return `${prefix}${fallback.path}${suffix}`;
            }

            return match;
        });
    }

    private replaceReferences(content: string, entry: ManifestEntry): string {
        const basename = path.basename(entry.inputPath);

        const bestOutput = entry.outputs[0];
        if (!bestOutput) return content;

        const optimizedPath = bestOutput.path;

        // Match ANY string literal that contains the input basename
        // If it looks like a path ending in basename, replace the WHOLE regex match with the NEW path

        // We match: quote + (optional chars ending in /) + basename + quote
        const regex = new RegExp(`(['"])([^'"]*/)?${this.escapeRegExp(basename)}(['"])`, 'g');

        return content.replace(regex, (_match, quote1, _pathPrefix, quote2) => {
            // We replace the entire content of the string with the optimizedPath
            // This assumes the optimizedPath (from manifest) is the desired reference (e.g. public relative)
            return `${quote1}${optimizedPath}${quote2}`;
        });
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

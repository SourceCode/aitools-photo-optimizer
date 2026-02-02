import path from 'path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import chalk from 'chalk';
import {
    createTransformPlan,
    DEFAULT_CONFIG,
    OptimizerConfig,
    ImageInputDescriptor,
    TransformJob,
    createEmptyManifest,
    ManifestEntry,
    validateConfig
} from '@aitools-photo-optimizer/core';
import { FileSystemAdapter } from '../storage/fs-adapter';
import { SharpAdapter } from '../codecs/sharp-adapter';
import { LocalQueue } from '../queue';
import { HeuristicClassifier } from '../classifier';

// Helper to load config
export async function loadConfig(cwd: string): Promise<OptimizerConfig> {
    const configPath = path.join(cwd, 'apo.config.json');
    if (await fs.pathExists(configPath)) {
        try {
            const userConfig = await fs.readJSON(configPath);
            // VALIDATION HERE
            const validated = validateConfig({ ...DEFAULT_CONFIG, ...userConfig });
            return validated;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            console.error(chalk.red('Failed to load/validate config:'), message);
            // Return default or exit? Returning default for resilience but warning hard.
            return DEFAULT_CONFIG;
        }
    }
    return DEFAULT_CONFIG;
}

export const buildAction = async (pattern: string, options: { out: string; clean: boolean; verbose: boolean; json?: boolean }) => {
    const cwd = process.cwd();
    if (!options.json) console.log('CLI CWD:', cwd);
    const config = await loadConfig(cwd); // Uses validation
    const outDir = path.resolve(cwd, options.out);
    const classifier = new HeuristicClassifier();
    const codecAdapter = new SharpAdapter();
    const fsAdapter = new FileSystemAdapter();
    const queue = new LocalQueue(4);

    if (options.clean) {
        if (!options.json) console.log(chalk.gray('Cleaning output directory...'));
        await fs.emptyDir(outDir);
    }

    if (!options.json) console.log(chalk.blue(`Scanning for images matching: ${pattern}`));
    const files = await fg(pattern, { cwd, ignore: ['**/node_modules/**', '**/dist/**', options.out] });
    if (!options.json) console.log(chalk.blue(`Found ${files.length} images.`));

    if (files.length === 0) return;

    queue.start();

    const manifest = createEmptyManifest();
    let completed = 0;
    let totalSavedBytes = 0;

    const tasks = files.map(async (file) => {
        return queue.add({
            id: file,
            data: null,
            execute: async () => {
                try {
                    const fullPath = path.resolve(cwd, file);
                    const buffer = await fsAdapter.read(file);
                    const meta = await codecAdapter.metadata(buffer);

                    const inputDescriptor: ImageInputDescriptor = {
                        path: file,
                        buffer: buffer,
                        stats: {
                            size: buffer.length,
                            mtime: (await fs.stat(fullPath)).mtime
                        }
                    };
                    inputDescriptor.classification = classifier.classify(inputDescriptor);
                    inputDescriptor.classification = await classifier.refineClassification(inputDescriptor, meta);

                    if (options.verbose && !options.json) {
                        console.log(chalk.gray(`[${file}] Classified as: ${inputDescriptor.classification}`));
                    }

                    const plan = createTransformPlan(inputDescriptor, config, { width: meta.width, height: meta.height });

                    const fileManifestEntry = {
                        inputPath: file,
                        contentHash: plan.id,
                        classification: inputDescriptor.classification,
                        outputs: [] as ManifestEntry['outputs']
                    };

                    const outputPromises = plan.outputs.map(async (transformJob: TransformJob) => {
                        const result = await codecAdapter.optimize(buffer, transformJob);
                        const outputPath = path.join(outDir, transformJob.outputName);

                        await fs.ensureDir(outDir);
                        await fs.writeFile(outputPath, result.buffer);

                        const saved = buffer.length - result.buffer.length;
                        if (saved > 0) totalSavedBytes += saved;

                        if (options.verbose && !options.json) {
                            let metricStr = '';
                            if (result.metrics) {
                                metricStr = ` (SSIM: ${result.metrics.ssim?.toFixed(2) || 'N/A'})`;
                            }
                            console.log(chalk.green(`Generated ${transformJob.outputName}${metricStr}`));
                        }

                        fileManifestEntry.outputs.push({
                            format: transformJob.format,
                            width: transformJob.width || 0,
                            height: transformJob.height || 0,
                            path: path.relative(cwd, outputPath),
                            size: result.buffer.length,
                            metrics: result.metrics
                        });
                    });

                    await Promise.all(outputPromises);
                    manifest.entries[file] = fileManifestEntry;
                    completed++;
                    if (!options.json) process.stdout.write(`\rProgress: ${completed}/${files.length}`);
                } catch (error) {
                    if (!options.json) {
                        console.error(chalk.red(`\nError processing ${file}:`), error);
                    }
                }
            }
        });
    });

    await Promise.all(tasks);

    if ('close' in codecAdapter) {
        (codecAdapter as unknown as { close: () => void }).close();
    }

    if (!options.json) console.log('\n');

    await fs.writeJSON(path.join(outDir, 'manifest.json'), manifest, { spaces: 2 });
    if (!options.json) {
        console.log(chalk.bold.green('Build complete! Manifest written to manifest.json'));
        console.log(chalk.gray(`Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`));
    } else {
        console.log(JSON.stringify({
            status: 'success',
            outDir,
            manifestPath: path.join(outDir, 'manifest.json'),
            totalFiles: files.length,
            totalSavedBytes,
            manifest
        }));
    }
};

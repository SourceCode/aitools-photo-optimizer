#!/usr/bin/env node
import { Command } from 'commander';
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
    ManifestEntry
} from '@aitools-photo-optimizer/core';
import { FileSystemAdapter } from './storage/fs-adapter';
import { SharpAdapter } from './codecs/sharp-adapter';
import { LocalQueue } from './queue';
import { HeuristicClassifier } from './classifier';
import { SourceUpdater } from './source-updater';

const program = new Command();
const fsAdapter = new FileSystemAdapter();
// codecAdapter moved to buildAction
const queue = new LocalQueue(4); // Default concurrency

async function loadConfig(cwd: string): Promise<OptimizerConfig> {
    const configPath = path.join(cwd, 'apo.config.json');
    if (await fs.pathExists(configPath)) {
        try {
            const userConfig = await fs.readJSON(configPath);
            return { ...DEFAULT_CONFIG, ...userConfig };
        } catch (e) {
            console.error(chalk.red('Failed to load config:'), e);
            return DEFAULT_CONFIG;
        }
    }
    return DEFAULT_CONFIG;
}

program
    .name('apo')
    .description('Adaptive Photo Optimizer CLI')
    .version('0.1.0');


const buildAction = async (pattern: string, options: { out: string; clean: boolean; verbose: boolean }) => {
    const cwd = process.cwd();
    console.log('CLI CWD:', cwd);
    const config = await loadConfig(cwd);
    const outDir = path.resolve(cwd, options.out);
    const classifier = new HeuristicClassifier();
    const codecAdapter = new SharpAdapter();

    if (options.clean) {
        console.log(chalk.gray('Cleaning output directory...'));
        await fs.emptyDir(outDir);
    }

    console.log(chalk.blue(`Scanning for images matching: ${pattern}`));
    const files = await fg(pattern, { cwd, ignore: ['**/node_modules/**', '**/dist/**', options.out] });
    console.log(chalk.blue(`Found ${files.length} images.`));

    // Determine tasks
    if (files.length === 0) return;

    queue.start();

    const manifest = createEmptyManifest();
    let completed = 0;
    let totalSavedBytes = 0;

    const tasks = files.map(async (file) => {
        // Queue the entire processing of a file to limit concurrency and memory usage
        return queue.add({
            id: file,
            data: null,
            execute: async () => {
                const fullPath = path.resolve(cwd, file);
                const buffer = await fsAdapter.read(file);

                // Get metadata for input
                const meta = await codecAdapter.metadata(buffer);

                // Classify
                const inputDescriptor: ImageInputDescriptor = {
                    path: file,
                    buffer: buffer,
                    stats: {
                        size: buffer.length,
                        mtime: (await fs.stat(fullPath)).mtime
                    }
                };
                inputDescriptor.classification = classifier.classify(inputDescriptor);
                // Refine with metadata
                inputDescriptor.classification = await classifier.refineClassification(inputDescriptor, meta);

                if (options.verbose) {
                    console.log(chalk.gray(`[${file}] Classified as: ${inputDescriptor.classification}`));
                }

                const plan = createTransformPlan(inputDescriptor, config, { width: meta.width, height: meta.height });

                const fileManifestEntry = {
                    inputPath: file,
                    contentHash: plan.id,
                    classification: inputDescriptor.classification,
                    outputs: [] as ManifestEntry['outputs']
                };

                // Execute plan outputs
                const outputPromises = plan.outputs.map(async (transformJob: TransformJob) => {
                    const result = await codecAdapter.optimize(buffer, transformJob);
                    const outputPath = path.join(outDir, transformJob.outputName);

                    await fs.ensureDir(outDir);
                    await fs.writeFile(outputPath, result.buffer);

                    const saved = buffer.length - result.buffer.length;
                    if (saved > 0) totalSavedBytes += saved;

                    if (options.verbose) {
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
                process.stdout.write(`\rProgress: ${completed}/${files.length}`);
            }
        });
    });

    await Promise.all(tasks);

    // Cleanup worker pool
    if ('close' in codecAdapter) {
        (codecAdapter as unknown as { close: () => void }).close();
    }

    console.log('\n'); // Newline after progress

    // Write manifest
    await fs.writeJSON(path.join(outDir, 'manifest.json'), manifest, { spaces: 2 });
    console.log(chalk.bold.green('Build complete! Manifest written to manifest.json'));
    console.log(chalk.gray(`Total space saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB`));
};

program
    .command('build')
    .description('Scan and optimize images')
    .argument('[glob]', 'Glob pattern for images', '**/*.{jpg,jpeg,png}')
    .option('-o, --out <dir>', 'Output directory', 'public/images/optimized')
    .option('-c, --clean', 'Clean output directory before build')
    .option('-v, --verbose', 'Verbose output')
    .action(buildAction);

const updateSourceAction = async (options: { manifest: string; source: string; dryRun?: boolean }) => {
    const cwd = process.cwd();
    const manifestPath = path.resolve(cwd, options.manifest);

    console.log(chalk.blue(`Loading manifest from: ${options.manifest}`));

    try {
        const updater = new SourceUpdater(manifestPath, options.dryRun);
        await updater.loadManifest();
        await updater.scanAndReplace(options.source, cwd);
        console.log(chalk.bold.green('Source update complete!'));
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(chalk.red('Error updating source:'), msg);
        process.exit(1);
    }
};

program
    .command('update-source')
    .description('Update source code references to use optimized images')
    .option('-m, --manifest <path>', 'Path to manifest.json', 'public/images/optimized/manifest.json')
    .option('-s, --source <glob>', 'Glob pattern for source files to update', 'src/**/*.{html,js,ts,jsx,tsx}')
    .option('--dry-run', 'Perform a dry run without modifying files')
    .action(updateSourceAction);

export function run() {
    program.parse();
}

// Only parse if executed directly
if (require.main === module) {
    run();
}

export { buildAction, loadConfig, updateSourceAction };


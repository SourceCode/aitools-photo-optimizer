#!/usr/bin/env node
import { Command } from 'commander';
import { buildAction } from './commands/build';
import { updateSourceAction } from './commands/update-source';

const program = new Command();

program
    .name('apo')
    .description('Adaptive Photo Optimizer CLI')
    .version('0.1.0');

program
    .command('build')
    .description('Scan and optimize images')
    .argument('[glob]', 'Glob pattern for images', '**/*.{jpg,jpeg,png}')
    .option('-o, --out <dir>', 'Output directory', 'public/images/optimized')
    .option('-c, --clean', 'Clean output directory before build')
    .option('-v, --verbose', 'Verbose output')
    .option('--json', 'Output results as JSON')
    .action(buildAction);

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

export { buildAction, updateSourceAction };

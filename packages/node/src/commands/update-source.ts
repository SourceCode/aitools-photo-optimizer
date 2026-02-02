import path from 'path';
import chalk from 'chalk';
import { SourceUpdater } from '../source-updater';

export const updateSourceAction = async (options: { manifest: string; source: string; dryRun?: boolean }) => {
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

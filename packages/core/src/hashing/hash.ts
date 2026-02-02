import crypto from 'crypto';
import { OptimizerConfig } from '../model/descriptors';

export function createContentHash(buffer: Buffer): string {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex').substring(0, 16);
}

export function createOptionsHash(options: OptimizerConfig): string {
    // Sort keys to ensure stability
    const stableString = JSON.stringify(options, Object.keys(options).sort());
    const hash = crypto.createHash('sha256');
    hash.update(stableString);
    return hash.digest('hex').substring(0, 8);
}

export function generateOutputName(contentHash: string, width: number, height: number, format: string, optionsHash: string): string {
    return `${contentHash}_${width}x${height}_${optionsHash}.${format}`;
}

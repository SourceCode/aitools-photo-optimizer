import { OptimizerConfig } from '../model/descriptors';
export declare function createContentHash(buffer: Buffer): string;
export declare function createOptionsHash(options: OptimizerConfig): string;
export declare function generateOutputName(contentHash: string, width: number, height: number, format: string, optionsHash: string): string;

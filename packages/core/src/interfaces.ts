import { ImageInputDescriptor, OptimizerConfig, QualityMetrics } from './model/descriptors';

/**
 * Represents a complete optimization plan for a single input file.
 * Contains the input descriptor and a list of jobs to execute.
 */
export interface TransformPlan {
    /** Unique hash based on input content */
    id: string;
    /** Descriptor of the source image */
    input: ImageInputDescriptor;
    /** List of optimization jobs to run */
    outputs: TransformJob[];
}

/**
 * A single atomic task to produce an optimized asset.
 */
export interface TransformJob {
    /** Discriminated union type for runtime introspection */
    kind: 'transform';
    /** Target width (if resizing) */
    width?: number;
    /** Target height (if resizing) */
    height?: number;
    /** Target format */
    format: 'avif' | 'webp' | 'jpeg' | 'png';
    /** Format-specific options */
    options: OptimizerConfig;
    /** Generated filename */
    outputName: string;
    /** Quality gates to enforce */
    metricThresholds?: QualityMetrics;
}

/**
 * Adapter interface for file system operations.
 * Decouples core logic from Node.js fs module.
 */
export interface StorageAdapter {
    read(path: string): Promise<Buffer>;
    write(path: string, data: Buffer): Promise<void>;
    exists(path: string): Promise<boolean>;
    delete(path: string): Promise<void>;
}

/**
 * Adapter interface for image processing.
 * Decouples core logic from Sharp or other libraries.
 */
export interface CodecAdapter {
    optimize(input: Buffer, job: TransformJob): Promise<{ buffer: Buffer; info: unknown; metrics?: QualityMetrics }>;
    metadata(input: Buffer): Promise<{ width: number; height: number; format: string }>;
}

export interface Logger {
    info(msg: string, ...args: unknown[]): void;
    warn(msg: string, ...args: unknown[]): void;
    error(msg: string, ...args: unknown[]): void;
    debug(msg: string, ...args: unknown[]): void;
}

export interface QueueJob<T> {
    id: string;
    data: T;
    execute: () => Promise<void>;
}

export interface Queue {
    add<T>(job: QueueJob<T>): Promise<void>;
    start(): void;
    stop(): void;
}

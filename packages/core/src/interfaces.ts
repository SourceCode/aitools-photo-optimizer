import { ImageInputDescriptor, OptimizerConfig, QualityMetrics } from './model/descriptors';

export interface TransformPlan {
    id: string; // Unique hash
    input: ImageInputDescriptor;
    outputs: TransformJob[];
}

export interface TransformJob {
    width?: number;
    height?: number;
    format: 'avif' | 'webp' | 'jpeg' | 'png';
    options: OptimizerConfig;
    outputName: string;
    metricThresholds?: QualityMetrics;
}

export interface StorageAdapter {
    read(path: string): Promise<Buffer>;
    write(path: string, data: Buffer): Promise<void>;
    exists(path: string): Promise<boolean>;
    delete(path: string): Promise<void>;
}

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

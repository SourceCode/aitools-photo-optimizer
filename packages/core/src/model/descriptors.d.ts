export type ImageClassification = 'photo' | 'screenshot' | 'vector' | 'icon' | 'text' | 'unknown';
export interface ImageInputDescriptor {
    path: string;
    buffer?: Buffer;
    stats?: {
        size: number;
        mtime: Date;
    };
    classification?: ImageClassification;
}
export interface ContainerDescriptor {
    width?: number;
    height?: number;
    layout?: 'fixed' | 'responsive' | 'fill';
}
export interface QualityMetrics {
    ssim?: number;
    psnr?: number;
    butteraugli?: number;
}
export interface OptimizationPreset {
    name: string;
    quality?: number;
    effort?: number;
    lossless?: boolean;
    formats?: ('avif' | 'webp' | 'jpeg' | 'png')[];
    avif?: OptimizerConfig['avif'];
    webp?: OptimizerConfig['webp'];
}
export interface OptimizerConfig {
    quality: number;
    lossless: boolean;
    stripMetadata: boolean;
    maxFileSizeBytes?: number;
    effort: number;
    formats: ('avif' | 'webp' | 'jpeg' | 'png')[];
    avif?: {
        quality?: number;
        effort?: number;
        lossless?: boolean;
    };
    webp?: {
        quality?: number;
        effort?: number;
        lossless?: boolean;
        nearLossless?: boolean;
    };
    presets?: {
        [key in ImageClassification]?: string;
    };
    definedPresets?: Record<string, OptimizationPreset>;
    qualityGates?: {
        [key in ImageClassification]?: QualityMetrics;
    };
}
export declare const DEFAULT_CONFIG: OptimizerConfig;

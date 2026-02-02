export type ImageClassification = 'photo' | 'screenshot' | 'vector' | 'icon' | 'text' | 'unknown';

export interface ImageInputDescriptor {
    path: string;
    buffer?: Buffer; // Optional for in-memory
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
        [key in ImageClassification]?: string; // Map classification to preset name
    };
    definedPresets?: Record<string, OptimizationPreset>; // Define available presets
    qualityGates?: {
        [key in ImageClassification]?: QualityMetrics; // Minimum thresholds
    };
}

export const DEFAULT_CONFIG: OptimizerConfig = {
    quality: 80,
    lossless: false,
    stripMetadata: true,
    effort: 4,
    formats: ['avif', 'webp'],
    presets: {
        'photo': 'web-2025-balanced',
        'screenshot': 'ui-assets-crisp',
        'vector': 'ui-assets-crisp',
        'icon': 'ui-assets-crisp',
        'text': 'ui-assets-crisp',
    },
    definedPresets: {
        'web-2025-balanced': {
            name: 'web-2025-balanced',
            quality: 80,
            effort: 4,
            formats: ['avif', 'webp']
        },
        'ui-assets-crisp': {
            name: 'ui-assets-crisp',
            lossless: false,
            // For screenshots/text, we often want higher quality or near-lossless
            webp: { nearLossless: true, quality: 90 },
            avif: { quality: 90 }
        }
    },
    qualityGates: {
        'photo': { ssim: 0.95 },
        'screenshot': { ssim: 0.99 }
    }
};

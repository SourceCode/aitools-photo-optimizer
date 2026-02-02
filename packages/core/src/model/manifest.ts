import { QualityMetrics, ImageClassification } from './descriptors';

export interface ManifestEntry {
    inputPath: string;
    contentHash: string;
    classification?: ImageClassification; // Optional or required depending on version
    outputs: {
        format: string;
        width: number;
        height: number;
        path: string;
        size: number;
        metrics?: QualityMetrics;
    }[];
}

export interface Manifest {
    version: number;
    generatedAt: string;
    entries: Record<string, ManifestEntry>; // Keyed by inputPath or contentHash
}

export function createEmptyManifest(): Manifest {
    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        entries: {},
    };
}

export function mergeManifests(base: Manifest, update: Manifest): Manifest {
    return {
        ...base,
        generatedAt: new Date().toISOString(), // Update timestamp
        entries: {
            ...base.entries,
            ...update.entries,
        },
    };
}

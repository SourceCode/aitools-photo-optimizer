export interface ManifestEntry {
    inputPath: string;
    contentHash: string;
    outputs: {
        format: string;
        width: number;
        height: number;
        path: string;
        size: number;
    }[];
}
export interface Manifest {
    version: number;
    generatedAt: string;
    entries: Record<string, ManifestEntry>;
}
export declare function createEmptyManifest(): Manifest;
export declare function mergeManifests(base: Manifest, update: Manifest): Manifest;

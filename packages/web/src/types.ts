export interface WebManifestEntry {
    inputPath: string;
    outputs: {
        format: string;
        path: string;
    }[];
}

export interface WebManifest {
    entries: Record<string, WebManifestEntry>;
}

export type ResolveFn = (src: string, width?: number, format?: string) => string | undefined;

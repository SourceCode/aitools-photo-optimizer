import { describe, it, expect } from 'vitest';
import { createEmptyManifest, mergeManifests, Manifest } from '../src/model/manifest';

describe('Manifest Utils', () => {
    it('createEmptyManifest should return a default structure', () => {
        const manifest = createEmptyManifest();
        expect(manifest.version).toBe(1);
        expect(manifest.entries).toEqual({});
        expect(manifest.generatedAt).toBeDefined();
    });

    it('mergeManifests should combine entries', () => {
        const base: Manifest = {
            version: 1,
            generatedAt: 'old-date',
            entries: {
                'a.jpg': { inputPath: 'a.jpg', contentHash: '123', outputs: [] }
            }
        };

        const update: Manifest = {
            version: 1,
            generatedAt: 'new-date',
            entries: {
                'b.jpg': { inputPath: 'b.jpg', contentHash: '456', outputs: [] }
            }
        };

        const merged = mergeManifests(base, update);

        expect(Object.keys(merged.entries)).toHaveLength(2);
        expect(merged.entries['a.jpg']).toBeDefined();
        expect(merged.entries['b.jpg']).toBeDefined();
        // generatedAt should be updated (newer than old-date, effectively new Date())
        expect(merged.generatedAt).not.toBe('old-date');
    });

    it('mergeManifests should overwrite existing entries', () => {
        const base: Manifest = {
            version: 1,
            generatedAt: 'old-date',
            entries: {
                'a.jpg': { inputPath: 'a.jpg', contentHash: '123', outputs: [] }
            }
        };

        const update: Manifest = {
            version: 1,
            generatedAt: 'new-date',
            entries: {
                'a.jpg': { inputPath: 'a.jpg', contentHash: '999', outputs: [] } // Updated content
            }
        };

        const merged = mergeManifests(base, update);

        expect(Object.keys(merged.entries)).toHaveLength(1);
        expect(merged.entries['a.jpg'].contentHash).toBe('999');
    });
});

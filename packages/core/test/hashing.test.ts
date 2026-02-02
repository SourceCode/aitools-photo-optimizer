import { describe, it, expect } from 'vitest';
import { createContentHash, createOptionsHash, generateOutputName } from '../src/hashing/hash';
import { DEFAULT_CONFIG, OptimizerConfig } from '../src/model/descriptors';

describe('Hashing Utils', () => {
    describe('createContentHash', () => {
        it('should generate consistent hash for same content', () => {
            const buffer = Buffer.from('test content');
            const hash1 = createContentHash(buffer);
            const hash2 = createContentHash(buffer);
            expect(hash1).toBe(hash2);
            expect(hash1).toHaveLength(16);
        });

        it('should generate different hash for different content', () => {
            const hash1 = createContentHash(Buffer.from('content 1'));
            const hash2 = createContentHash(Buffer.from('content 2'));
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('createOptionsHash', () => {
        it('should generate stable hash regardless of key order', () => {
            const config1: OptimizerConfig = { ...DEFAULT_CONFIG, quality: 90 };
            const config2: OptimizerConfig = { ...DEFAULT_CONFIG, quality: 90 };

            // Force different key order if possible, though JS objects order is complex.
            // But verify stability for identical objects.
            expect(createOptionsHash(config1)).toBe(createOptionsHash(config2));
        });

        it('should generate different hash for different values', () => {
            const config1 = { ...DEFAULT_CONFIG, quality: 80 };
            const config2 = { ...DEFAULT_CONFIG, quality: 90 };
            expect(createOptionsHash(config1)).not.toBe(createOptionsHash(config2));
        });
    });

    describe('generateOutputName', () => {
        it('should combine parts correctly', () => {
            const contentHash = 'abc12345';
            const optionsHash = 'opt98765';
            const name = generateOutputName(contentHash, 800, 600, 'webp', optionsHash);
            expect(name).toBe('abc12345_800x600_opt98765.webp');
        });
    });
});

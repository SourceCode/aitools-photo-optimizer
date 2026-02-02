import { describe, it, expect } from 'vitest';
import { HeuristicClassifier } from '../src/classifier';
import { ImageInputDescriptor } from '@aitools-photo-optimizer/core';

describe('HeuristicClassifier', () => {
    const classifier = new HeuristicClassifier();

    it('should classify based on extension', () => {
        expect(classifier.classify({ path: 'image.jpg' } as unknown as ImageInputDescriptor)).toBe('photo');
        expect(classifier.classify({ path: 'image.jpeg' } as unknown as ImageInputDescriptor)).toBe('photo');
        expect(classifier.classify({ path: 'image.png' } as unknown as ImageInputDescriptor)).toBe('unknown'); // Logic defaults PNG to unknown unless refined
        expect(classifier.classify({ path: 'image.svg' } as unknown as ImageInputDescriptor)).toBe('vector');
        expect(classifier.classify({ path: 'doc.txt' } as unknown as ImageInputDescriptor)).toBe('text');
        expect(classifier.classify({ path: 'readme.md' } as unknown as ImageInputDescriptor)).toBe('text');
        expect(classifier.classify({ path: 'random.xyz' } as unknown as ImageInputDescriptor)).toBe('unknown');

        // Cover input.buffer branch (even if empty)
        expect(classifier.classify({ path: 'image.jpg', buffer: Buffer.from([]) } as unknown as ImageInputDescriptor)).toBe('photo');
    });

    it('should classify screenshot based on keyword in path', () => {
        expect(classifier.classify({ path: 'screenshot_1.png' } as unknown as ImageInputDescriptor)).toBe('screenshot');
    });

    it('should refine classification based on metadata', async () => {
        const input: ImageInputDescriptor = { path: 'test.png' };

        // Large PNG -> Screenshot
        const cls1 = await classifier.refineClassification(input, { width: 1000, height: 800, format: 'png' });
        expect(cls1).toBe('screenshot');

        // Small PNG -> Icon
        const cls2 = await classifier.refineClassification(input, { width: 64, height: 64, format: 'png' });
        expect(cls2).toBe('icon');

        // JPEG -> Photo
        const cls3 = await classifier.refineClassification(input, { width: 1000, height: 1000, format: 'jpeg' });
        expect(cls3).toBe('photo');

        // Mid-sized PNG -> Fallback (should match input classification or unknown)
        const cls4 = await classifier.refineClassification({ path: 'test.png', classification: 'photo' }, { width: 500, height: 500, format: 'png' });
        expect(cls4).toBe('photo');

        const cls5 = await classifier.refineClassification({ path: 'test.png' }, { width: 500, height: 500, format: 'png' });
        expect(cls5).toBe('unknown');
    });
});

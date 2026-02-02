import { describe, it, expect } from 'vitest';
import { HeuristicClassifier } from '../src/classifier';
import { ImageInputDescriptor } from '@aitools-photo-optimizer/core';

describe('HeuristicClassifier', () => {
    const classifier = new HeuristicClassifier();

    it('should classify based on extension', () => {
        expect(classifier.classify({ path: 'image.jpg' } as any)).toBe('photo');
        expect(classifier.classify({ path: 'image.jpeg' } as any)).toBe('photo');
        expect(classifier.classify({ path: 'image.png' } as any)).toBe('unknown'); // Logic defaults PNG to unknown unless refined
        expect(classifier.classify({ path: 'image.svg' } as any)).toBe('vector');
    });

    it('should classify screenshot based on keyword in path', () => {
        expect(classifier.classify({ path: 'screenshot_1.png' } as any)).toBe('screenshot');
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
    });
});

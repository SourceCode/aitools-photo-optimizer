import { ImageClassification, ImageInputDescriptor } from '@aitools-photo-optimizer/core';
import path from 'path';

export class HeuristicClassifier {
    classify(input: ImageInputDescriptor): ImageClassification {
        const ext = path.extname(input.path).toLowerCase();

        // Basic extension-based defaults
        if (ext === '.svg') return 'vector';

        // Analyze buffer if available
        if (input.buffer) {
            // If we had access to metadata here (dimensions, channels), we could do better.
            // For now, let's use file size logic somewhat?
            // Or just stick to extension mapping as a baseline.
        }

        if (ext === '.png') {
            // Check for potential screenshots (often larger dimensions, defined edges)
            // Or icons (small dimensions)
            // Without decoding, we guess 'unknown' or 'screenshot' based on context?
            // Let's default PNG to 'screenshot' as they are often UI elements.
            // But photos can be PNG too. 
            // Let's assume 'photo' checks might happen if we peek bytes?

            // For this iteration, let's be simple:
            if (input.path.includes('screenshot') || input.path.includes('screen')) return 'screenshot';
            if (input.path.includes('icon') || input.path.includes('logo')) return 'icon';
            return 'unknown'; // Fallback
        }

        if (['.jpg', '.jpeg', '.heic', '.avif', '.webp'].includes(ext)) {
            return 'photo';
        }

        if (['.txt', '.md'].includes(ext)) return 'text'; // Unlikely for image tool but...

        return 'unknown';
    }

    async refineClassification(_input: ImageInputDescriptor, metadata: { width: number; height: number; format: string }): Promise<ImageClassification> {
        // Refined logic with metadata
        if (metadata.format === 'svg') return 'vector';

        // Small square-ish images are likely icons
        if (metadata.width <= 256 && metadata.height <= 256) {
            if (metadata.format === 'png') return 'icon';
        }

        // Screenshots often match screen resolutions or have high contrast (hard to tell without pixel data)
        // But if it was a PNG and large, likely screenshot or diagram.
        if (metadata.format === 'png' && metadata.width > 800) {
            return 'screenshot';
        }

        if (['jpeg', 'jpg', 'heif'].includes(metadata.format)) {
            return 'photo';
        }

        return _input.classification || 'unknown';
    }
}

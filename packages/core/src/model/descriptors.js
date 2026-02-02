"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
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
    }
};

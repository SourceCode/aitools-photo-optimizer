"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransformPlan = createTransformPlan;
const descriptors_1 = require("../model/descriptors");
const hash_1 = require("../hashing/hash");
function createTransformPlan(input, config = descriptors_1.DEFAULT_CONFIG, container) {
    if (!input.buffer) {
        throw new Error("Input buffer is required for planning to generate hash");
    }
    const contentHash = (0, hash_1.createContentHash)(input.buffer);
    const jobs = [];
    // Determine target dimensions
    // If container is provided, utilize it. For now, we'll keep it simple: 
    // If no container, keep original size (undefined width/height means original)
    // If container, we might want to generate multiple sizes (srcset) - implementing basic 1:1 for now
    const targetWidth = container?.width;
    const targetHeight = container?.height;
    // Determine base config based on classification
    let baseConfig = { ...config };
    if (input.classification && config.presets && config.presets[input.classification]) {
        const presetName = config.presets[input.classification];
        if (config.definedPresets && config.definedPresets[presetName]) {
            const preset = config.definedPresets[presetName];
            // Merge preset into baseConfig. 
            // Note: This is a shallow merge for top-level and deep for specific formats if needed.
            // For simplicity, we override keys that exist in preset.
            baseConfig = { ...baseConfig, ...preset };
        }
    }
    // Determine quality thresholds
    const qualityThresholds = input.classification && config.qualityGates
        ? config.qualityGates[input.classification]
        : undefined;
    for (const format of baseConfig.formats) {
        // Merge global config with specific format overrides
        let specificConfig = { ...baseConfig };
        // Apply format-specific overrides from the base config (which might be the preset)
        if (format === 'avif' && baseConfig.avif) {
            specificConfig = { ...specificConfig, ...baseConfig.avif };
        }
        if (format === 'webp' && baseConfig.webp) {
            specificConfig = { ...specificConfig, ...baseConfig.webp };
        }
        const optionsHash = (0, hash_1.createOptionsHash)(specificConfig);
        const job = {
            width: targetWidth,
            height: targetHeight,
            format,
            options: specificConfig,
            outputName: (0, hash_1.generateOutputName)(contentHash, targetWidth || 0, targetHeight || 0, format, optionsHash),
            metricThresholds: qualityThresholds
        };
        jobs.push(job);
    }
    return {
        id: contentHash,
        input,
        outputs: jobs,
    };
}

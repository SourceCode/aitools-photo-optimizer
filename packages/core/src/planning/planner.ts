import { OptimizerConfig, ImageInputDescriptor, ContainerDescriptor, DEFAULT_CONFIG } from '../model/descriptors';
import { TransformPlan, TransformJob } from '../interfaces';
import { createContentHash, createOptionsHash, generateOutputName } from '../hashing/hash';

export function createTransformPlan(
    input: ImageInputDescriptor,
    config: OptimizerConfig = DEFAULT_CONFIG,
    container?: ContainerDescriptor
): TransformPlan {
    if (!input.buffer) {
        throw new Error("Input buffer is required for planning to generate hash");
    }

    const contentHash = createContentHash(input.buffer);
    const jobs: TransformJob[] = [];

    // Determine target dimensions
    // If container is provided, utilize it. For now, we'll keep it simple: 
    // If no container, keep original size (undefined width/height means original)
    // If container, we might want to generate multiple sizes (srcset) - implementing basic 1:1 for now

    const targetWidth = container?.width;
    const targetHeight = container?.height;

    // Determine base config based on classification
    let baseConfig = { ...config };
    if (input.classification && config.presets) {
        const presetName = config.presets[input.classification];
        if (presetName && config.definedPresets) {
            const preset = config.definedPresets[presetName];
            if (preset) {
                // Merge preset into baseConfig. 
                // Note: This is a shallow merge for top-level and deep for specific formats if needed.
                // For simplicity, we override keys that exist in preset.
                baseConfig = { ...baseConfig, ...preset };
            }
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

        const optionsHash = createOptionsHash(specificConfig);

        const job: TransformJob = {
            kind: 'transform',
            width: targetWidth,
            height: targetHeight,
            format,
            options: specificConfig,
            outputName: generateOutputName(contentHash, targetWidth || 0, targetHeight || 0, format, optionsHash),
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

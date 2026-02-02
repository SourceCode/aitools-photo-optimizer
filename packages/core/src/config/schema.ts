import { z } from 'zod';

export const ImageFormatSchema = z.enum(['avif', 'webp', 'jpeg', 'png']);

export const QualityMetricsSchema = z.object({
    ssim: z.number().optional(),
    psnr: z.number().optional()
});

export const FormatConfigSchema = z.object({
    quality: z.number().min(0).max(100).optional(),
    effort: z.number().min(0).max(9).optional(),
    lossless: z.boolean().optional(),
    nearLossless: z.boolean().optional()
});

export const BaseConfigSchema = z.object({
    quality: z.number().min(0).max(100).default(80),
    lossless: z.boolean().default(false),
    stripMetadata: z.boolean().default(true),
    effort: z.number().min(0).max(9).default(4),
    formats: z.array(ImageFormatSchema).default(['avif', 'webp']),
    maxFileSizeBytes: z.number().optional(),
    avif: FormatConfigSchema.optional(),
    webp: FormatConfigSchema.optional()
});

export const OptimizationPresetSchema = BaseConfigSchema.extend({
    name: z.string(),
    quality: z.number().min(0).max(100).optional(),
    lossless: z.boolean().optional(),
    stripMetadata: z.boolean().optional(),
    effort: z.number().min(0).max(9).optional(),
    formats: z.array(ImageFormatSchema).optional()
});

export const OptimizerConfigSchema = BaseConfigSchema.extend({
    presets: z.record(z.string(), z.string()).optional(),
    definedPresets: z.record(z.string(), OptimizationPresetSchema).optional(),
    qualityGates: z.record(z.string(), QualityMetricsSchema).optional()
});

export type OptimizerConfigParsed = z.infer<typeof OptimizerConfigSchema>;

export function validateConfig(config: unknown): OptimizerConfigParsed {
    try {
        return OptimizerConfigSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Configuration Error: ${error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        throw error;
    }
}

import { describe, it, expect } from 'vitest';
import { createTransformPlan } from '../src/planning/planner';
import { DEFAULT_CONFIG } from '../src/model/descriptors';

describe('Planner', () => {
    const mockBuffer = Buffer.from('fake-image-content');
    const baseInput = {
        path: '/tmp/test.jpg',
        buffer: mockBuffer,
        stats: { size: 1024, mtime: new Date() }
    };

    it('should throw if input buffer is missing', () => {
        expect(() => createTransformPlan({ ...baseInput, buffer: undefined }))
            .toThrow('Input buffer is required');
    });

    it('should generate jobs for default formats', () => {
        const plan = createTransformPlan(baseInput);
        expect(plan.input).toBe(baseInput);
        expect(plan.outputs).toHaveLength(DEFAULT_CONFIG.formats.length);

        const formats = plan.outputs.map(j => j.format);
        expect(formats).toContain('avif');
        expect(formats).toContain('webp');
    });

    it('should apply presets based on classification', () => {
        const input = { ...baseInput, classification: 'screenshot' as const };
        // DEFAULT_CONFIG maps 'screenshot' to 'ui-assets-crisp' which has nearLossless webp
        const plan = createTransformPlan(input);

        const webpJob = plan.outputs.find(j => j.format === 'webp');
        expect(webpJob).toBeDefined();
        // Check if preset overrides were applied
        // 'ui-assets-crisp' sets webp.nearLossless = true
        // The planner merges webp options into the top level for the job specific config if I recall check logic:
        // specificConfig = { ...specificConfig, ...baseConfig.webp };
        // But specificConfig is typed as OptimizerConfig which doesn't have nearLossless on top level.
        expect(((webpJob?.options as unknown) as { nearLossless: boolean }).nearLossless).toBe(true);
    });

    it('should respect container dimensions', () => {
        const container = { width: 100, height: 100 };
        const plan = createTransformPlan(baseInput, DEFAULT_CONFIG, container);

        plan.outputs.forEach(job => {
            expect(job.width).toBe(100);
            expect(job.height).toBe(100);
            expect(job.outputName).toContain('_100x100_');
        });
    });

    it('should merge specific format configs', () => {
        const config = {
            ...DEFAULT_CONFIG,
            webp: { quality: 50 },
            avif: { quality: 60 }
        };
        const plan = createTransformPlan(baseInput, config);

        const webp = plan.outputs.find(j => j.format === 'webp');
        const avif = plan.outputs.find(j => j.format === 'avif');

        expect(webp?.options.quality).toBe(50);
        expect(avif?.options.quality).toBe(60);
    });
});

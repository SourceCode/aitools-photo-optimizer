import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildAction, loadConfig } from '../src/cli';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { LocalQueue } from '../src/queue';
import { FileSystemAdapter } from '../src/storage/fs-adapter';
import { SharpAdapter } from '../src/codecs/sharp-adapter';
import { HeuristicClassifier } from '../src/classifier';

// Mocks
const {
    mockQueueAdd,
    mockQueueStart,
    mockFsRead,
    mockCodecMetadata,
    mockCodecOptimize,
    mockClassify,
    mockRefine
} = vi.hoisted(() => ({
    mockQueueAdd: vi.fn(),
    mockQueueStart: vi.fn(),
    mockFsRead: vi.fn(),
    mockCodecMetadata: vi.fn(),
    mockCodecOptimize: vi.fn(),
    mockClassify: vi.fn(),
    mockRefine: vi.fn()
}));

vi.mock('fast-glob');
vi.mock('fs-extra');
vi.mock('../src/queue', () => {
    return {
        LocalQueue: vi.fn(function () {
            return {
                add: mockQueueAdd.mockImplementation(async (job) => {
                    await job.execute(); // Run immediately for test
                }),
                start: mockQueueStart
            };
        })
    };
});
vi.mock('../src/storage/fs-adapter', () => ({
    FileSystemAdapter: vi.fn(function () {
        return { read: mockFsRead };
    })
}));
vi.mock('../src/codecs/sharp-adapter', () => ({
    SharpAdapter: vi.fn(function () {
        return {
            metadata: mockCodecMetadata,
            optimize: mockCodecOptimize,
            close: vi.fn()
        };
    })
}));
vi.mock('../src/classifier');
vi.mock('@aitools-photo-optimizer/core', async () => {
    const actual = await vi.importActual('@aitools-photo-optimizer/core');
    return {
        ...actual,
        createTransformPlan: vi.fn(),
        createEmptyManifest: () => ({ entries: {} })
    };
});
import { createTransformPlan } from '@aitools-photo-optimizer/core';

describe('CLI', () => {
    describe('loadConfig', () => {
        it('should load config if exists', async () => {
            (fs.pathExists as any).mockResolvedValue(true);
            (fs.readJSON as any).mockResolvedValue({ quality: 50 });

            const config = await loadConfig('/tmp');
            expect(config.quality).toBe(50);
        });

        it('should return default config if not exists', async () => {
            (fs.pathExists as any).mockResolvedValue(false);
            const config = await loadConfig('/tmp');
            expect(config.quality).toBe(80); // Default
        });
    });

    describe('buildAction', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (fg as any).mockResolvedValue(['img.jpg']);
            // LocalQueue mock is handled in factory to catch module-level instantiation

            // Adapters are mocked in factory to handle top-level instantiation
            (HeuristicClassifier as any).mockImplementation(function () {
                return {
                    classify: mockClassify,
                    refineClassification: mockRefine
                };
            });
            (fs.stat as any).mockResolvedValue({ mtime: new Date() });
            (createTransformPlan as any).mockReturnValue({
                id: 'hash',
                outputs: [{
                    format: 'webp',
                    outputName: 'img_hash.webp',
                    width: 100,
                    height: 100
                }]
            });
        });

        it('should run build process', async () => {
            mockFsRead.mockResolvedValue(Buffer.from('img'));
            mockCodecMetadata.mockResolvedValue({ width: 100, height: 100, format: 'jpg' });
            mockClassify.mockReturnValue('photo');
            mockRefine.mockResolvedValue('photo');
            mockCodecOptimize.mockResolvedValue({
                buffer: Buffer.from('opt'),
                metrics: { ssim: 0.99 }
            });

            await buildAction('**/*.jpg', { out: 'dist', verbose: true });

            expect(fg).toHaveBeenCalled();
            expect(mockQueueStart).toHaveBeenCalled();
            expect(mockQueueAdd).toHaveBeenCalled();
            expect(mockFsRead).toHaveBeenCalled();
            expect(createTransformPlan).toHaveBeenCalled();
            expect(mockCodecOptimize).toHaveBeenCalled();
            expect(fs.writeJSON).toHaveBeenCalledWith(
                expect.stringContaining('manifest.json'),
                expect.objectContaining({ entries: expect.anything() }),
                expect.anything()
            );
        });

        it('should clean output directory if requested', async () => {
            (fg as any).mockResolvedValue([]);
            await buildAction('**/*.jpg', { out: 'dist', clean: true });
            expect(fs.emptyDir).toHaveBeenCalledWith(expect.stringContaining('dist'));
        });
    });
});

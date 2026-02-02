import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { buildAction, loadConfig, updateSourceAction } from '../src/cli';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { HeuristicClassifier } from '../src/classifier';
import { createTransformPlan } from '@aitools-photo-optimizer/core';
import { SourceUpdater } from '../src/source-updater';

// Mocks
const {
    mockQueueAdd,
    mockQueueStart,
    mockFsRead,
    mockCodecMetadata,
    mockCodecOptimize,
    mockClassify,
    mockRefine,
    mockLoadManifest,
    mockScanAndReplace
} = vi.hoisted(() => ({
    mockQueueAdd: vi.fn(),
    mockQueueStart: vi.fn(),
    mockFsRead: vi.fn(),
    mockCodecMetadata: vi.fn(),
    mockCodecOptimize: vi.fn(),
    mockClassify: vi.fn(),
    mockRefine: vi.fn(),
    mockLoadManifest: vi.fn(),
    mockScanAndReplace: vi.fn()
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
vi.mock('../src/source-updater', () => ({
    SourceUpdater: vi.fn(function () {
        return {
            loadManifest: mockLoadManifest,
            scanAndReplace: mockScanAndReplace
        };
    })
}));

describe('CLI', () => {
    describe('loadConfig', () => {
        it('should load config if exists', async () => {
            (fs.pathExists as unknown as Mock).mockResolvedValue(true);
            (fs.readJSON as unknown as Mock).mockResolvedValue({ quality: 50 });

            const config = await loadConfig('/tmp');
            expect(config.quality).toBe(50);
        });

        it('should return default config if not exists', async () => {
            (fs.pathExists as unknown as Mock).mockResolvedValue(false);
            const config = await loadConfig('/tmp');
            expect(config.quality).toBe(80); // Default
        });
    });

    describe('buildAction', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            (fg as unknown as Mock).mockResolvedValue(['img.jpg']);
            // LocalQueue mock is handled in factory to catch module-level instantiation

            // Adapters are mocked in factory to handle top-level instantiation
            (HeuristicClassifier as unknown as Mock).mockImplementation(function () {
                return {
                    classify: mockClassify,
                    refineClassification: mockRefine
                };
            });
            (fs.stat as unknown as Mock).mockResolvedValue({ mtime: new Date() });
            (createTransformPlan as unknown as Mock).mockReturnValue({
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

            await buildAction('**/*.jpg', { out: 'dist', clean: false, verbose: true });

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
            (fg as unknown as Mock).mockResolvedValue([]);
            await buildAction('**/*.jpg', { out: 'dist', clean: true, verbose: false });
            expect(fs.emptyDir).toHaveBeenCalledWith(expect.stringContaining('dist'));
        });
    });

    describe('updateSourceAction', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should update source files', async () => {
            await updateSourceAction({ manifest: 'manifest.json', source: '**/*.html', dryRun: false });

            expect(SourceUpdater).toHaveBeenCalledWith(expect.stringContaining('manifest.json'), false);
            expect(mockLoadManifest).toHaveBeenCalled();
            expect(mockScanAndReplace).toHaveBeenCalledWith('**/*.html', expect.any(String));
        });

        it('should handle errors', async () => {
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => { }) as any);
            mockLoadManifest.mockRejectedValue(new Error('Failed'));

            await updateSourceAction({ manifest: 'manifest.json', source: '**/*.html' });

            expect(exitSpy).toHaveBeenCalledWith(1);
            exitSpy.mockRestore();
        });
    });
});

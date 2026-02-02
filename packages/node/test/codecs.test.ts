import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SharpAdapter } from '../src/codecs/sharp-adapter';

const { mockRun, mockStart, mockClose } = vi.hoisted(() => ({
    mockRun: vi.fn(),
    mockStart: vi.fn(),
    mockClose: vi.fn()
}));

vi.mock('../src/worker-pool', () => {
    return {
        WorkerPool: vi.fn(function () {
            return {
                run: mockRun,
                start: mockStart,
                close: mockClose
            };
        })
    };
});

describe('SharpAdapter', () => {
    let adapter: SharpAdapter;

    beforeEach(() => {
        vi.clearAllMocks();
        adapter = new SharpAdapter();
    });

    it('should initialize worker pool', () => {
        expect(mockStart).toHaveBeenCalled();
    });

    it('should offload optimize to worker', async () => {
        const input = Buffer.from('input');
        const job: any = { format: 'webp' };
        mockRun.mockResolvedValue({ buffer: Buffer.from('optimized') });

        const result = await adapter.optimize(input, job);

        expect(mockRun).toHaveBeenCalledWith({
            type: 'optimize',
            input,
            job
        });
        expect(result).toEqual({ buffer: Buffer.from('optimized') });
    });

    it('should offload metadata to worker', async () => {
        const input = Buffer.from('input');
        mockRun.mockResolvedValue({ width: 100, height: 100, format: 'png' });

        const result = await adapter.metadata(input);

        expect(mockRun).toHaveBeenCalledWith({
            type: 'metadata',
            input
        });
        expect(result).toEqual({ width: 100, height: 100, format: 'png' });
    });

    it('should close pool', () => {
        adapter.close();
        expect(mockClose).toHaveBeenCalled();
    });
});

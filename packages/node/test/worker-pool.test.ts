import { describe, it, expect, vi } from 'vitest';
import { WorkerPool } from '../src/worker-pool';

// Mock worker_threads
vi.mock('worker_threads', () => {
    return {
        Worker: class MockWorker {
            onMessage: ((msg: unknown) => void) | undefined;
            onError: ((err: unknown) => void) | undefined;

            constructor(public path: string) { }

            on(event: string, handler: (arg: unknown) => void) {
                if (event === 'message') this.onMessage = handler;
                if (event === 'error') this.onError = handler;
            }

            off() { }

            postMessage(msg: { shouldFail?: boolean; crash?: boolean; data?: unknown }) {
                // Determine response based on msg
                if (msg.crash) {
                    setTimeout(() => this.onError?.(new Error('Worker crashed')), 10);
                } else if (msg.shouldFail) {
                    setTimeout(() => this.onMessage?.({ type: 'error', error: 'Worker failed' }), 10);
                } else {
                    setTimeout(() => this.onMessage?.({ type: 'success', result: 'processed ' + msg.data }), 10);
                }
            }

            terminate() { }
        }
    };
});

describe('WorkerPool', () => {
    it('should distribute tasks to workers', async () => {
        const pool = new WorkerPool(2);
        pool.start();

        const results = await Promise.all([
            pool.run({ data: '1' }),
            pool.run({ data: '2' }),
            pool.run({ data: '3' })
        ]);

        expect(results).toEqual(['processed 1', 'processed 2', 'processed 3']);
    });

    it('should handle worker errors', async () => {
        const pool = new WorkerPool(1);
        pool.start();

        await expect(pool.run({ shouldFail: true })).rejects.toThrow('Worker failed');
    });

    it('should handle worker crash', async () => {
        const pool = new WorkerPool(1);
        pool.start();

        await expect(pool.run({ crash: true })).rejects.toThrow('Worker crashed');
    });
});

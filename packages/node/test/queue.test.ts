import { describe, it, expect } from 'vitest';
import { LocalQueue } from '../src/queue';

describe('LocalQueue', () => {
    it('should execute jobs with concurrency', async () => {
        const queue = new LocalQueue(2); // Concurrency 2
        queue.start();

        let running = 0;
        let maxRunning = 0;

        const createJob = (id: string, duration: number) => ({
            id,
            data: null,
            execute: async () => {
                running++;
                maxRunning = Math.max(maxRunning, running);
                await new Promise(resolve => setTimeout(resolve, duration));
                running--;
            }
        });

        const jobs = [
            createJob('1', 50),
            createJob('2', 50),
            createJob('3', 50),
        ];

        const promises = jobs.map(j => queue.add(j));

        await Promise.all(promises);

        expect(maxRunning).toBe(2);
    });

    it('should handle job errors', async () => {
        const queue = new LocalQueue(1);
        queue.start();

        const failingJob = {
            id: 'fail',
            data: null,
            execute: async () => { throw new Error('Boom'); }
        };

        await expect(queue.add(failingJob)).rejects.toThrow('Boom');
    });

    it('should process queued items', async () => {
        const queue = new LocalQueue(1);
        queue.start();

        const order: string[] = [];
        const createJob = (id: string) => ({
            id,
            data: null,
            execute: async () => { order.push(id); }
        });

        await Promise.all([
            queue.add(createJob('1')),
            queue.add(createJob('2'))
        ]);

        expect(order).toEqual(['1', '2']);
    });
});

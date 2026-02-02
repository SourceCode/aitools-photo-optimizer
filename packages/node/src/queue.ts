import { Queue, QueueJob } from '@aitools-photo-optimizer/core';

interface QueuedItem<T> {
    job: QueueJob<T>;
    resolve: () => void;
    reject: (err: unknown) => void;
}

export class LocalQueue implements Queue {
    private queue: QueuedItem<unknown>[] = [];
    private running = 0;
    private active = false;

    constructor(private concurrency: number = 4) { }

    async add<T>(job: QueueJob<T>): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queue.push({ job, resolve, reject });
            this.processNext();
        });
    }

    start(): void {
        this.active = true;
        this.processNext();
    }

    stop(): void {
        this.active = false;
    }

    private async processNext() {
        if (!this.active || this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const item = this.queue.shift();
        if (!item) return;

        this.running++;
        try {
            await item.job.execute();
            item.resolve();
        } catch (error) {
            console.error(`Job ${item.job.id} failed:`, error);
            item.reject(error);
        } finally {
            this.running--;
            this.processNext();
        }
    }
}

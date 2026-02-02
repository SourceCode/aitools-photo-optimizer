import { CodecAdapter, TransformJob, QualityMetrics } from '@aitools-photo-optimizer/core';
import { WorkerPool } from '../worker-pool';

export class SharpAdapter implements CodecAdapter {
    private pool: WorkerPool;

    constructor(poolSize?: number) {
        this.pool = new WorkerPool(poolSize);
        this.pool.start();
    }

    async optimize(input: Buffer, job: TransformJob): Promise<{ buffer: Buffer; info: any; metrics?: QualityMetrics }> {
        // Offload to worker
        return this.pool.run({
            type: 'optimize',
            input,
            job
        });
    }

    async metadata(input: Buffer): Promise<{ width: number; height: number; format: string }> {
        // Offload to worker (optional, but consistent)
        const result = await this.pool.run({
            type: 'metadata',
            input
        });

        return {
            width: result.width || 0,
            height: result.height || 0,
            format: result.format || 'unknown'
        };
    }

    close() {
        this.pool.close();
    }
}

import { Worker } from 'worker_threads';
import path from 'path';
import os from 'os';

interface WorkerTask {
    message: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}

export class WorkerPool {
    private workers: Worker[] = [];
    private freeWorkers: Worker[] = [];
    private tasks: WorkerTask[] = [];
    private workerPath: string;

    constructor(public size: number = os.cpus().length) {
        // Resolve worker path. In dev (ts-node) we might need .ts, in prod .js
        // A robust way to assume the worker is in the same directory.
        const ext = __filename.endsWith('.ts') ? '.ts' : '.js';
        this.workerPath = path.join(__dirname, `worker-entry${ext}`);

        // Adjust for compilation: if inside 'src', but running from 'dist', __filename would be in dist.
        // If we want to support ts-node strictly we might need 'worker-entry.ts' passed to a worker loader.
        // For now, let's assume we are running compiled JS or ts-node handles it via a register execArgv if we were fancy.
        // But simplified: standard 'dist/worker-entry.js' usage.
        // If this file is 'dist/worker-pool.js', then 'dist/worker-entry.js' works.
    }

    private ensureWorkers() {
        if (this.workers.length === 0) {
            for (let i = 0; i < this.size; i++) {
                this.addNewWorker();
            }
        }
    }

    private addNewWorker() {
        // NOTE: In a real TS monorepo with ts-node, this pathing can be tricky.
        // We might simply check if the .js exists, otherwise try .ts with ts-node registration?
        // Let's assume standard behavior for now.
        const worker = new Worker(this.workerPath);

        // Worker creation


        this.workers.push(worker);
        this.freeWorkers.push(worker);
    }

    async run(message: any): Promise<any> {
        // Create a promise
        return new Promise((resolve, reject) => {
            const task: WorkerTask = { message, resolve, reject };
            this.schedule(task);
        });
    }

    private schedule(task: WorkerTask) {
        if (this.freeWorkers.length > 0) {
            const worker = this.freeWorkers.pop()!;
            this.execute(worker, task);
        } else {
            this.tasks.push(task);
        }
    }

    private execute(worker: Worker, task: WorkerTask) {
        // We need one-time listener for this specific task
        const onMessage = (response: any) => {
            worker.off('message', onMessage);
            worker.off('error', onError);

            if (response.type === 'success') {
                task.resolve(response.result);
            } else {
                task.reject(new Error(response.error));
            }

            this.freeWorkers.push(worker);
            this.processNext();
        };

        const onError = (err: Error) => {
            worker.off('message', onMessage);
            worker.off('error', onError);
            task.reject(err);

            // Replace dead worker?
            this.freeWorkers.push(worker); // Or terminate and replace
            this.processNext();
        };

        worker.on('message', onMessage);
        worker.on('error', onError);

        // Lazy initialization
        if (this.workers.indexOf(worker) === -1) {
            // Should be already in workers list
        }

        worker.postMessage(task.message);
    }

    private processNext() {
        if (this.tasks.length > 0 && this.freeWorkers.length > 0) {
            const task = this.tasks.shift()!;
            const worker = this.freeWorkers.pop()!;
            this.execute(worker, task);
        }
    }

    public close() {
        for (const worker of this.workers) {
            worker.terminate();
        }
        this.workers = [];
        this.freeWorkers = [];
    }

    // Lazy init helper
    public start() {
        if (this.workers.length === 0) {
            this.ensureWorkers();
        }
    }
}

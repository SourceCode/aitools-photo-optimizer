import fs from 'fs-extra';
import path from 'path';
import { StorageAdapter } from '@aitools-photo-optimizer/core';

export class FileSystemAdapter implements StorageAdapter {
    constructor(private basePath: string = '.') { }

    async read(filePath: string): Promise<Buffer> {
        const fullPath = path.resolve(this.basePath, filePath);
        return fs.readFile(fullPath);
    }

    async write(filePath: string, data: Buffer): Promise<void> {
        const fullPath = path.resolve(this.basePath, filePath);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, data);
    }

    async exists(filePath: string): Promise<boolean> {
        const fullPath = path.resolve(this.basePath, filePath);
        return fs.pathExists(fullPath);
    }

    async delete(filePath: string): Promise<void> {
        const fullPath = path.resolve(this.basePath, filePath);
        await fs.remove(fullPath);
    }
}

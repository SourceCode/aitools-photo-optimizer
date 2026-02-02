import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileSystemAdapter } from '../src/storage/fs-adapter';
import fs from 'fs-extra';
import path from 'path';

vi.mock('fs-extra');

describe('FileSystemAdapter', () => {
    let adapter: FileSystemAdapter;

    beforeEach(() => {
        adapter = new FileSystemAdapter('/base');
        vi.clearAllMocks();
    });

    it('should read file from base path', async () => {
        (fs.readFile as any).mockResolvedValue(Buffer.from('content'));
        const result = await adapter.read('test.txt');
        expect(fs.readFile).toHaveBeenCalledWith(path.resolve('/base', 'test.txt'));
        expect(result.toString()).toBe('content');
    });

    it('should write file ensuring directory exists', async () => {
        await adapter.write('subdir/test.txt', Buffer.from('content'));
        const expectedPath = path.resolve('/base', 'subdir/test.txt');
        expect(fs.ensureDir).toHaveBeenCalledWith(path.dirname(expectedPath));
        expect(fs.writeFile).toHaveBeenCalledWith(expectedPath, expect.anything());
    });

    it('should check existence', async () => {
        (fs.pathExists as any).mockResolvedValue(true);
        const exists = await adapter.exists('test.txt');
        expect(exists).toBe(true);
        expect(fs.pathExists).toHaveBeenCalledWith(path.resolve('/base', 'test.txt'));
    });

    it('should delete file', async () => {
        await adapter.delete('test.txt');
        expect(fs.remove).toHaveBeenCalledWith(path.resolve('/base', 'test.txt'));
    });
});

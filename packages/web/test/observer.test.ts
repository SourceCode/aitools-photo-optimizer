/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AutoOptimizer } from '../src/observer';

describe('AutoOptimizer', () => {
    let resolver: any;
    let mockObserve: any;
    let mutationCallback: (mutations: any[]) => void;

    beforeEach(() => {
        document.body.innerHTML = '';
        resolver = vi.fn((src, width, format) => `optimized/${src}`);

        // Mock MutationObserver
        mockObserve = vi.fn();
        mutationCallback = () => { };

        global.MutationObserver = class {
            constructor(cb: any) {
                mutationCallback = cb;
            }
            observe = mockObserve;
            disconnect = vi.fn();
            takeRecords = vi.fn();
        } as any;
    });

    it('should optimize existing images on scan', () => {
        document.body.innerHTML = '<img src="test.jpg" width="100" />';
        const img = document.querySelector('img') as HTMLImageElement;

        const optimizer = new AutoOptimizer(resolver);
        optimizer.start();

        expect(resolver).toHaveBeenCalledWith('test.jpg', 100, 'webp');
        expect(img.src).toContain('optimized/test.jpg');
    });

    it('should handle childList mutations', () => {
        const optimizer = new AutoOptimizer(resolver);
        optimizer.start();

        const img = document.createElement('img');
        img.src = 'dynamic.jpg';
        // Note: In a real DOM, this element would be in the document.
        // Since we mock the observer, we just pass the node to the callback as if it was added.
        // However, scan() uses querySelectorAll on the node.
        // So the node must have the structure.

        const mutationRecord = {
            type: 'childList',
            addedNodes: [img],
            attributeName: null
        };

        // Trigger callback
        mutationCallback([mutationRecord]);

        expect(resolver).toHaveBeenCalledWith('dynamic.jpg', undefined, 'webp');
        expect(img.src).toContain('optimized/dynamic.jpg');
    });

    it('should handle attribute mutations', () => {
        const optimizer = new AutoOptimizer(resolver);
        optimizer.start();

        const img = document.createElement('img');
        img.src = 'later.jpg';

        const mutationRecord = {
            type: 'attributes',
            attributeName: 'src',
            target: img
        };

        mutationCallback([mutationRecord]);

        expect(resolver).toHaveBeenCalledWith('later.jpg', undefined, 'webp');
        expect(img.src).toContain('optimized/later.jpg');
    });
});

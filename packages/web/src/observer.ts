import { ResolveFn } from './types';

export class AutoOptimizer {
    constructor(private resolver: ResolveFn, private root: HTMLElement = document.body) { }

    start() {
        // Observe DOM mutations
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        // Check if it's an element node (1)
                        if (node.nodeType === 1) {
                            this.scan(node as HTMLElement);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    if (mutation.target instanceof HTMLImageElement) {
                        this.optimizeImage(mutation.target);
                    }
                }
            });
        });

        observer.observe(this.root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        // Initial scan
        this.scan(this.root);
    }

    private scan(root: HTMLElement) {
        const images = root.querySelectorAll('img');
        images.forEach((img) => this.optimizeImage(img));

        // Also check root if it is an image
        if (root instanceof HTMLImageElement) {
            this.optimizeImage(root);
        }
    }

    private optimizeImage(img: HTMLImageElement) {
        if (img.dataset.apoOptimized) return;

        const originalSrc = img.getAttribute('src');
        if (!originalSrc) return;

        // Try to resolve optimised version
        // Ideally we check browser support for AVIF/WebP here, but for now we assume modern browser (or let picture tag handle if we were doing that)
        // For src swapping, we'll try to get WebP/AVIF if available.

        const optimizedSrc = this.resolver(originalSrc, img.width || undefined, 'webp'); // Default to webp for safety

        if (optimizedSrc) {
            img.src = optimizedSrc;
            img.dataset.apoOptimized = 'true';
            img.dataset.apoOriginal = originalSrc;
        }
    }
}

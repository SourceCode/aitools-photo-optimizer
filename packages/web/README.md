# @aitools-photo-optimizer/web

Browser runtime for adaptive photo optimization.

## Features

- MutationObserver to automatically detect and optimize images.
- Smart swapping logic.
- Hook system for custom resolution strategies.

## Usage

```typescript
const optimizer = new AutoOptimizer(myResolver);
optimizer.start();
```

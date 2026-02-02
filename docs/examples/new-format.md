# Example: Adding a New Image Format

This guide demonstrates how to extend the optimizer to support a new image format (e.g., JPEG XL).

## 1. Update Core Definitions

Modify `@aitools-photo-optimizer/core` to include the new format in the `ImageFormat` type.

```typescript
// packages/core/src/model/descriptors.ts
export type ImageFormat = 'avif' | 'webp' | 'jpeg' | 'png' | 'jxl'; // Added jxl
```

## 2. Update Configuration Schema

Ensure the `config` object can accept the new format options.

```typescript
// packages/core/src/model/descriptors.ts
export interface OptimizerConfig {
    // ...
    jxl?: JxlOptions;
}
```

## 3. Implement Codec Support

Update the `SharpAdapter` in `@aitools-photo-optimizer/node` to handle the new format.

```typescript
// packages/node/src/adapters/sharp-adapter.ts
async optimize(input: Buffer, job: TransformJob) {
    let pipeline = sharp(input);
    
    if (job.format === 'jxl') {
        pipeline = pipeline.jxl(job.options.jxl);
    }
    // ...
}
```

## 4. Verify

Run tests to ensure the new format is generated correctly.

```bash
pnpm test
```

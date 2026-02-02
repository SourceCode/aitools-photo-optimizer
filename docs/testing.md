# Testing Strategy

We use **Vitest** for all testing needs.

## Test Types

### 1. Unit Tests
- **Location**: `*.test.ts` alongside source or in `test/`.
- **Focus**: Individual functions (Planner, Classifier, Config Validation).
- **Mocking**: Adapters (FS, Codec) are mocked to test logic in isolation.

### 2. Integration Tests
- **Location**: `packages/node/test/*.test.ts`.
- **Focus**: Worker pool, Queue, Real FS interactions (using temp dirs).

### 3. E2E / Golden Tests
- **Location**: `packages/node/test/golden.spec.ts`.
- **Focus**: Full CLI run against fixture images.
- **Verification**: Checks output existence, format, and rough size.

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific file
pnpm test cli.test.ts

# Watch mode
pnpm test --watch
```

## Continuous Integration

Tests run on every PR.
- **Lint**: ESLint check.
- **Types**: `tsc --noEmit`.
- **Test**: Vitest run.

## Benchmarks

We have a benchmark script to measure throughput.
```bash
pnpm run benchmark
```

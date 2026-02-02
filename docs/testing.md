# Testing Strategy

We use **Vitest** for unit and integration testing.

## Running Tests

Run all tests from the root:

```bash
pnpm test
```

## Test Levels

### 1. Unit Tests
Located in `test/` or alongside source files. Focus on pure logic in `@aitools-photo-optimizer/core`.
- **Goal**: Verify classes like `HeuristicClassifier` or `Planner`.
- **Command**: `pnpm -r run test`

### 2. Integration / Golden Tests
Located in `packages/node/test/golden.spec.ts`.
- **Goal**: Ensure the full pipeline (CLI -> Sharp -> Output) works as expected.
- **Method**:
  - Uses `fixtures/` images.
  - Runs the optimizer.
  - Compares output against known "golden" expectations or asserts properties (e.g., "output size < input size").
  
## Writing Tests

When adding a new feature:
1.  Add unit tests for the logic in `core`.
2.  If it affects output quality, add a fixture case in `packages/node/test/golden.spec.ts`.

## CI/CD

Tests are run on every Pull Request via GitHub Actions (if configured).

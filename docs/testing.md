# Testing Strategy

We use **Vitest** for all testing needs, leveraging its speed and compatibility with the Vite ecosystem.

## Test Organization

- **Unit Tests**: Co-located with source or in `test/` folders. Focus on individual functions (e.g., `classifier.test.ts`, `hashing.test.ts`).
- **Integration Tests**: In `packages/node/test`. Test the interaction between CLI, Worker Pool, and File System.
- **E2E / Golden Tests**: `packages/node/test/golden.spec.ts`. These run the full binary against real image fixtures and compare output byte-for-byte (or visually via SSIM) against "golden" known-good outputs.

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test --watch
```

### Specific File
```bash
pnpm test packages/core/test/hashing.test.ts
```

## Writing Tests

1.  **Describe/It**: Use standard BDD syntax.
2.  **Fixtures**: Use `packages/node/test/fixtures` to store small, representative inputs.
3.  **Mocking**: Use `vi.mock` sparingly. prefer testing public interfaces.
    - We mock `sharp` in some unit tests to avoid binary dependencies, but E2E tests use real `sharp`.

## CI Expectations
GitHub Actions (`ci.yml`) runs `pnpm test` on every PR.
Failed tests block merging.

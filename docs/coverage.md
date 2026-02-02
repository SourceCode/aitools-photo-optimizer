# Code Coverage

## Generating Reports

We use Vitest's built-in coverage provider (v8).

To generate a coverage report:

```bash
pnpm test -- --coverage
```

Reports will be generated in `coverage/` directories within each package.

## Targets

We aim for the following coverage metrics:

| Metric | Target | Current Status |
| :--- | :--- | :--- |
| Statements | > 80% | *See CI logs* |
| Branches | > 70% | *See CI logs* |
| Functions | > 80% | *See CI logs* |
| Lines | > 80% | *See CI logs* |

## Critical Paths

The following areas require **100% coverage**:
- `packages/core/src/hashing`: Determines cache hits. Bugs here cause wrong images to be served.
- `packages/core/src/planning`: Logic for deciding formats.

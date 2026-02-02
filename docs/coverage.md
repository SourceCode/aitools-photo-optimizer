# Test Coverage

We maintain a high standard of test coverage. CI gates require passing tests and minimal coverage regressions.

## Metrics (as of latest run)

| Package | Statements | Branch | Functions | Lines | Notes |
|---------|------------|--------|-----------|-------|-------|
| **Overall** | **93.21%** | **74.50%** | **96.82%** | **95.20%** | Strong overall health. |
| `core` | 100% | >90% | 100% | 100% | Critical logic fully covered. |
| `node` | 90.90% | 79.12% | 93.93% | 93.57% | CLI and IO logic. |
| `web` | 92.85% | 71.42% | 100% | 100% | Runtime observer. |

### Critical Gaps
- **Branch Coverage in `command/build.ts` (56%)**: Some CLI edge cases (verbose logging branches, specific error catch blocks) are not fully exercised in integration tests.
- **`worker-pool.ts`**: Some error handling paths for thread termination are theoretical and hard to induce in tests.

## Running Coverage Locally
```bash
pnpm run test --coverage
```
This generates a report in `coverage/` and prints the summary table to stdout.

## Thresholds
We aim for **90% Line Coverage**. PRs dropping below this may be flagged.

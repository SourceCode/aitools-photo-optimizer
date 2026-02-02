# Test Coverage

Target: **95%+** across all packages.

## Generating Report

```bash
pnpm test --coverage
```
This generates a textual report and a HTML report in `coverage/`.

## Current Status (Estimated)

| Package | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| Core    | 100%       | 100%     | 100%      | 100%  |
| Node    | >90%       | >85%     | >90%      | >90%  |

*Note: See `test-results.json` or run coverage command for exact numbers.*

## Critical Paths

- **Planner**: Fully covered (logic core).
- **Classifier**: Fully covered (logic core).
- **CLI**: Covered via E2E golden tests.

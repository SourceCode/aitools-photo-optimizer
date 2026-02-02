# Agent Contribution Guide

This document is tailored for autonomous agents contributing to the `aitools-photo-optimizer` repository.

## Verification Checklist

Before submitting changes or marking a task as complete, perform these self-verifications:

1.  **Build Integrity**: Run `pnpm build` from the root. It must pass without errors.
2.  **Test Coverage**: Run `pnpm test`. If you modified code, ensure existing tests pass and new tests cover your changes.
3.  **Linting & Types**: Run `pnpm run lint` and verify no `any` types were introduced.
4.  **Documentation**:
    - If you changed the CLI, update `packages/node/src/cli.ts` help text and `README.md`.
    - If you changed architecture, update `AGENTS.md`.

## Critical Files

- `AGENTS.md`: Your primary context file.
- `PROJECT_GRAPH.json`: Machine-readable overview of the project structure.
- `apo.config.json`: Default configuration.
- `.cursorrules`: Rules you must follow.

## Common Tasks

### Adding a New Image Format
1.  Update `ImageFormat` type in `@aitools-photo-optimizer/core`.
2.  Update `sharp` execution logic in `@aitools-photo-optimizer/node`.
3.  Add a test case in `packages/node/test`.

### Modifying the Planner
1.  Check `packages/core/src/planning/planner.ts`.
2.  Ensure `TransformPlan` interface is respected.
3.  Run planner tests.

## Troubleshooting

- **Build Fails**: Check `pnpm-lock.yaml` sync (`pnpm install`).
- **Type Errors**: Run `pnpm run agent:fix` (if implemented) or manually check `tsc` output.
- **Test Fails**: Check `test-results.json` for structured error data.

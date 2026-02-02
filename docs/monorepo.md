# Monorepo Structure

This project uses **PNPM Workspaces** to manage multiple packages.

## Workspace Layout

```
.
├── packages/
│   ├── core/       # Domain logic, interfaces, planning (Platform Agnostic)
│   ├── node/       # Node.js adapter, CLI, Worker Pool, Sharp integration
│   └── web/        # Browser runtime (Observer)
├── apps/
│   └── demo/       # Integration example app
├── docs/           # Documentation
├── scripts/        # Maintenance scripts
└── apo.config.json # Project configuration
```

## Dependency Graph

- `node` depends on `core`.
- `web` depends on `core` (types).
- `apps/demo` depends on `web`.

## Building

```bash
# Build all
pnpm build

# Build specific package
pnpm --filter @aitools-photo-optimizer/core build
```

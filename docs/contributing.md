# Contributing

We love contributions! Here's how to help.

## Workflow

1.  **Fork & Clone**: Fork the repo and clone locally.
2.  **Branch**: Create a feature branch (`feat/new-classifier`).
3.  **Install**: `pnpm install`
4.  **Dev**: Make changes.
5.  **Test**: Run `pnpm test`.
6.  **PR**: Push and open a Pull Request.

## Monorepo Guidelines

- **Dependencies**: Use `pnpm add <pkg> --filter <workspace>` to add deps to specific packages.
- **Imports**: Import via package name `@aitools-photo-optimizer/core`, not relative paths `../../core`.
- **Code Style**: We use Prettier + ESLint. Run `pnpm lint` before committing.

## Commit Messages

Use Conventional Commits:

- `feat: ...` for new features
- `fix: ...` for bug fixes
- `docs: ...` for documentation
- `chore: ...` for maintenance

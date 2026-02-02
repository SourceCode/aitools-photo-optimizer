# Aitools Photo Optimizer

**Adaptive, AI-Ready Image Optimization for the Modern Web.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Project Overview

`aitools-photo-optimizer` is a high-performance, strictly typed monorepo designed to automate image optimization workflows. It analyzes source images, intelligently classifies them (Photo vs Icon vs Screenshot), and generates optimized multi-format variants (AVIF, WebP) tailored to the content type.

**Key Capabilities:**
- **Smart Classification**: Uses heuristics to determine if an image is a photo or graphic/icon.
- **Adaptive Encoding**: applies different compression settings based on classification (e.g., lossy for photos, lossless for icons).
- **Source Updating**: Automatically rewrites HTML/JS/TS source files to reference generated assets.
- **Monorepo Architecture**: Modular design separating Core logic, Node.js CLI/Runtime, and Web Runtime.
- **Agent-Ready**: Designed with strict typing and clear boundaries, making it ideal for AI agent integration.

## Architecture Summary

The project is structured as a **pnpm workspace** with the following packages:

- **`@aitools-photo-optimizer/core`**: Pure logic, domain models, hashing, and planning. No side effects.
- **`@aitools-photo-optimizer/node`**: Node.js runtime, CLI, Worker Pool, file system IO, and Sharp integration.
- **`@aitools-photo-optimizer/web`**: Browser runtime for dynamic asset loading and observation.
- **`apps/demo`**: A Vite-based demo application showcasing the web runtime.

See [Implementation Docs](docs/implementation.md) for a deep dive.

## Tech Stack

- **Runtime**: Node.js >= 24.0.0, Modern Browsers
- **Languages**: TypeScript 5.x
- **Build System**: Turbo / pnpm workspaces / Vite / tsup
- **Testing**: Vitest, native node `test` runner
- **Image Processing**: `sharp` (libvips)
- **Code Quality**: ESLint, Prettier, Husky

## Quick Start

### Prerequisites
- Node.js 24+
- pnpm 9+

### Running Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Build detailed packages
pnpm build

# 3. Run the demo app
pnpm -C apps/demo dev
```

For full details, see [Installation](docs/install.md) and [First Run](docs/first-run.md).

## Configuration

Configuration is handled via CLI flags and standard node conventions.
See [Setup Guide](docs/setup.md) for environment variables and advanced config.

## Testing & Coverage

We maintain high test coverage (>90%).

```bash
# Run all tests
pnpm test

# Run with coverage (results in coverage/)
pnpm run test --coverage
```

See [Coverage Report](docs/coverage.md).

## Documentation Index

- **[Installation](docs/install.md)** - Requirements and install guide.
- **[Setup & Configuration](docs/setup.md)** - Env vars and config details.
- **[First Run](docs/first-run.md)** - Step-by-step usage guide.
- **[Functionality](docs/functionality.md)** - Core features and workflows.
- **[API Reference](docs/api.md)** - CLI and Library API.
- **[Architecture](docs/implementation.md)** - Internal design and modules.
- **[Security](docs/security.md)** - Auth, policies, and hardening.
- **[Testing](docs/testing.md)** - Test strategy and patterns.
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and fixes.
- **[Contributing](docs/contributing.md)** - How to help out.

## Contributing

We welcome contributions! Please check [Contributing](docs/contributing.md) for guidelines on PRs, commit messages, and code style.

## License

MIT

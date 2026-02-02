# Configuration Baseline

**Requirement ID**: CM-2
**Effective Date**: 2026-02-02

## 1. Purpose
To establish a secure and consistent baseline configuration for the `aitool-photo-optimizer` project, ensuring all environments and developer setups meet minimum security and quality standards.

## 2. Repository Baseline

- **Version Control**: Git
- **Hosting**: GitHub
- **Branch Protection**: Enabled on `main`.
    - Require pull request reviews before merging.
    - Require status checks to pass before merging.
    - Require signed commits (recommended).

## 3. Development Environment

- **Node.js Version**: LTS (defined in `.nvmrc` or `engines` in `package.json`).
- **Package Manager**: `pnpm` (lockfile `pnpm-lock.yaml` MUST be committed).
- **Linter**: ESLint with `@typescript-eslint/recommended`.
- **Formatter**: Prettier.

## 4. Application Configuration (Web Runtime)

- **Content Security Policy (CSP)**: Must be configured in consuming applications.
- **Dependencies**: All runtime dependencies must be scanned for vulnerabilities.
- **Build Tool**: Vite (optimized production build settings).

## 5. Change Management

- Any deviation from this baseline requires a documented exception in the Risk Register.
- Changes to `tsconfig.json`, `.eslintrc.json`, or GitHub workflow files require Maintainer approval.

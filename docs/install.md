# Installation Guide

## Prerequisites

- **Node.js**: Version **24.13.0** or higher.
    - *Why?* We use modern Node features and strict engine versioning.
- **Package Manager**: **PNPM** (version 8 or 9).
    - *Why?* Efficient monorepo workspace support.
- **OS**: MacOS, Linux, or WSL2 (Windows).

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/aitools-photo-optimizer.git
   cd aitools-photo-optimizer
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```
   *This installs all dependencies for all workspace packages.*

3. **Build Core Packages**
   ```bash
   pnpm build
   ```
   *This compiles TypeScript references across the monorepo.*

## Verification

Run the health check script to verify your environment:

```bash
pnpm run agent:health
```

Expected output should show `status: "ok"`.

## Common Issues

### `ERR_PNPM_ENGINE_STRICT`
If you see an error about Node version, ensure you are using Node v24+.
```bash
nvm install 24
nvm use 24
```

### Sharp Installation Failures
If `sharp` fails to install, you may need system libraries.
- **MacOS**: `brew install vips`
- **Ubuntu**: `sudo apt-get install libvips-dev`
*Note: Usually prebuilt binaries work fine.*

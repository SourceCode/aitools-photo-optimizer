# Installation

## Prerequisites

- **Node.js**: Version **24.0.0** or higher is strictly required due to usage of modern Node.js APIs (e.g., native test runner, worker threads).
- **Package Manager**: **pnpm** (v9+) is required for workspace management.
- **OS**: macOS, Linux, or Windows (WSL2 recommended).

## Repository Bootstrap

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/aitool-photo-optimizer.git
    cd aitool-photo-optimizer
    ```

2.  **Install dependencies**
    Use `pnpm` to install dependencies across all workspaces.
    ```bash
    pnpm install
    ```

3.  **Build the project**
    Build all packages in topological order.
    ```bash
    pnpm build
    ```

## Common Issues

### "Sharp prebuilt mismatch"
If you encounter errors related to `sharp` or `libvips`:
- Ensure you are on a supported architecture (x64, arm64).
- Run `pnpm rebuild sharp`.
- If on Linux/Alpine, verify `vips-dev` packages are installed if not using prebuilts.

### "Command not found: apo"
The CLI is built into `packages/node/bin/apo.js`. If you want to run it globally, link it:
```bash
pnpm -C packages/node link --global
```
Then you can run `apo --help`.

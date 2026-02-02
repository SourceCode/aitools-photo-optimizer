# Installation

This guide covers the system requirements and steps to install **AI Tools Photo Optimizer**.

## Prerequisites

Before installing, ensure you have the following software installed:

- **Node.js**: v18.0.0 or higher.
- **PNPM**: v8.0.0 or higher (required for monorepo workspace support).
- **Sharp Dependencies**: The project uses `sharp` for image processing. Most systems (macOS, Linux, Windows) will dynamically grab the precompiled binaries.

## Steps

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/your-org/aitool-photo-optimizer.git
    cd aitool-photo-optimizer
    ```

2.  **Install Dependencies**

    We use `pnpm` workspace to manage dependencies across packages.

    ```bash
    pnpm install
    ```

3.  **Build Packages**

    Build all packages in order (Core -> Node/Web).

    ```bash
    pnpm build
    ```

4.  **Verify Installation**

    Run the tests to ensure everything is working correctly.

    ```bash
    pnpm test
    ```

## Common Issues

### Sharp Installation Failures

If you encounter errors related to `sharp`, ensure you have the necessary build tools for your OS.

- **macOS**: `xcode-select --install`
- **Linux**: `sudo apt-get install build-essential`

See [Troubleshooting](troubleshooting.md) for more.

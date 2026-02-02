# Setup & Configuration

## Environment Variables

The application does not rely heavily on environment variables for runtime logic, but the following are respected:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Affects logging verbosity and some build optimizations. |
| `CI` | No | `false` | If `true`, disables interactive prompts and progress bars. |
| `UV_THREADPOOL_SIZE` | No | Auto | Controls libuv threadpool, relevant for `sharp` concurrency. |

## Configuration Files

### Project Configuration
The project uses strict **TypeScript** configuration.
- `tsconfig.base.json`: Shared base config.
- `tsconfig.json`: Root reference config.
- `vitest.config.ts`: Test configuration.

### CLI Configuration
The `apo` CLI mostly uses command-line flags, but it generates a **manifest file** (`manifest.json`) in the output directory.

#### manifest.json
This file maps source images to their optimized variations.
**Location**: `[output-dir]/manifest.json`
**Usage**: Consumed by the Web Runtime (`@aitools-photo-optimizer/web`) to resolve assets.

## Secrets Management
As detailed in [Security](security.md), this tool **does not** handle application secrets (API keys, DB passwords).
- **Do not** commit `.env` files.
- **Do not** embed secrets in source image metadata.

# Integrations

## Libraries

### Sharp (libvips)
**Purpose**: High-performance image processing.
**Integration**: `packages/node/src/adapters/sharp.ts` implements `CodecAdapter`.
**Notes**: Requires native binaries.

### Fast-Glob
**Purpose**: File system scanning.
**Integration**: used in `packages/node/src/commands/build.ts` to resolve input patterns.

## Frameworks

### Web Runtime (Planned)
Future integration with React/Vue is planned via `packages/web`. Currently, it provides a generic Observer for vanilla JS.

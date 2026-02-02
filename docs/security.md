# Security Policy

## Dependencies

- We use `pnpm` with lockfiles to ensure deterministic installs.
- Periodic `pnpm audit` checks are recommended.

## File System Access

- The tool is designed to read from a source Glob and write to a specific output directory.
- **Risk**: Malicious Glob patterns could potentially read files outside intended scope.
- **Mitigation**: Run in a containerized environment if processing untrusted user input.

## Image Processing

- **Libvips/Sharp**: We rely on Sharp's security handling for malformed images.
- **DoS**: Extremely large images (pixel bombs) could exhaust memory. Configure `maxFileSizeBytes` in production.

## Secrets

- This tool does not handle keys, tokens, or credentials.
- Do **NOT** commit `.env` or config files containing secrets (though none are currently used).

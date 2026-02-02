# Security

## Data Privacy

- **Image Content**: This tool processes images locally. No images are uploaded to any external service unless you explicitly configure a remote `StorageAdapter` (e.g., S3).
- **Metadata**: By default, `stripMetadata: true` is enabled in config. This removes EXIF data (GPS, Camera info) from output images, enhancing user privacy.

## Secrets

- **No Secrets in Config**: Do not put AWS keys or DB passwords in `apo.config.json`.
- **GitIgnore**: Ensure `apo.config.json` is gitignored if it contains sensitive info (though it shouldn't).
- **Environment Variables**: Use standard environment variables for credentials.

## Dependencies

- We regularly audit dependencies using `pnpm audit`.
- The runtime `@aitools-photo-optimizer/web` has minimal dependencies to reduce attack surface.

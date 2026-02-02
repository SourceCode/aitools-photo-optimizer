# Setup & Configuration

This guide explains how to configure the Photo Optimizer suite.

## Environment Variables

Currently, the core library is designed to run statelessly, but the CLI and Runtime can be configured via `apo.config.json` or environment variables for specific overrides (if implemented).

*No specific `.env` variables are strictly required for basic CLI usage as of v0.1.0.*

## Configuration File (`apo.config.json`)

To configure the optimizer behaviors, create an `apo.config.json` in your project root.

### Example

```json
{
  "quality": 80,
  "lossless": false,
  "formats": ["avif", "webp"],
  "presets": {
    "photo": "web-2025-balanced",
    "screenshot": "ui-assets-crisp"
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `80` | Default quality (0-100) for lossy compression. |
| `effort` | `number` | `4` | CPU effort (0-9) for compression. Higher is slower but smaller. |
| `lossless` | `boolean` | `false` | Enable lossless compression where supported. |
| `stripMetadata` | `boolean` | `true` | Remove EXIF and other metadata to save space. |
| `formats` | `Array` | `['avif', 'webp']` | Output formats to generate. |
| `presets` | `Object` | *See below* | Mapping of classification types to named presets. |
| `qualityGates` | `Object` | *See below* | Minimum SSIM metrics allowed. |

### Presets

Presets allow you to define specific rules for different image types (Photos vs UI Screenshots).

**Default Presets:**

- `web-2025-balanced`: Standard web quality (Q80, Effort 4).
- `ui-assets-crisp`: Higher quality for UI elements (Q90, Near-Lossless).

## Secrets Management

This project handles image data. Avoid committing any production API keys or sensitive image data to the repository.

- **Storage Credentials**: If extending `StorageAdapter` for S3/GCS, use environment variables (`AWS_ACCESS_KEY_ID`, etc.) and **never** hardcode them in `apo.config.json`.

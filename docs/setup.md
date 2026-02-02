# Setup & Configuration

## Environment Variables

Currently, the project relies primarily on the config file rather than environment variables, but the following are supported for development:

| Variable | Description | Default |
|----------|-------------|---------|
| `CI` | Set to `true` to disable interactive progress bars | `false` |
| `NODE_ENV` | `production` optimizes builds | `development` |

## Configuration File

The tool looks for `apo.config.json` in the current working directory.

### Minimal Example
```json
{
  "quality": 80,
  "formats": ["webp"]
}
```

### Full Example
```json
{
  "quality": 80,
  "effort": 4,
  "lossless": false,
  "stripMetadata": true,
  "formats": ["avif", "webp"],
  "presets": {
    "screenshot": "ui-crisp"
  },
  "definedPresets": {
    "ui-crisp": {
      "name": "ui-crisp",
      "quality": 95,
      "lossless": true,
      "formats": ["png", "webp"]
    }
  },
  "qualityGates": {
    "photo": {
      "ssim": 0.95
    }
  }
}
```

## Config Reference

### Root Options

- **`quality`** (number, 0-100): Default JPEG/WebP quality.
- **`effort`** (number, 0-9): CPU effort vs. file size. Higher is slower but smaller.
- **`lossless`** (boolean): Use lossless compression where supported.
- **`formats`**: List of target formats (`avif`, `webp`, `jpeg`, `png`).
- **`stripMetadata`** (boolean): Remove EXIF/ICC data.

### Presets

Define named presets in `definedPresets` and map them to image classifications (photo, screenshot, icon) in `presets`.

### Quality Gates

Enforce minimum visual quality metrics (SSIM). If an image fails the gate, it may warn or fail the build (implementation dependent).

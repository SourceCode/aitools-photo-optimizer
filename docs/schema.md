# Configuration Schema

The `apo.config.json` is validated using Zod.

## Types

### OptimizerConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `quality` | `number` | `80` | Global quality (0-100). |
| `effort` | `number` | `4` | CPU effort (0-9). |
| `lossless` | `boolean` | `false` | Enable lossless compression. |
| `formats` | `Array` | `['avif', 'webp']` | Output formats. |
| `presets` | `Record` | `{}` | Map classification -> preset name. |
| `definedPresets` | `Record` | `{}` | Define custom presets. |
| `qualityGates` | `Record` | `{}` | SSIM thresholds per class. |

### OptimizationPreset

Extends `OptimizerConfig` (except `presets`, `definedPresets`, `qualityGates`).
Can override any base setting.

### QualityMetrics

| Field | Type | Description |
|-------|------|-------------|
| `ssim` | `number` | Structural Similarity Index (0-1). |
| `psnr` | `number` | Peak Signal-to-Noise Ratio. |

## Validation

Invalid configuration will throw a descriptive error listing all issues found by Zod.

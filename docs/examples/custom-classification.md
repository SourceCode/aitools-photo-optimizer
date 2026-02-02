# Example: Custom Classification

This guide demonstrates how to override the default classification logic.

## 1. Using Configuration

You can force a classification for specific file types via `apo.config.json` (planned feature).

## 2. Programmatic Override

If you are using the core library, you can pass a custom classifier.

```typescript
import { HeuristicClassifier, ImageInputDescriptor } from '@aitools-photo-optimizer/core';

class MyClassifier extends HeuristicClassifier {
    classify(input: ImageInputDescriptor) {
        if (input.path.includes('hero')) {
            return 'photo';
        }
        return super.classify(input);
    }
}
```

## 3. Heuristic Adjustments

To tweak the heuristics, modify `packages/core/src/classifier/heuristic.ts`.

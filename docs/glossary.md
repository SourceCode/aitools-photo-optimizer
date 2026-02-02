# Glossary

| Term | Definition |
| :--- | :--- |
| **Scanner** | The component responsible for discovering source images in the file system based on glob patterns. |
| **Classifier** | Determines the semantic type of an image (e.g., `photo`, `screenshot`, `icon`) to decide optimization strategy. |
| **Planner** | Generates a `TransformPlan` detailing exactly what operations (resize, format convert) to perform on an image. |
| **Executor** | The engine (currently `sharp`) that executes the `TransformPlan` to produce optimized assets. |
| **Manifest** | A JSON file (`manifest.json`) mapping original source file paths to their optimized runtime variants. |
| **TransformPlan** | A structured object defining the steps to optimize an image. Contains `ImageJob`s. |
| **InputDescriptor** | Metadata about a source image found by the Scanner (path, size, modification time). |
| **Adaptive Loading** | The process of swapping the `src` of an image tag at runtime based on browser capabilities and screen size. |
| **ManifestEntry** | A single record in the manifest, representing one source image and its optimized outputs. |

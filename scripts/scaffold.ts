import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const type = args[0];
const name = args[1];

if (!type || !name) {
    console.error('Usage: tsx scripts/scaffold.ts package <name>');
    process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const TARGET_DIR = path.join(PACKAGES_DIR, name);

if (fs.existsSync(TARGET_DIR)) {
    console.error(`Package ${name} already exists.`);
    process.exit(1);
}

if (type === 'package') {
    fs.mkdirSync(TARGET_DIR, { recursive: true });

    // package.json
    const pkgJson = {
        name: `@aitools-photo-optimizer/${name}`,
        version: "0.0.0",
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
            "build": "tsc",
            "test": "vitest run"
        },
        devDependencies: {
            "typescript": "^5.0.0"
        }
    };
    fs.writeFileSync(path.join(TARGET_DIR, 'package.json'), JSON.stringify(pkgJson, null, 2));

    // tsconfig.json
    const tsConfig = {
        "extends": "../../tsconfig.base.json",
        "compilerOptions": {
            "outDir": "dist",
            "rootDir": "src"
        },
        "include": ["src"]
    };
    fs.writeFileSync(path.join(TARGET_DIR, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

    // src/index.ts
    fs.mkdirSync(path.join(TARGET_DIR, 'src'));
    fs.writeFileSync(path.join(TARGET_DIR, 'src/index.ts'), `export const hello = '${name}';\n`);

    // test/index.test.ts
    fs.mkdirSync(path.join(TARGET_DIR, 'test'));
    fs.writeFileSync(path.join(TARGET_DIR, 'test/index.test.ts'), `import { describe, it, expect } from 'vitest';\n\ndescribe('${name}', () => {\n    it('works', () => {\n        expect(true).toBe(true);\n    });\n});\n`);

    console.log(`Scaffolded package packages/${name}`);
} else {
    console.error('Unknown type. Currently only "package" is supported.');
}

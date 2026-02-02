import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');

interface PackageInfo {
    name: string;
    path: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

function getPackages(): PackageInfo[] {
    if (!fs.existsSync(PACKAGES_DIR)) return [];
    return fs.readdirSync(PACKAGES_DIR).filter(p => {
        return fs.statSync(path.join(PACKAGES_DIR, p)).isDirectory();
    }).map(p => {
        const pkgJsonPath = path.join(PACKAGES_DIR, p, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
            return {
                name: pkg.name,
                path: `packages/${p}`,
                version: pkg.version,
                dependencies: pkg.dependencies,
                devDependencies: pkg.devDependencies
            } as PackageInfo;
        }
        return null;
    }).filter((p): p is PackageInfo => p !== null);
}

const graph = {
    generatedAt: new Date().toISOString(),
    root: ROOT,
    packages: getPackages(),
    docs: fs.existsSync(path.join(ROOT, 'docs'))
        ? fs.readdirSync(path.join(ROOT, 'docs')).filter(f => f.endsWith('.md') || f.endsWith('.json'))
        : [],
    criticalFiles: [
        'README.md',
        'AGENTS.md',
        'apo.config.json',
        '.cursorrules',
        'PROJECT_GRAPH.json',
        'CONTRIBUTING.md'
    ].filter(f => fs.existsSync(path.join(ROOT, f)))
};

fs.writeFileSync(
    path.join(ROOT, 'PROJECT_GRAPH.json'),
    JSON.stringify(graph, null, 2)
);

console.log('Generated PROJECT_GRAPH.json');

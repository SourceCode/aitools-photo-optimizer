const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const FIXTURES_DIR = path.join(__dirname, 'golden');

if (!fs.existsSync(FIXTURES_DIR)) {
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

async function createFixtures() {
    console.log('Generating golden fixtures...');

    // 1. Photo-like image (Just noise/gradients)
    await sharp({
        create: {
            width: 800,
            height: 600,
            channels: 3,
            background: { r: 128, g: 128, b: 128 }
        }
    })
        .linear(1, 0) // no-op?
        // Add some text or shapes to make it interesting?
        .composite([{
            input: Buffer.from('<svg width="800" height="600"><defs><linearGradient id="grad"><stop offset="0%" stop-color="red"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect x="0" y="0" width="800" height="600" fill="url(#grad)"/></svg>'),
            blend: 'overlay'
        }])
        .jpeg({ quality: 90 })
        .toFile(path.join(FIXTURES_DIR, 'photo.jpg'));

    // 2. Screenshot-like image (Text, sharp edges)
    // Create an SVG with text and convert to PNG
    const svgText = `
    <svg width="1024" height="768">
        <rect width="100%" height="100%" fill="white"/>
        <text x="50" y="50" font-family="Arial" font-size="24" fill="black">App Screenshot Mockup</text>
        <rect x="50" y="100" width="200" height="50" fill="#007bff"/>
        <text x="70" y="135" font-family="Arial" font-size="16" fill="white">Button</text>
    </svg>
    `;
    await sharp(Buffer.from(svgText))
        .png()
        .toFile(path.join(FIXTURES_DIR, 'screenshot.png'));

    // 3. Icon (Small, transparent)
    const svgIcon = `
    <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="none" stroke="black" stroke-width="4"/>
        <path d="M20 32 L44 32 M32 20 L32 44" stroke="black" stroke-width="4"/>
    </svg>
    `;
    await sharp(Buffer.from(svgIcon))
        .png()
        .toFile(path.join(FIXTURES_DIR, 'icon.png'));

    console.log('Fixtures generated in', FIXTURES_DIR);
}

createFixtures().catch(console.error);

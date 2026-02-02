const fs = require('fs');
const path = require('path');

const FIXTURES_DIR = path.join(__dirname, 'golden');

if (!fs.existsSync(FIXTURES_DIR)) {
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

async function createFixtures() {
    console.log('Generating dummy golden fixtures...');

    // Write dummy buffers
    fs.writeFileSync(path.join(FIXTURES_DIR, 'photo.jpg'), Buffer.from('dummy-jpg-content'));
    fs.writeFileSync(path.join(FIXTURES_DIR, 'screenshot.png'), Buffer.from('dummy-png-content'));
    fs.writeFileSync(path.join(FIXTURES_DIR, 'icon.png'), Buffer.from('dummy-icon-content'));

    console.log('Dummy fixtures generated in', FIXTURES_DIR);
}

createFixtures();

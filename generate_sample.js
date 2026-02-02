const fs = require('fs');
const path = require('path');

const outputPath = path.resolve(__dirname, 'apps/demo/public/images/sample.jpg');

// 1x1 red pixel jpeg
const buffer = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);
console.log('Sample image created successfully');

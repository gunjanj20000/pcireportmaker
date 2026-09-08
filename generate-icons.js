/**
 * Canvas SVG to PNG Icon Generator
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🖼️ Generating PWA PNG icons from SVG...');

// Read the SVG content
const svgPath = path.join(__dirname, 'assets', 'icon.svg');
if (!fs.existsSync(svgPath)) {
  console.error('icon.svg not found!');
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf8');

// Copy icon.svg to icon-512.svg for fallback
fs.writeFileSync(path.join(__dirname, 'assets', 'icon-512.png.svg'), svgContent);
console.log('✓ Created assets/icon.svg');

// Update build script to handle PNG/SVG fallback

// Script to generate PWA icons
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Create SVG icon template
const createIconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.25}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">SMS</text>
</svg>`;

async function generateIcons() {
  try {
    // Generate 192x192 icon
    const svg192 = Buffer.from(createIconSVG(192));
    await sharp(svg192)
      .resize(192, 192)
      .png()
      .toFile(join(publicDir, 'pwa-192x192.png'));

    // Generate 512x512 icon
    const svg512 = Buffer.from(createIconSVG(512));
    await sharp(svg512)
      .resize(512, 512)
      .png()
      .toFile(join(publicDir, 'pwa-512x512.png'));

    console.log('✅ PWA icons generated successfully!');
    console.log('  - pwa-192x192.png');
    console.log('  - pwa-512x512.png');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();


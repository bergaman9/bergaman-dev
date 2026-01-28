import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Define Word Model Schema strictly for this script to avoid import issues
const wordSchema = new mongoose.Schema({
    term: { type: String, required: true },
    meaning: { type: String, required: true },
    image: { type: String },
});
const Word = mongoose.models.Word || mongoose.model('Word', wordSchema);

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'vocabulary');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Color palettes for gradients
const PALETTES = [
    ['#1a2a6c', '#b21f1f', '#fdbb2d'], // Deep Sea -> Gold
    ['#000000', '#434343'],            // Titanium
    ['#0f0c29', '#302b63', '#24243e'], // Night Sky
    ['#4CA1AF', '#C4E0E5'],            // Fresh
    ['#ff9966', '#ff5e62'],            // Sunset
    ['#AA076B', '#61045F'],            // Purple
    ['#134E5E', '#71B280'],            // Green
    ['#20002c', '#cbb4d4'],            // Mystic
];

// Simple hash function to generate deterministic index from string
function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

// Generate SVG string
function generateSVG(term) {
    const hash = Math.abs(getHash(term));
    const palette = PALETTES[hash % PALETTES.length];
    const startColor = palette[0];
    const endColor = palette[palette.length - 1];
    const angle = (hash % 360);

    // Create geometric shapes
    const shapeCount = 3 + (hash % 5);
    let shapes = '';

    for (let i = 0; i < shapeCount; i++) {
        const sHash = Math.abs(getHash(term + i));
        const opacity = 0.1 + ((sHash % 30) / 100);
        const size = 50 + (sHash % 200);
        const x = sHash % 100;
        const y = (sHash / 100) % 100;

        if (i % 2 === 0) {
            shapes += `<circle cx="${x}%" cy="${y}%" r="${size}" fill="white" fill-opacity="${opacity}" />`;
        } else {
            shapes += `<rect x="${x}%" y="${y}%" width="${size}" height="${size}" transform="rotate(${sHash % 90} ${x} ${y})" fill="white" fill-opacity="${opacity}" />`;
        }
    }

    // Get first letter
    const letter = term.charAt(0).toUpperCase();

    return `<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad${hash})" />
    ${shapes}
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-weight="bold" font-size="120" fill="white" opacity="0.2">${letter}</text>
    <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="white" opacity="0.8" letter-spacing="2">${term.toUpperCase()}</text>
  </svg>`;
}

async function main() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is missing in .env.local');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        console.log('📥 Fetching words without images...');
        const words = await Word.find({}); // Fetch ALL words to generate placeholders for everyone
        console.log(`Found ${words.length} words total.`);

        let createdCount = 0;
        let skippedCount = 0;

        for (const word of words) {
            // Sanitize filename
            const filename = word.term.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '') + '.svg'; // Use SVG
            const filePath = path.join(OUTPUT_DIR, filename);

            // Check if file exists (don't overwrite explicitly generated/uploaded PNGs or existing SVGs)
            const pngPath = filePath.replace('.svg', '.png');
            if (fs.existsSync(filePath) || fs.existsSync(pngPath) || word.image) {
                skippedCount++;
                continue;
            }

            const svgContent = generateSVG(word.term);
            fs.writeFileSync(filePath, svgContent);
            createdCount++;

            if (createdCount % 50 === 0) process.stdout.write('.');
        }

        console.log('\n');
        console.log(`✅ Completed!`);
        console.log(`✨ Generated: ${createdCount} images`);
        console.log(`⏭️  Skipped: ${skippedCount} items (already had images)`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();

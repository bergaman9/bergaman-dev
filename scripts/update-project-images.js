// Script to update project images in MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

// Portfolio schema (minimal version for update)
const portfolioSchema = new mongoose.Schema({
    title: String,
    image: String
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Image mappings based on project titles
const imageUpdates = [
    {
        id: '68505d25e0a4164a911d5233', // Bergaman Portfolio
        image: '/images/projects/ai-projects.png'
    },
    {
        id: '68505d25e0a4164a911d522f', // Stardust RP Bot
        image: '/images/projects/ai-projects.png'
    }
];

async function updateProjectImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        for (const update of imageUpdates) {
            const result = await Portfolio.updateOne(
                { _id: update.id },
                { $set: { image: update.image } }
            );
            console.log(`Updated ${update.id}: ${result.modifiedCount} document(s) modified`);
        }

        console.log('All updates complete!');

        // Show updated projects
        const projects = await Portfolio.find({});
        console.log('\nCurrent project images:');
        projects.forEach(p => {
            console.log(`- ${p.title}: ${p.image}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateProjectImages();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function inspect() {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined.');
        process.exit(1);
    }

    try {
        const uri = process.env.MONGODB_URI;
        const client = new mongoose.mongo.MongoClient(uri);
        await client.connect();

        console.log("Connected to cluster.");

        const db = client.db('words-db');
        const collections = await db.listCollections().toArray();

        // Check specific collections
        const targets = ['nouns', 'verbs', 'adjectives', 'adverbs'];

        for (const target of targets) {
            if (collections.find(c => c.name === target)) {
                const doc = await db.collection(target).findOne();
                console.log(`\n--- Sample from ${target} ---`);
                console.log(JSON.stringify(doc, null, 2));
            }
        }

        await client.close();

    } catch (error) {
        console.error('Error inspecting DB:', error);
    }
}

inspect();

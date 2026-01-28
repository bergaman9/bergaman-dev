
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
        // Connect to the generic cluster, then inspect specific DB
        // The URI usually looks like mongodb+srv://user:pass@cluster.xyz.mongodb.net/DEFAULT_DB?options
        // We want to force connection to 'words-db'

        // Hacky way to switch DB in connection string if needed, 
        // but mongoose.createConnection or client.db('words-db') is better if we were using raw driver.
        // With mongoose, we can just connect and then use .useDb() or access collections directly?
        // Actually, let's just use the raw driver for inspection to be safe and simple.

        const uri = process.env.MONGODB_URI;
        const client = new mongoose.mongo.MongoClient(uri);
        await client.connect();

        console.log("Connected to cluster.");

        const db = client.db('words-db');
        const collections = await db.listCollections().toArray();
        console.log("Collections in words-db:", collections.map(c => c.name));

        // Inspect 'nouns'
        const nouns = await db.collection('nouns').findOne();
        console.log("\nSample Noun:", JSON.stringify(nouns, null, 2));

        // Inspect 'verbs'
        const verbs = await db.collection('verbs').findOne();
        console.log("\nSample Verb:", JSON.stringify(verbs, null, 2));

        // Inspect 'adjectives'
        const adj = await db.collection('adjectives').findOne();
        console.log("\nSample Adjective:", JSON.stringify(adj, null, 2));

        await client.close();

    } catch (error) {
        console.error('Error inspecting DB:', error);
    }
}

inspect();

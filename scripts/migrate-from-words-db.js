
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../src/models/Word.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

async function migrate() {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined.');
        process.exit(1);
    }

    const client = new mongoose.mongo.MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log("Connected to MongoDB cluster.");

        // Connect to source and destination
        const sourceDb = client.db('words-db');

        // We utilize the Mongoose model for the destination to leverage validation
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongoose connected to destination DB.");

        const collections = [
            { name: 'nouns', type: 'noun' },
            { name: 'verbs', type: 'verb' },
            { name: 'adjectives', type: 'adjective' },
            { name: 'adverbs', type: 'adverb' },
            { name: 'conjunctions', type: 'conjunction' },
            { name: 'prepositions', type: 'preposition' }
        ];

        let totalImported = 0;
        let totalSkipped = 0;
        let totalErrors = 0;

        for (const work of collections) {
            console.log(`\nProcessing collection: ${work.name}...`);

            const srcCollection = sourceDb.collection(work.name);

            // Check if collection exists
            const exists = await srcCollection.countDocuments({}, { limit: 1 });
            if (exists === 0) {
                console.log(` Collection ${work.name} not found or empty. Skipping.`);
                continue;
            }

            const cursor = srcCollection.find({});

            while (await cursor.hasNext()) {
                const doc = await cursor.next();


                // Detect fields
                // The source DB seems to use the type as the key for the word (e.g. { noun: "apple" })
                let term = doc[work.type] || doc.word || doc.term || doc.Column1 || doc.name;
                let meaning = doc.turkish || doc.meaning || doc.Column4 || doc.definition_tr;
                let definition = doc.definition || doc.english || doc.Column3 || doc.definition_en;

                // Clean up
                if (term) term = term.toString().trim().toLowerCase();
                if (meaning) meaning = meaning.toString().trim();
                if (definition) definition = definition.toString().trim();

                if (!term || !meaning) {
                    if (totalSkipped < 3) {
                        console.log(`\n[DEBUG] Skipped Doc in ${work.name}:`);
                        console.log('Keys:', Object.keys(doc));
                        console.log('Full Doc:', JSON.stringify(doc, null, 2));
                    }
                    totalSkipped++;
                    continue;
                }

                try {
                    // Upsert finding by term + type
                    await Word.findOneAndUpdate(
                        { term: term, type: work.type },
                        {
                            term,
                            type: work.type,
                            meaning,
                            exampleSentence: definition, // Use definition as example/context for now
                            level: 'B2', // Default level, maybe infer later?
                            // Don't overwrite existing manually curated data if possible, but upsert says otherwise. 
                            // We'll trust the migration for now.
                        },
                        { upsert: true, new: true, runValidators: true }
                    );
                    totalImported++;
                    if (totalImported % 100 === 0) process.stdout.write('.');
                } catch (err) {
                    console.error(`\n  Error importing '${term}':`, err.message);
                    totalErrors++;
                }
            }
        }

        console.log(`\n\nMigration Complete!`);
        console.log(`Imported/Updated: ${totalImported}`);
        console.log(`Skipped (invalid format): ${totalSkipped}`);
        console.log(`Errors: ${totalErrors}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
        await mongoose.disconnect();
    }
}

migrate();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../src/models/Word.js';

// Load env vars
// Note: We need to handle the path resolution since we're running from scripts/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Alternative loading if .env.local doesn't exist or work directly
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

const sampleWords = [
    // B1
    { term: 'accomplish', meaning: 'achieve or complete successfully', type: 'verb', level: 'B1', pronunciation: '/əˈkʌmplɪʃ/', exampleSentence: 'She accomplished her goal of graduating with honors.' },
    { term: 'curious', meaning: 'eager to know or learn something', type: 'adjective', level: 'B1', pronunciation: '/ˈkjʊərɪəs/', exampleSentence: 'I was curious to know what would happen next.', image: '/images/vocab-curious.png' },
    { term: 'doubt', meaning: 'a feeling of uncertainty or lack of conviction', type: 'noun', level: 'B1', pronunciation: '/daʊt/', exampleSentence: 'There is no doubt that he is the best player.' },
    { term: 'generous', meaning: 'showing a readiness to give more of something, as money or time, than is strictly necessary or expected', type: 'adjective', level: 'B1', pronunciation: '/ˈdʒɛn(ə)rəs/', exampleSentence: 'He was generous with both his time and money.' },
    { term: 'hesitate', meaning: 'pause before saying or doing something, especially through uncertainty', type: 'verb', level: 'B1', pronunciation: '/ˈhɛzɪteɪt/', exampleSentence: 'She hesitated before replying.' },

    // B2
    { term: 'abandon', meaning: 'cease to support or look after (someone); desert', type: 'verb', level: 'B2', pronunciation: '/əˈband(ə)n/', exampleSentence: 'He abandoned his family.' },
    { term: 'barrier', meaning: 'a fence or other obstacle that prevents movement or access', type: 'noun', level: 'B2', pronunciation: '/ˈbarɪə/', exampleSentence: 'The language barrier made it difficult to communicate.', image: '/images/vocab-barrier.png' },
    { term: 'calculate', meaning: 'determine (the amount or number of something) mathematically', type: 'verb', level: 'B2', pronunciation: '/ˈkalkjʊleɪt/', exampleSentence: 'Have you calculated the cost of the trip?' },
    { term: 'domestic', meaning: 'relating to the running of a home or to family relations', type: 'adjective', level: 'B2', pronunciation: '/dəˈmɛstɪk/', exampleSentence: 'Domestic chores such as cooking and cleaning.' },
    { term: 'efficient', meaning: '(especially of a system or machine) achieving maximum productivity with minimum wasted effort or expense', type: 'adjective', level: 'B2', pronunciation: '/ɪˈfɪʃ(ə)nt/', exampleSentence: 'More efficient ways of working.' },

    // C1
    { term: 'advocate', meaning: 'publicly recommend or support', type: 'verb', level: 'C1', pronunciation: '/ˈadvəkeɪt/', exampleSentence: 'They advocated an ethical foreign policy.' },
    { term: 'bias', meaning: 'inclination or prejudice for or against one person or group, especially in a way considered to be unfair', type: 'noun', level: 'C1', pronunciation: '/ˈbʌɪəs/', exampleSentence: 'There was evidence of bias against foreign applicants.' },
    { term: 'coherent', meaning: '(of an argument, theory, or policy) logical and consistent', type: 'adjective', level: 'C1', pronunciation: '/kə(ʊ)ˈhɪər(ə)nt/', exampleSentence: 'They failed to develop a coherent economic strategy.' },
    { term: 'deduce', meaning: 'arrive at (a fact or a conclusion) by reasoning; draw as a logical conclusion', type: 'verb', level: 'C1', pronunciation: '/dɪˈdjuːs/', exampleSentence: 'Little can be deduced from these figures.' },
    { term: 'explicit', meaning: 'stated clearly and in detail, leaving no room for confusion or doubt', type: 'adjective', level: 'C1', pronunciation: '/ɪkˈsplɪsɪt/', exampleSentence: 'The speaker\'s intentions were not made explicit.' },

    // C2
    { term: 'aberration', meaning: 'a departure from what is normal, usual, or expected, typically appearing to be unwelcome', type: 'noun', level: 'C2', pronunciation: '/abəˈreɪʃ(ə)n/', exampleSentence: 'They described the outbreak of violence in the area as an aberration.' },
    { term: 'capitulate', meaning: 'cease to resist an opponent or an unwelcome demand; yield', type: 'verb', level: 'C2', pronunciation: '/kəˈpɪtjʊleɪt/', exampleSentence: 'The patriots had to capitulate to the enemy forces.' },
    { term: 'debilitate', meaning: 'make (someone) very weak and infirm', type: 'verb', level: 'C2', pronunciation: '/dɪˈbɪlɪteɪt/', exampleSentence: 'He was severely debilitated by a stomach upset.' },
    { term: 'eclectic', meaning: 'deriving ideas, style, or taste from a broad and diverse range of sources', type: 'adjective', level: 'C2', pronunciation: '/ɪˈklɛktɪk/', exampleSentence: 'Universities offering an eclectic mix of courses.' },
    { term: 'fabricate', meaning: 'invent (something) in order to deceive', type: 'verb', level: 'C2', pronunciation: '/ˈfabrɪkeɪt/', exampleSentence: 'Officers fabricated evidence.' },
];

async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Check if we want to clear existing data, or just add new ones. 
        // For now, let's upsert to avoid duplicates but keep existing customized ones if any.
        // Or just clear and reset for a clean state since this is "dev" mode essentially?
        // User asked to add 25,000 words later. For now let's just add these 20 if they don't exist.

        let addedCount = 0;

        for (const word of sampleWords) {
            const exists = await Word.findOne({ term: word.term });
            if (!exists) {
                await Word.create(word);
                addedCount++;
                console.log(`Added: ${word.term}`);
            } else {
                // Update existing to include image if recently added
                Object.assign(exists, word);
                await exists.save();
                console.log(`Updated: ${word.term}`);
            }
        }

        console.log(`\nSeeding complete! Added ${addedCount} new words.`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();

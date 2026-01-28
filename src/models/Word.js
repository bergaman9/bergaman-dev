import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
    term: {
        type: String,
        required: [true, 'Please provide a term'],
        trim: true,
        index: true,
    },
    meaning: {
        type: String,
        required: [true, 'Please provide a meaning'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'phrase', 'idiom'],
        default: 'noun',
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        default: 'B1',
        index: true,
    },
    pronunciation: {
        type: String,
        trim: true,
    },
    exampleSentence: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index to ensure unique term+type combinations
WordSchema.index({ term: 1, type: 1 }, { unique: true });

export default mongoose.models.Word || mongoose.model('Word', WordSchema);

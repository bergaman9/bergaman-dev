import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    words: [{
        wordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word',
            required: true
        },
        status: {
            type: String,
            enum: ['known', 'learning', 'want_to_learn'],
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    lastActive: {
        type: Date,
        default: Date.now
    }
});

// Compound index to quickly look up a specific word for a user
UserProgressSchema.index({ userId: 1, 'words.wordId': 1 });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);

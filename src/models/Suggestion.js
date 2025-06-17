import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['feature', 'bug', 'improvement', 'project', 'other'],
    default: 'feature'
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'in-progress', 'completed', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  submittedBy: {
    type: String,
    default: 'Anonymous User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  },
  adminResponse: {
    type: String,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for status and priority
suggestionSchema.index({ status: 1, priority: -1, createdAt: -1 });

const Suggestion = mongoose.models.Suggestion || mongoose.model('Suggestion', suggestionSchema);

export default Suggestion; 
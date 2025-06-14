import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postSlug: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  approved: {
    type: Boolean,
    default: true // Auto-approve for now, can be changed later
  },
  ipAddress: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
CommentSchema.index({ postSlug: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 
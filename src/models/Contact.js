import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  adminReply: {
    type: String,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  },
  repliedBy: {
    type: String,
    default: null
  },
  // Nested conversation thread
  replies: [{
    message: {
      type: String,
      required: true
    },
    isFromAdmin: {
      type: Boolean,
      default: false
    },
    senderName: {
      type: String,
      required: true
    },
    senderEmail: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }],
  // Technical information
  ipAddress: String,
  userAgent: String,
  referrer: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema); 
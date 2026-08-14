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
  inquiryType: {
    type: String,
    enum: ['Project inquiry', 'Electrical engineering opportunity', 'Software development', 'Automation / IoT', 'Collaboration', 'General question'],
    default: 'Project inquiry'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'active', 'closed'],
    default: 'new'
  },
  lastActivity: {
    type: Date,
    default: Date.now
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
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['admin', 'user'],
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    },
    ipAddress: { type: String, maxlength: 128 },
    userAgent: { type: String, maxlength: 512 }
  }],
  // Technical information
  ipAddress: { type: String, maxlength: 128 },
  userAgent: { type: String, maxlength: 512 },
  referrer: { type: String, maxlength: 500 },
  timestamp: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

// Index for better query performance
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

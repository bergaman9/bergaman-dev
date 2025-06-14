import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  source: {
    type: String,
    enum: ['website', 'admin', 'import'],
    default: 'website'
  },
  // Technical information
  ipAddress: String,
  userAgent: String,
  referrer: String,
  // Preferences
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    categories: [{
      type: String,
      enum: ['tech', 'blockchain', 'ai', 'projects', 'tutorials']
    }]
  }
}, {
  timestamps: true
});

// Index for better query performance (email already has unique index)
NewsletterSchema.index({ status: 1, subscribedAt: -1 });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema); 
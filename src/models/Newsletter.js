import mongoose from 'mongoose';

function isValidNewsletterEmail(value) {
  if (typeof value !== 'string' || value.length < 3 || value.length > 254) return false;
  if ([...value].some((character) => character.charCodeAt(0) <= 32)) return false;

  const separator = value.lastIndexOf('@');
  if (separator < 1 || separator !== value.indexOf('@')) return false;

  const local = value.slice(0, separator);
  const domain = value.slice(separator + 1);
  if (local.length > 64 || domain.length < 3 || domain.length > 253) return false;

  const labels = domain.split('.');
  return labels.length >= 2 && labels.every((label) => (
    label.length > 0 &&
    label.length <= 63 &&
    !label.startsWith('-') &&
    !label.endsWith('-')
  ));
}

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: isValidNewsletterEmail,
      message: 'Please enter a valid email'
    }
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

import mongoose from 'mongoose';

const NewsletterCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['markdown', 'html'],
    default: 'markdown'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft'
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  // Recipients
  recipients: {
    total: {
      type: Number,
      default: 0
    },
    sent: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    opened: {
      type: Number,
      default: 0
    },
    clicked: {
      type: Number,
      default: 0
    }
  },
  // Targeting
  targetAudience: {
    status: {
      type: String,
      enum: ['all', 'active', 'specific'],
      default: 'active'
    },
    categories: [{
      type: String,
      enum: ['tech', 'blockchain', 'ai', 'projects', 'tutorials']
    }],
    frequency: {
      type: String,
      enum: ['all', 'daily', 'weekly', 'monthly'],
      default: 'all'
    }
  },
  // Template settings
  template: {
    name: {
      type: String,
      default: 'default'
    },
    settings: {
      headerColor: {
        type: String,
        default: '#4f46e5'
      },
      accentColor: {
        type: String,
        default: '#e8c547'
      },
      includeHeader: {
        type: Boolean,
        default: true
      },
      includeFooter: {
        type: Boolean,
        default: true
      }
    }
  },
  // Metadata
  createdBy: {
    type: String,
    default: 'Admin'
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
NewsletterCampaignSchema.index({ status: 1, createdAt: -1 });
NewsletterCampaignSchema.index({ scheduledAt: 1 });

export default mongoose.models.NewsletterCampaign || mongoose.model('NewsletterCampaign', NewsletterCampaignSchema); 
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
  },
  userAgent: {
    type: String,
    default: null
  },
  browser: {
    name: { type: String, default: null },
    version: { type: String, default: null }
  },
  os: {
    name: { type: String, default: null },
    version: { type: String, default: null }
  },
  device: {
    type: { type: String, default: null }, // mobile, desktop, tablet
    vendor: { type: String, default: null },
    model: { type: String, default: null }
  },
  location: {
    country: { type: String, default: null },
    countryCode: { type: String, default: null },
    region: { type: String, default: null },
    regionName: { type: String, default: null },
    city: { type: String, default: null },
    zip: { type: String, default: null },
    lat: { type: Number, default: null },
    lon: { type: Number, default: null },
    timezone: { type: String, default: null },
    isp: { type: String, default: null },
    org: { type: String, default: null },
    as: { type: String, default: null }
  },
  referrer: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
CommentSchema.index({ postSlug: 1, createdAt: -1 });
CommentSchema.index({ ipAddress: 1 });
CommentSchema.index({ 'location.country': 1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 
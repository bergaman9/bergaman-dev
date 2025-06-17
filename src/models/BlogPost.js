import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    default: 'technology'
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    default: 'Bergaman',
    trim: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    name: String,
    email: String,
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'password', 'members', 'private'],
    default: 'public'
  },
  password: {
    type: String,
    trim: true
  },
  memberOnly: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Create indexes (slug already has unique index from schema)
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ published: 1 });
BlogPostSchema.index({ createdAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema); 
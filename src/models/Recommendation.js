import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['movie', 'game', 'book', 'music', 'series', 'link'],
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  year: {
    type: Number,
    required: function() {
      return ['movie', 'game', 'book', 'music', 'series'].includes(this.category);
    }
  },
  genre: {
    type: String,
    required: function() {
      return ['movie', 'game', 'book', 'music', 'series'].includes(this.category);
    },
    trim: true
  },
  // Optional fields based on category
  director: {
    type: String,
    required: function() {
      return this.category === 'movie';
    },
    trim: true
  },
  developer: {
    type: String,
    required: function() {
      return this.category === 'game';
    },
    trim: true
  },
  author: {
    type: String,
    required: function() {
      return this.category === 'book';
    },
    trim: true
  },
  url: {
    type: String,
    required: false,
    trim: true
  },
  linkType: {
    type: String,
    required: function() {
      return this.category === 'link';
    },
    trim: true
  },
  recommendation: {
    type: String,
    required: true,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
recommendationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes
recommendationSchema.index({ category: 1, status: 1, order: 1 });
recommendationSchema.index({ featured: 1, createdAt: -1 });

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export default Recommendation; 
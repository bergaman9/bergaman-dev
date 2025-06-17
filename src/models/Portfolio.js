import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/portfolio/default.svg'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Web', 'Mobile', 'Desktop', 'Game', 'AI', 'IoT', 'Graphic Design', 'Brand', 'Bot', 'Other', 
           'web', 'mobile', 'desktop', 'game', 'ai', 'iot', 'graphic design', 'brand', 'bot', 'other', 'design', 'bots'],
    default: 'Web'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'published'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  demoUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes
portfolioSchema.index({ status: 1, order: 1 });
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ featured: 1 });

// Add middleware to normalize category values before saving
portfolioSchema.pre('save', function(next) {
  // Convert lowercase categories to uppercase first letter format
  if (this.category) {
    if (this.category === 'web') this.category = 'Web';
    else if (this.category === 'mobile') this.category = 'Mobile';
    else if (this.category === 'desktop') this.category = 'Desktop';
    else if (this.category === 'game') this.category = 'Game';
    else if (this.category === 'ai') this.category = 'AI';
    else if (this.category === 'iot') this.category = 'IoT';
    else if (this.category === 'graphic design' || this.category === 'design') this.category = 'Graphic Design';
    else if (this.category === 'brand') this.category = 'Brand';
    else if (this.category === 'bot' || this.category === 'bots') this.category = 'Bot';
    else if (this.category === 'other') this.category = 'Other';
  }
  
  // Convert published status to active
  if (this.status === 'published') {
    this.status = 'active';
  }
  
  next();
});

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

export default Portfolio; 
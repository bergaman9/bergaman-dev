// Script to convert suggestions to recommendations
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;

// Define schemas
const suggestionSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  link: String,
  rating: Number,
  status: String,
  imageUrl: String,
  year: Number,
  createdAt: Date,
  updatedAt: Date
});

const recommendationSchema = new mongoose.Schema({
  title: String,
  category: String, // 'movie', 'game', 'book', 'music', 'series', 'link'
  description: String, 
  image: String,
  rating: Number,
  year: Number,
  genre: String,
  director: String,
  developer: String,
  author: String,
  url: String,
  linkType: String,
  recommendation: String,
  status: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
});

async function main() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('Connected to MongoDB');

    // Create models
    const Suggestion = mongoose.model('Suggestion', suggestionSchema);
    const Recommendation = mongoose.model('Recommendation', recommendationSchema);

    // Get all suggestions
    const suggestions = await Suggestion.find({});
    console.log(`Found ${suggestions.length} suggestions`);

    if (suggestions.length === 0) {
      console.log('No suggestions found. Exiting.');
      await mongoose.disconnect();
      return;
    }

    // Convert suggestions to recommendations
    const recommendations = suggestions.map((suggestion, index) => {
      // Map suggestion type to recommendation category
      let category;
      switch (suggestion.type.toLowerCase()) {
        case 'movie':
          category = 'movie';
          break;
        case 'game':
          category = 'game';
          break;
        case 'book':
          category = 'book';
          break;
        case 'music':
          category = 'music';
          break;
        case 'show':
        case 'series':
        case 'tv':
          category = 'series';
          break;
        default:
          category = 'link';
      }

      // Create base recommendation object
      const recommendation = {
        title: suggestion.title,
        category,
        description: suggestion.description || `${suggestion.title} recommendation`,
        image: suggestion.imageUrl || `/images/${category}s/default.png`,
        rating: suggestion.rating || 8,
        status: suggestion.status === 'approved' ? 'active' : 'inactive',
        order: index,
        recommendation: suggestion.description || `${suggestion.title} is highly recommended.`,
        createdAt: suggestion.createdAt || new Date(),
        updatedAt: suggestion.updatedAt || new Date()
      };

      // Add category-specific fields
      if (['movie', 'game', 'book', 'music', 'series'].includes(category)) {
        recommendation.year = suggestion.year || new Date().getFullYear();
        recommendation.genre = 'Unknown';
        
        if (category === 'movie') {
          recommendation.director = 'Unknown';
        } else if (category === 'game') {
          recommendation.developer = 'Unknown';
        } else if (category === 'book') {
          recommendation.author = 'Unknown';
        }
      } else if (category === 'link') {
        recommendation.url = suggestion.link || 'https://example.com';
        recommendation.linkType = 'Resource';
      }

      return recommendation;
    });

    // Save recommendations to database
    if (recommendations.length > 0) {
      console.log(`Inserting ${recommendations.length} recommendations...`);
      await Recommendation.insertMany(recommendations);
      console.log('Recommendations inserted successfully');
      
      // Save to backup JSON file
      const backupPath = path.join(process.cwd(), 'recommendations-backup.json');
      await fs.writeFile(backupPath, JSON.stringify(recommendations, null, 2));
      console.log(`Backup saved to ${backupPath}`);
    } else {
      console.log('No recommendations to insert');
    }

    console.log('Done');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error); 
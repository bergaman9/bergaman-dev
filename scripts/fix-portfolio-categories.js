// Script to fix portfolio categories
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = process.env.MONGODB_URI;

async function fixPortfolioCategories() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  try {
    console.log('Starting portfolio category fix script...');
    console.log(`Connecting to MongoDB at ${uri.split('@')[1]}`);
    
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Get the database name from the connection string or use default
    const dbName = process.env.MONGODB_DB || 'bergaman-dev';
    const db = client.db(dbName);
    
    // Get the portfolio collection
    const portfolioCollection = db.collection('portfolios');
    
    // Get all portfolios
    const portfolios = await portfolioCollection.find({}).toArray();
    console.log(`Found ${portfolios.length} portfolio items`);
    
    if (portfolios.length === 0) {
      console.log('No portfolio items found to update.');
      return;
    }
    
    // Category mapping
    const categoryMap = {
      'web': 'Web',
      'mobile': 'Mobile',
      'desktop': 'Desktop',
      'game': 'Game',
      'ai': 'AI',
      'bot': 'Bot',
      'bots': 'Bot',
      'iot': 'IoT',
      'design': 'Graphic Design',
      'graphic design': 'Graphic Design',
      'brand': 'Brand',
      'other': 'Other'
    };
    
    // Update categories
    let updatedCount = 0;
    
    for (const portfolio of portfolios) {
      const currentCategory = portfolio.category;
      
      // Skip if null or undefined
      if (!currentCategory) {
        console.log(`Skipping portfolio "${portfolio.title}" - no category defined`);
        continue;
      }
      
      // Check if category needs to be updated
      const normalizedCategory = categoryMap[currentCategory.toLowerCase()];
      
      if (normalizedCategory && normalizedCategory !== currentCategory) {
        console.log(`Updating portfolio "${portfolio.title}" category from "${currentCategory}" to "${normalizedCategory}"`);
        
        // Update the category
        await portfolioCollection.updateOne(
          { _id: portfolio._id },
          { $set: { category: normalizedCategory } }
        );
        
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} portfolio categories`);
    
  } catch (error) {
    console.error('Error fixing portfolio categories:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
fixPortfolioCategories().catch(console.error); 
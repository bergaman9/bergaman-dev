import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../../models/BlogPost';
import { blogPosts } from '../../../../data/blogPosts';

// Connect to MongoDB with better error handling
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for migration');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

export async function POST(request) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          error: 'Database not configured', 
          details: 'MONGODB_URI environment variable is missing. Please configure your database connection.' 
        },
        { status: 500 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Check if posts already exist
    const existingPosts = await BlogPost.find({});
    if (existingPosts.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Database already contains ${existingPosts.length} posts. Clear existing posts first if you want to re-migrate.`,
        existingPosts: existingPosts.length
      });
    }
    
    // Migrate existing posts
    const migratedPosts = [];
    
    for (const post of blogPosts) {
      try {
        const newPost = new BlogPost({
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content || `# ${post.title}\n\n${post.description}\n\nThis is the full content of the blog post. You can edit this content in the admin panel.`,
          excerpt: post.excerpt || post.description.substring(0, 150),
          category: post.category || 'technology',
          tags: post.tags || ['blog', 'technology'],
          image: post.image || '',
          author: 'Bergaman',
          readTime: post.readTime || '5 min read',
          views: Math.floor(Math.random() * 500) + 50,
          likes: Math.floor(Math.random() * 50) + 5,
          comments: [],
          published: true,
          featured: false,
          seo: {
            metaTitle: post.title,
            metaDescription: post.description,
            keywords: post.tags || ['blog', 'technology']
          },
          createdAt: new Date(post.date || Date.now()),
          updatedAt: new Date()
        });
        
        await newPost.save();
        migratedPosts.push(newPost);
      } catch (postError) {
        console.error(`Error migrating post "${post.title}":`, postError);
        // Continue with other posts even if one fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedPosts.length} posts to MongoDB`,
      posts: migratedPosts.length,
      details: `Migration completed. ${migratedPosts.length} out of ${blogPosts.length} posts were successfully migrated.`
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to migrate posts';
    let errorDetails = error.message;
    
    if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection refused';
      errorDetails = 'Cannot connect to MongoDB. Please check if your database is running and the connection string is correct.';
    } else if (error.message.includes('authentication failed')) {
      errorMessage = 'Database authentication failed';
      errorDetails = 'Invalid database credentials. Please check your MongoDB username and password.';
    } else if (error.message.includes('MONGODB_URI')) {
      errorMessage = 'Database configuration error';
      errorDetails = 'MongoDB connection string is not properly configured.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 
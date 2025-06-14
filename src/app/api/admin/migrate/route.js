import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../../models/BlogPost';
import { blogPosts } from '../../../../data/blogPosts';

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for migration');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    // Clear existing posts (optional - remove this if you want to keep existing data)
    await BlogPost.deleteMany({});
    
    // Migrate existing posts
    const migratedPosts = [];
    
    for (const post of blogPosts) {
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
        views: Math.floor(Math.random() * 500) + 50, // Random views for demo
        likes: Math.floor(Math.random() * 50) + 5, // Random likes for demo
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
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedPosts.length} posts to MongoDB`,
      posts: migratedPosts.length
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate posts', details: error.message },
      { status: 500 }
    );
  }
} 
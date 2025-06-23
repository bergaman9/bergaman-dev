import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    platform: process.platform,
    versions: {
      node: process.version,
      nextjs: process.env.__NEXT_VERSION || 'unknown'
    },
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPreview: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
    },
    database: {
      status: 'unknown',
      error: null,
      postCount: 0
    }
  };

  // Test database connection
  try {
    console.log('Testing database connection...');
    await connectDB();
    debugInfo.database.status = 'connected';
    
    // Try to count blog posts
    const postCount = await BlogPost.countDocuments();
    debugInfo.database.postCount = postCount;
    
    // Get sample post
    const samplePost = await BlogPost.findOne().lean();
    debugInfo.database.samplePost = samplePost ? {
      title: samplePost.title,
      slug: samplePost.slug,
      published: samplePost.published,
      visibility: samplePost.visibility,
      hasImage: !!samplePost.image,
      createdAt: samplePost.createdAt
    } : null;
    
  } catch (error) {
    console.error('Database test failed:', error);
    debugInfo.database.status = 'error';
    debugInfo.database.error = error.message;
  }

  return NextResponse.json(debugInfo, { 
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
} 
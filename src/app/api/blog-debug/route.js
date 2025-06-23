import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';

export async function GET() {
  try {
    await connectDB();
    
    // Get all blog posts with full details
    const allPosts = await BlogPost.find({}).lean();
    
    // Group by visibility
    const byVisibility = allPosts.reduce((acc, post) => {
      const visibility = post.visibility || 'public';
      if (!acc[visibility]) acc[visibility] = [];
      acc[visibility].push({
        title: post.title,
        slug: post.slug,
        published: post.published,
        visibility: post.visibility,
        createdAt: post.createdAt
      });
      return acc;
    }, {});
    
    // Get public posts query like the main API
    const publicQuery = { 
      published: true,
      $or: [
        { visibility: 'public' },
        { visibility: { $exists: false } }
      ]
    };
    
    const publicPosts = await BlogPost.find(publicQuery).lean();
    
    return NextResponse.json({
      total: allPosts.length,
      byVisibility,
      publicPosts: publicPosts.map(p => ({
        title: p.title,
        slug: p.slug,
        published: p.published,
        visibility: p.visibility,
        hasImage: !!p.image,
        image: p.image
      })),
      publicQuery
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 
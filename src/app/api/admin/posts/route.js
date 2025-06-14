import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../../models/BlogPost';
import { connectDB } from '../../../../lib/mongodb';

// GET - Fetch blog posts with pagination and filtering
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    
    // Build query
    let query = {};
    
    if (category) query.category = category;
    if (published !== null) query.published = published === 'true';
    if (featured !== null) query.featured = featured === 'true';
    if (slug) query.slug = slug;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate skip
    const skip = (page - 1) * limit;
    
    // Fetch posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch posts';
    let statusCode = 500;
    
    if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection refused. Please check if MongoDB is running.';
    } else if (error.message.includes('MONGODB_URI')) {
      errorMessage = 'Database configuration error. Please check your MongoDB connection string.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Database connection timeout. Please try again.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// POST - Create new blog post
export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const post = new BlogPost(data);
    await post.save();
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 
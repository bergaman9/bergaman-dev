import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlogPost from '../../../models/BlogPost';
import { connectDB } from '../../../lib/mongodb';

// GET - Fetch published blog posts (public access)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    
    // Build query - only published posts for public access
    let query = { published: true };
    
    if (category) query.category = category;
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
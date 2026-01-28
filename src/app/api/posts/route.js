import { NextResponse } from 'next/server';
import BlogPost from '../../../models/BlogPost';
import { connectDB } from '../../../lib/mongodb';

// GET - Fetch public blog posts
export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const tag = searchParams.get('tag');

    // Build query - only show published and public posts
    let query = {
      published: true,
      $or: [
        { visibility: 'public' },
        { visibility: { $exists: false } }
      ]
    };

    if (category && category !== 'all') query.category = category;
    if (slug) query.slug = slug;
    if (tag) query.tags = { $in: [new RegExp(`^${tag}$`, 'i')] };
    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ]
        }
      ];
      delete query.$or;
    }

    console.log('Query:', JSON.stringify(query));

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    console.log('Fetching posts...');
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${posts.length} posts`);

    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    console.log(`Total posts matching query: ${total}`);

    return NextResponse.json({
      success: true,
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
    console.error('Error in /api/posts:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      details: error.message,
      timestamp: new Date().toISOString(),
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
} 
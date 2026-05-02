import { NextResponse } from 'next/server';
import BlogPost from '../../../models/BlogPost';
import { connectDB } from '../../../lib/mongodb';
import { escapeRegExp } from '@/lib/serverSecurity';

// GET - Fetch public blog posts
export async function GET(request) {
  try {
    await connectDB();

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
    if (tag) query.tags = { $in: [new RegExp(`^${escapeRegExp(tag)}$`, 'i')] };
    if (search) {
      const safeSearch = escapeRegExp(search.slice(0, 100));
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { title: { $regex: safeSearch, $options: 'i' } },
            { description: { $regex: safeSearch, $options: 'i' } },
            { tags: { $in: [new RegExp(safeSearch, 'i')] } }
          ]
        }
      ];
      delete query.$or;
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
    console.error('Error in /api/posts:', error.message);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

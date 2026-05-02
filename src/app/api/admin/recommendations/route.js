import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';
import { clampString, readJsonLimited, validateEnum } from '@/lib/serverSecurity';

const RECOMMENDATION_STATUSES = ['active', 'inactive'];
const RECOMMENDATION_CATEGORIES = ['movie', 'game', 'book', 'music', 'series', 'link'];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = clampString(searchParams.get('category'), 80);

    let query = {};
    if (status) query.status = validateEnum(status, RECOMMENDATION_STATUSES, 'status');
    if (category && category !== 'all') query.category = validateEnum(category, RECOMMENDATION_CATEGORIES, 'category');

    const recommendations = await Recommendation.find(query)
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const data = await readJsonLimited(request, { maxBytes: 32 * 1024 });

    // Handle empty URL fields
    if (data.url === '') {
      data.url = undefined;
    }

    // Handle image paths - accept both URL format and relative paths
    if (data.image === '') {
      data.image = undefined;
    }

    const recommendation = await Recommendation.create(data);

    return NextResponse.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create recommendation' },
      { status: 500 }
    );
  }
}

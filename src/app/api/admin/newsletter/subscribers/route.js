import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Newsletter from '../../../../../models/Newsletter';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch subscribers with pagination
    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Newsletter.countDocuments(query);

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { email, name, preferences } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Create new subscriber
    const subscriber = new Newsletter({
      email: email.toLowerCase(),
      name: name || '',
      status: 'active',
      source: 'admin',
      preferences: preferences || {
        frequency: 'weekly',
        categories: ['tech', 'projects']
      }
    });

    await subscriber.save();

    return NextResponse.json({
      message: 'Subscriber added successfully',
      subscriber
    });

  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
} 
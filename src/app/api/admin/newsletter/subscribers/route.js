import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Newsletter from '../../../../../models/Newsletter';
import {
  clampString,
  createSafeRegex,
  jsonError,
  readJsonLimited,
  validateEmail,
  validateEnum,
} from '../../../../../lib/serverSecurity';

const SUBSCRIBER_STATUSES = ['active', 'unsubscribed', 'bounced'];
const FREQUENCIES = ['daily', 'weekly', 'monthly'];
const CATEGORIES = ['tech', 'blockchain', 'ai', 'projects', 'tutorials'];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit'), 10) || 50));
    const status = searchParams.get('status');
    const search = clampString(searchParams.get('search'), 100);

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = validateEnum(status, SUBSCRIBER_STATUSES, 'status');
    }

    if (search) {
      const safeSearch = createSafeRegex(search);
      query.$or = [
        { email: safeSearch },
        { name: safeSearch }
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
    return jsonError(error, 500);
  }
}

export async function POST(request) {
  try {
    const { email, name, preferences = {} } = await readJsonLimited(request, { maxBytes: 8 * 1024 });
    const normalizedEmail = clampString(email, 254).toLowerCase();
    const normalizedName = clampString(name, 120);

    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: normalizedEmail });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    const frequency = preferences.frequency
      ? validateEnum(preferences.frequency, FREQUENCIES, 'frequency')
      : 'weekly';
    const categories = Array.isArray(preferences.categories)
      ? preferences.categories
          .filter((category) => CATEGORIES.includes(category))
          .slice(0, 5)
      : ['tech', 'projects'];

    // Create new subscriber
    const subscriber = new Newsletter({
      email: normalizedEmail,
      name: normalizedName,
      status: 'active',
      source: 'admin',
      preferences: {
        frequency,
        categories: categories.length ? categories : ['tech', 'projects']
      }
    });

    await subscriber.save();

    return NextResponse.json({
      message: 'Subscriber added successfully',
      subscriber
    });

  } catch (error) {
    console.error('Error adding subscriber:', error);
    return jsonError(error, 500);
  }
}

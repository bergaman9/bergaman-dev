import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Suggestion from '@/models/Suggestion';
import { clampString, readJsonLimited, validateEnum } from '@/lib/serverSecurity';

const SUGGESTION_STATUSES = ['pending', 'under-review', 'in-progress', 'completed', 'rejected'];
const SUGGESTION_CATEGORIES = ['feature', 'bug', 'improvement', 'project', 'other'];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = clampString(searchParams.get('category'), 80);

    let filter = {};
    if (status && status !== 'all') filter.status = validateEnum(status, SUGGESTION_STATUSES, 'status');
    if (category && category !== 'all') filter.category = validateEnum(category, SUGGESTION_CATEGORIES, 'category');

    const suggestions = await Suggestion.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const data = await readJsonLimited(request, { maxBytes: 16 * 1024 });

    const suggestion = new Suggestion({
      ...data,
      submittedAt: new Date(),
      votes: 0,
      status: 'pending'
    });

    await suggestion.save();

    return NextResponse.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Error creating suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create suggestion' },
      { status: 500 }
    );
  }
}

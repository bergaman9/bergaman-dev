import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Suggestion from '@/models/Suggestion';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    
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
    
    const data = await request.json();
    
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
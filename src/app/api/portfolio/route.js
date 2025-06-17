import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export async function GET(request) {
  try {
    await connectDB();
    console.log('Connected to MongoDB in portfolio API');

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = { status: 'active' }; // Always filter by active status
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    console.log('Portfolio query:', query);
    
    // Get portfolio items with proper sorting
    const portfolios = await Portfolio.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 });
    
    console.log(`Found ${portfolios.length} portfolio items`);

    return NextResponse.json({
      success: true,
      portfolios: portfolios
    });

  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
} 
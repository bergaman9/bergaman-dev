import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const portfolios = await Portfolio.find(query)
      .sort({ order: 1, createdAt: -1 });

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

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();
    
    const portfolio = new Portfolio({
      title: data.title,
      description: data.description,
      image: data.image || '/images/portfolio/default.svg',
      technologies: data.technologies || [],
      category: data.category,
      status: data.status || 'published',
      featured: data.featured || false,
      demoUrl: data.demoUrl || '',
      githubUrl: data.githubUrl || '',
      order: data.order || 0
    });

    await portfolio.save();

    return NextResponse.json({
      success: true,
      data: portfolio
    });

  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
} 
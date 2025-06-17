import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

// This endpoint will fix all portfolio items with incorrect category values
export async function GET(request) {
  try {
    await connectDB();
    
    // Find all portfolios with 'Bots' category
    const portfoliosToFix = await Portfolio.find({ category: 'Bots' });
    
    if (portfoliosToFix.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No portfolios need to be fixed',
        count: 0
      });
    }
    
    // Update all portfolios with 'Bots' to 'Bot'
    const updateResult = await Portfolio.updateMany(
      { category: 'Bots' },
      { $set: { category: 'Bot' } }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Fixed portfolio categories',
      count: updateResult.modifiedCount,
      matched: updateResult.matchedCount
    });
    
  } catch (error) {
    console.error('Error fixing portfolio categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fix portfolio categories' },
      { status: 500 }
    );
  }
} 
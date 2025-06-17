import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const id = params.id;
    
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      portfolio
    });
    
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const id = params.id;
    const data = await request.json();
    
    // Ensure image has a default value
    if (!data.image || data.image.trim() === '') {
      data.image = '/images/portfolio/default.svg';
    }
    
    // Normalize category value
    if (data.category === 'bots' || data.category === 'Bots') {
      data.category = 'Bot'; // Ensure it matches the enum in the model
    }
    
    // Normalize status value
    if (data.status === 'published') {
      data.status = 'active'; // Ensure it matches the enum in the model
    }
    
    // Create a clean update object with only valid fields
    const updateData = {
      title: data.title,
      description: data.description,
      image: data.image,
      technologies: data.technologies || [],
      category: data.category,
      status: data.status,
      featured: data.featured,
      demoUrl: data.demoUrl || '',
      githubUrl: data.githubUrl || '',
      order: data.order || 0
    };
    
    // Use findOneAndUpdate to bypass validation if needed
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        // Use this option to bypass validation if needed
        // runValidators: false
      }
    );
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      portfolio
    });
    
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const id = params.id;
    
    const portfolio = await Portfolio.findByIdAndDelete(id);
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
} 
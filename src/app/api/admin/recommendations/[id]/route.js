import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';
import { parseObjectId, readJsonLimited } from '@/lib/serverSecurity';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'recommendation ID');
    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendation' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'recommendation ID');
    const data = await readJsonLimited(request, { maxBytes: 32 * 1024 });
    const recommendation = await Recommendation.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'recommendation ID');
    const recommendation = await Recommendation.findByIdAndDelete(id);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recommendation' },
      { status: 500 }
    );
  }
}

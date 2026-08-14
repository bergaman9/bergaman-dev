import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Recommendation from '@/models/Recommendation';
import { parseObjectId, readJsonLimited } from '@/lib/serverSecurity';
import { revalidateTag } from 'next/cache';

function validateRecommendationMedia(data) {
  const visualCategories = ['movie', 'game', 'book', 'series'];
  if (visualCategories.includes(data.category) && !data.image) return 'A cover image is required for this category';
  if (['music', 'link'].includes(data.category) && !/^https:\/\//.test(data.url || '')) return 'A valid HTTPS destination URL is required';
  if (data.image && !/^(\/|https:\/\/)/.test(data.image)) return 'Image must be a local path or HTTPS URL';
  return null;
}

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
    const mediaError = validateRecommendationMedia(data);
    if (mediaError) return NextResponse.json({ success: false, error: mediaError }, { status: 400 });
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

    revalidateTag('recommendations', 'max');

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

    revalidateTag('recommendations', 'max');

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

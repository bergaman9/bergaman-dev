import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Suggestion from '@/models/Suggestion';
import { parseObjectId, readJsonLimited } from '@/lib/serverSecurity';

export async function PUT(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'suggestion ID');
    await connectDB();

    const data = await readJsonLimited(request, { maxBytes: 16 * 1024 });

    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );

    if (!suggestion) {
      return NextResponse.json(
        { success: false, error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update suggestion' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'suggestion ID');
    await connectDB();

    const suggestion = await Suggestion.findByIdAndDelete(id);

    if (!suggestion) {
      return NextResponse.json(
        { success: false, error: 'Suggestion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Suggestion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete suggestion' },
      { status: 500 }
    );
  }
}

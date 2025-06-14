import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Comment from '../../../../../models/Comment';

// PATCH - Update comment (approve/unapprove)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { approved } = await request.json();
    
    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved },
      { new: true }
    );
    
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE - Delete comment
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const comment = await Comment.findByIdAndDelete(id);
    
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
} 
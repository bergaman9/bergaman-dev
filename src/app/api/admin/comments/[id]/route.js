import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Comment from '../../../../../models/Comment';
import { jsonError, parseObjectId, readJsonLimited } from '../../../../../lib/serverSecurity';

// PATCH - Update comment (approve/unapprove)
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'comment ID');
    const { approved } = await readJsonLimited(request, { maxBytes: 1024 });

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved must be a boolean' }, { status: 400 });
    }

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
    return jsonError(error, 500);
  }
}

// DELETE - Delete comment
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id: rawId } = await params;
    const id = parseObjectId(rawId, 'comment ID');
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return jsonError(error, 500);
  }
}

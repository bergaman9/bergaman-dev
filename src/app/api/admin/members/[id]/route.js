import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const db = await connectDB();
    
    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    const result = await db.collection('members').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid member ID' }, { status: 400 });
    }

    const db = await connectDB();
    
    // Check if member exists and is not the main admin
    const member = await db.collection('members').findOne({ _id: new ObjectId(id) });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Prevent deletion of main admin (you can add more checks here)
    if (member.role === 'admin' && member.email === 'bergaman@admin.com') {
      return NextResponse.json({ error: 'Cannot delete main administrator' }, { status: 403 });
    }

    const result = await db.collection('members').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
} 
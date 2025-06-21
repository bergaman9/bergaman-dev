import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    // Find contact and update all user replies to read
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Mark all user replies as read
    let updated = false;
    if (contact.replies && contact.replies.length > 0) {
      contact.replies.forEach(reply => {
        if (reply.type === 'user' && !reply.read) {
          reply.read = true;
          updated = true;
        }
      });
    }

    if (updated) {
      await contact.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Replies marked as read'
    });

  } catch (error) {
    console.error('Error marking replies as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark replies as read' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import mongoose from 'mongoose';
import { withRateLimit } from '@/lib/rateLimit';

async function handler(request) {
  try {

    const { contactId, message, email } = await request.json();

    if (!contactId || !message?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Contact ID, message, and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create reply object
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      message: message.trim(),
      type: 'user',
      createdAt: new Date(),
      read: false,
      email: email.trim(),
      senderName: contact.name, // Use the original contact name
      ipAddress,
      userAgent
    };

    // Initialize replies array if it doesn't exist
    if (!contact.replies) {
      contact.replies = [];
    }

    // Add reply to contact
    contact.replies.push(newReply);
    contact.lastActivity = new Date();
    contact.status = 'active'; // Reactivate the conversation

    await contact.save();

    // TODO: Send notification email to admin
    // This could be implemented with a service like SendGrid or AWS SES
    
    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      replyId: newReply._id
    });

  } catch (error) {
    console.error('Error adding user reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}

// Export with rate limiting (5 requests per minute)
export const POST = withRateLimit(handler, {
  limit: 5,
  windowMs: 60 * 1000 // 1 minute
}); 
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import mongoose from 'mongoose';
import { withRateLimit } from '@/lib/rateLimit';
import {
  clampString,
  normalizeClientIp,
  parseObjectId,
  readJsonLimited,
  validateEmail,
  verifyContactReplyToken,
} from '@/lib/serverSecurity';

async function handler(request) {
  try {

    const body = await readJsonLimited(request, { maxBytes: 16 * 1024 });
    const token = clampString(body.contactId, 4096);
    const message = clampString(body.message, 5000);
    const email = clampString(body.email, 254).toLowerCase();

    if (!token || !message || !email) {
      return NextResponse.json(
        { success: false, error: 'Contact ID, message, and email are required' },
        { status: 400 }
      );
    }

    const tokenResult = await verifyContactReplyToken(token);
    if (!tokenResult.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reply link' },
        { status: 401 }
      );
    }

    const contactId = tokenResult.contactId;

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    try {
      parseObjectId(contactId, 'contact ID');
    } catch {
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

    if (contact.email?.toLowerCase() !== email) {
      return NextResponse.json(
        { success: false, error: 'Email does not match this conversation' },
        { status: 403 }
      );
    }

    // Get client IP and user agent
    const ipAddress = normalizeClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create reply object
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      message,
      type: 'user',
      createdAt: new Date(),
      read: false,
      email,
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

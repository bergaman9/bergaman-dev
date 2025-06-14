import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import Contact from '../../../../../../models/Contact';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { message, isFromAdmin, senderName, senderEmail } = await request.json();

    if (!message || !senderName || !senderEmail) {
      return NextResponse.json(
        { error: 'Message, sender name, and email are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create reply object
    const reply = {
      message,
      isFromAdmin: isFromAdmin || false,
      senderName,
      senderEmail,
      timestamp: new Date(),
      ipAddress,
      userAgent
    };

    // Add reply to contact
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $push: { replies: reply },
        $set: { 
          status: isFromAdmin ? 'replied' : 'read',
          ...(isFromAdmin && {
            adminReply: message,
            repliedAt: new Date(),
            repliedBy: senderName
          })
        }
      },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Reply added successfully',
      contact
    });

  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function POST(request) {
  try {
    const { contactId, message, senderName, senderEmail } = await request.json();

    if (!contactId || !message || !senderName || !senderEmail) {
      return NextResponse.json(
        { error: 'Contact ID, message, sender name, and email are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the contact exists and the email matches
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Verify sender email matches original contact email
    if (contact.email.toLowerCase() !== senderEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match original contact' },
        { status: 403 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create reply object
    const reply = {
      message,
      isFromAdmin: false,
      senderName,
      senderEmail,
      timestamp: new Date(),
      ipAddress,
      userAgent
    };

    // Add reply to contact
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      {
        $push: { replies: reply },
        $set: { 
          status: 'read' // Mark as read when user replies
        }
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Reply added successfully',
      contact: updatedContact
    });

  } catch (error) {
    console.error('Error adding user reply:', error);
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const { id: contactId } = await params;
    
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact ID' },
        { status: 400 }
      );
    }

    // Find contact
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Return public data only (hide sensitive admin fields)
    const publicContact = {
      _id: contact._id,
      name: contact.name,
      email: contact.email,
      message: contact.message,
      createdAt: contact.createdAt,
      adminReply: contact.adminReply,
      repliedAt: contact.repliedAt,
      replies: contact.replies?.map(reply => ({
        _id: reply._id,
        message: reply.message,
        type: reply.type,
        createdAt: reply.createdAt
      }))
    };

    return NextResponse.json({
      success: true,
      contact: publicContact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
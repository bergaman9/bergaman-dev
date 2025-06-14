import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Newsletter from '../../../../models/Newsletter';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find subscriber
    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in our newsletter list' },
        { status: 404 }
      );
    }

    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json(
        { message: 'You are already unsubscribed from our newsletter' }
      );
    }

    // Update subscriber status
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
} 
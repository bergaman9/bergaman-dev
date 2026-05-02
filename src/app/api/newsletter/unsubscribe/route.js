import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Newsletter from '../../../../models/Newsletter';
import { withRateLimit } from '@/lib/rateLimit';
import { readJsonLimited, validateEmail } from '@/lib/serverSecurity';

async function handler(request) {
  try {
    const { email } = await readJsonLimited(request, { maxBytes: 4 * 1024 });
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 120) : '';

    if (!safeEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!validateEmail(safeEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find subscriber
    const subscriber = await Newsletter.findOne({ email: safeEmail });

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

export const POST = withRateLimit(handler, {
  limit: 5,
  windowMs: 60 * 1000,
});

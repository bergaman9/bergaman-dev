import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import {
  clampString,
  createContactReplyToken,
  getSiteBaseUrl,
  jsonError,
  normalizeClientIp,
  parseObjectId,
  readJsonLimited,
  textToHtml,
} from '@/lib/serverSecurity';
import { brandedEmailShell, emailButton, emailPanel } from '@/lib/emailTemplate';

export async function POST(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseObjectId(rawId);
    const body = await readJsonLimited(request, { maxBytes: 16 * 1024 });
    const message = clampString(body.message, 5000);

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get client IP and user agent
    const ipAddress = normalizeClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create admin reply object
    const reply = {
      _id: new mongoose.Types.ObjectId(),
      message: message.trim(),
      type: 'admin',
      senderName: 'Admin',
      email: process.env.EMAIL_USER || 'admin@bergaman.dev',
      createdAt: new Date(),
      read: true,
      ipAddress,
      userAgent
    };

    // Find and update contact
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Initialize replies array if it doesn't exist
    if (!contact.replies) {
      contact.replies = [];
    }

    // Mark all user replies as read
    contact.replies.forEach(reply => {
      if (reply.type === 'user') {
        reply.read = true;
      }
    });

    // Add admin reply
    contact.replies.push(reply);
    contact.status = 'replied';
    contact.lastActivity = new Date();
    contact.adminReply = message; // Keep for backwards compatibility
    contact.repliedAt = new Date();
    contact.repliedBy = 'Admin';

    await contact.save();

    // Send email notification to user
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const replyToken = await createContactReplyToken(id);
      const replyUrl = `${getSiteBaseUrl()}/contact/reply/${replyToken}`;

      const greetingName = contact.name ? contact.name.split(' ')[0] : 'there';
      const bodyHtml = `
        <p style="margin:0 0 18px 0;font-size:16px;color:#d1d5db;">Hi ${greetingName},</p>
        <p style="margin:0 0 22px 0;font-size:15px;line-height:1.6;color:#9ca3af;">
          You have a new reply from <strong style="color:#e8c547;">Ömer (Bergaman)</strong> in your conversation:
        </p>
        ${emailPanel(`<div style="white-space:pre-wrap;">${textToHtml(message)}</div>`)}
        <div style="text-align:center;margin-top:32px;">
          ${emailButton(replyUrl, '💬 Continue the conversation')}
          <p style="margin:18px 0 0 0;font-size:13px;color:#9ca3af;">
            Please use the button above to reply — email replies are not tracked in the system.
          </p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        replyTo: process.env.EMAIL_USER, // Admin replies should come back to admin
        subject: `Re: Your message to Bergaman — New reply from The Dragon's Domain`,
        html: brandedEmailShell({
          preheaderText: 'You have a new reply from Bergaman.',
          bodyHtml,
        }),
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending reply notification email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      message: 'Reply added successfully',
      contact
    });

  } catch (error) {
    console.error('Error adding reply:', error);
    return jsonError(error, 500);
  }
}

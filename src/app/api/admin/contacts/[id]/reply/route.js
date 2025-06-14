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

    // Send email notification to user if admin replied
    if (isFromAdmin) {
      try {
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const replyUrl = `${process.env.NEXTAUTH_URL || 'https://bergaman.dev'}/contact/reply/${id}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: contact.email,
          replyTo: process.env.EMAIL_USER, // Admin replies should come back to admin
          subject: `Re: Your conversation with Bergaman - New Reply from The Dragon's Domain [ID:${id}]`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0e1b12 0%, #1a2e1a 100%); color: #d1d5db; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #e8c547 0%, #d4b445 100%); padding: 30px 40px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">🐉</div>
                <h1 style="margin: 0; color: #0e1b12; font-size: 28px; font-weight: bold;">Bergaman</h1>
                <p style="margin: 5px 0 0 0; color: #0e1b12; font-size: 14px; opacity: 0.8;">The Dragon's Domain</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px;">
                <div style="background: rgba(46, 61, 41, 0.3); border-left: 4px solid #e8c547; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                  <h2 style="margin: 0 0 15px 0; color: #e8c547; font-size: 20px;">💬 New Reply in Your Conversation</h2>
                  <p style="margin: 0; color: #d1d5db; line-height: 1.6; font-size: 16px;">You have received a new reply from <strong>Ömer (Bergaman)</strong></p>
                </div>
                
                <div style="background: rgba(14, 27, 18, 0.5); padding: 25px; border-radius: 8px; border: 1px solid rgba(62, 80, 62, 0.3); margin-bottom: 30px;">
                  <div style="white-space: pre-wrap; line-height: 1.7; font-size: 15px; color: #d1d5db;">${message.replace(/\n/g, '<br>')}</div>
                </div>

                <!-- Call to Action -->
                <div style="text-align: center; margin-top: 30px;">
                  <p style="margin: 0 0 20px 0; color: #d1d5db;">
                    Continue the conversation by clicking the button below:
                  </p>
                  
                  <a href="${replyUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #e8c547 0%, #d4b445 100%); color: #0e1b12; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 10px;">
                    💬 Continue Conversation
                  </a>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #9ca3af;">
                    Or reply directly to this email
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: rgba(14, 27, 18, 0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(62, 80, 62, 0.3);">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  This message is from 
                  <a href="https://bergaman.dev" style="color: #e8c547; text-decoration: none;">Ömer Güler (Bergaman)</a>
                </p>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #6b7280;">
                  Electrical Electronics Engineer | Full Stack Developer | The Dragon's Domain
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending reply notification email:', emailError);
        // Don't fail the whole request if email fails
      }
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
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectDB } from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { withRateLimit } from '@/lib/rateLimit';
import { detectContactSpam } from '@/lib/contactSpam';
import { escapeHtml, normalizeClientIp, readJsonLimited, textToHtml, validateEmail } from '@/lib/serverSecurity';

async function handler(request) {
  try {
    await connectDB();

    const body = await readJsonLimited(request, { maxBytes: 16 * 1024 });
    const { name, email, message } = body;
    const safeName = typeof name === 'string' ? name.trim().slice(0, 80) : '';
    const safeEmail = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 120) : '';
    const safeMessage = typeof message === 'string' ? message.trim().slice(0, 5000) : '';

    // Validate required fields
    if (!safeName || !safeEmail || !safeMessage) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(safeEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get client info from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const clientIp = normalizeClientIp(request);
    const referer = request.headers.get('referer') || 'Direct';

    const spamCheck = detectContactSpam(
      {
        ...body,
        name: safeName,
        email: safeEmail,
        message: safeMessage,
      },
      { clientIp }
    );

    if (spamCheck.blocked) {
      console.warn('Blocked contact form submission', {
        reasons: spamCheck.reasons,
        ipAddress: clientIp,
      });

      return NextResponse.json(
        { error: 'Message could not be processed. Please try another contact method.' },
        { status: 400 }
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const sameIpSubmissions = clientIp === 'unknown'
      ? 0
      : await Contact.countDocuments({
        ipAddress: clientIp,
        createdAt: { $gte: oneHourAgo },
      });

    if (sameIpSubmissions >= 3) {
      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429 }
      );
    }

    const duplicateWindow = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const duplicateMessage = await Contact.exists({
      name: safeName,
      email: safeEmail,
      message: safeMessage,
      createdAt: { $gte: duplicateWindow },
    });

    if (duplicateMessage) {
      return NextResponse.json(
        { error: 'This message was already received.' },
        { status: 409 }
      );
    }

    // Get current timestamp
    const timestamp = new Date().toLocaleString('tr-TR', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const contactMessage = new Contact({
      name: safeName,
      email: safeEmail,
      message: safeMessage,
      ipAddress: clientIp,
      userAgent,
      referrer: referer,
      timestamp: new Date()
    });

    await contactMessage.save();

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError.message);
      // Continue anyway, sometimes verify fails but sending works
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'omerguler53@gmail.com', // Ana email adresiniz
      replyTo: safeEmail, // Set reply-to to the original sender
      subject: `New Contact Message from ${safeName} - Bergaman Portfolio [ID:${contactMessage._id}]`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0e1b12 0%, #1a2e1a 100%); color: #d1d5db; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #e8c547 0%, #d4b445 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #0e1b12; font-size: 28px; font-weight: bold;">
              🐉 Bergaman Portfolio
            </h1>
            <p style="margin: 10px 0 0 0; color: #0e1b12; font-size: 16px; opacity: 0.8;">
              New Contact Message Received
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">

            <!-- Message Info -->
            <div style="background: rgba(46, 61, 41, 0.3); border: 1px solid rgba(62, 80, 62, 0.3); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #e8c547; font-size: 20px; border-bottom: 2px solid #e8c547; padding-bottom: 10px;">
                📧 Message Details
              </h2>

              <div style="margin-bottom: 15px;">
                <strong style="color: #e8c547;">From:</strong>
                <span style="color: #d1d5db; margin-left: 10px;">${escapeHtml(safeName)}</span>
              </div>

              <div style="margin-bottom: 15px;">
                <strong style="color: #e8c547;">Email:</strong>
                <a href="mailto:${encodeURIComponent(safeEmail)}" style="color: #60a5fa; text-decoration: none; margin-left: 10px;">${escapeHtml(safeEmail)}</a>
              </div>

              <div style="margin-bottom: 20px;">
                <strong style="color: #e8c547;">Received:</strong>
                <span style="color: #d1d5db; margin-left: 10px;">${timestamp}</span>
              </div>

              <div>
                <strong style="color: #e8c547; display: block; margin-bottom: 10px;">Message:</strong>
                <div style="background: rgba(14, 27, 18, 0.5); border-left: 4px solid #e8c547; padding: 15px; border-radius: 4px; line-height: 1.6;">
                  ${textToHtml(safeMessage)}
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div style="background: rgba(46, 61, 41, 0.2); border: 1px solid rgba(62, 80, 62, 0.2); border-radius: 8px; padding: 20px;">
              <h3 style="margin: 0 0 15px 0; color: #60a5fa; font-size: 16px;">
                🔧 Technical Information
              </h3>

              <div style="display: grid; gap: 8px; font-size: 12px; color: #9ca3af;">
                <div>
                  <strong style="color: #d1d5db;">IP Address:</strong>
                  <span style="margin-left: 10px; font-family: monospace; background: rgba(14, 27, 18, 0.5); padding: 2px 6px; border-radius: 3px;">${clientIp}</span>
                </div>

                <div>
                  <strong style="color: #d1d5db;">User Agent:</strong>
                  <span style="margin-left: 10px; font-family: monospace; background: rgba(14, 27, 18, 0.5); padding: 2px 6px; border-radius: 3px; word-break: break-all;">${escapeHtml(userAgent)}</span>
                </div>

                <div>
                  <strong style="color: #d1d5db;">Referrer:</strong>
                  <span style="margin-left: 10px; font-family: monospace; background: rgba(14, 27, 18, 0.5); padding: 2px 6px; border-radius: 3px;">${escapeHtml(referer)}</span>
                </div>

                <div>
                  <strong style="color: #d1d5db;">Source:</strong>
                  <span style="margin-left: 10px; color: #e8c547;">Bergaman Portfolio Contact Form</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${encodeURIComponent(safeEmail)}?subject=Re: Your message to Bergaman&body=Hi ${encodeURIComponent(safeName)},%0D%0A%0D%0AThank you for reaching out! "
                 style="display: inline-block; background: linear-gradient(135deg, #e8c547 0%, #d4b445 100%); color: #0e1b12; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px;">
                Reply to ${escapeHtml(safeName)}
              </a>

              <a href="https://bergaman.dev/admin/contacts"
                 style="display: inline-block; background: linear-gradient(135deg, #2e3d29 0%, #1a2e1a 100%); color: #e8c547; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px; border: 1px solid #e8c547;">
                🛠️ Admin Panel
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: rgba(14, 27, 18, 0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(62, 80, 62, 0.3);">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              This message was sent from the contact form on
              <a href="https://bergaman.dev" style="color: #e8c547; text-decoration: none;">bergaman.dev</a>
            </p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #6b7280;">
              Bergaman - The Dragon's Domain | Technical Solutions & Development
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error.message);

    // Return more specific error messages
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    if (error.code === 'EAUTH' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Email service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handler, {
  limit: 5,
  windowMs: 60 * 1000,
});

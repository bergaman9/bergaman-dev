import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Newsletter from '../../../../models/Newsletter';

export async function POST(request) {
  try {
    const { email, name, preferences } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = null;
        existingSubscriber.name = name || existingSubscriber.name;
        existingSubscriber.preferences = preferences || existingSubscriber.preferences;
        existingSubscriber.ipAddress = ipAddress;
        existingSubscriber.userAgent = userAgent;
        existingSubscriber.referrer = referrer;
        
        await existingSubscriber.save();
        
        return NextResponse.json({
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name,
            status: existingSubscriber.status
          }
        });
      }
    }

    // Create new subscriber
    const subscriber = new Newsletter({
      email: email.toLowerCase(),
      name: name || '',
      status: 'active',
      source: 'website',
      ipAddress,
      userAgent,
      referrer,
      preferences: preferences || {
        frequency: 'weekly',
        categories: ['tech', 'projects']
      }
    });

    await subscriber.save();

    // Send welcome email (optional)
    try {
            const nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Bergaman\'s Newsletter - The Dragon\'s Domain',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%); color: #e2e8f0; border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 40px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 8px;">🐉</div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Welcome to the Dragon's Domain</h1>
              <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Bergaman's Newsletter</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <h2 style="color: #e8c547; font-size: 24px; margin-bottom: 20px;">🎉 Welcome ${name || 'Fellow Developer'}!</h2>
              
              <p style="color: #e2e8f0; line-height: 1.6; margin-bottom: 20px;">
                Thank you for subscribing to my newsletter! You'll receive updates about:
              </p>
              
              <ul style="color: #e2e8f0; line-height: 1.8; margin-bottom: 30px;">
                <li>🤖 AI & Machine Learning projects</li>
                <li>⛓️ Blockchain development insights</li>
                <li>💻 Full-stack development tutorials</li>
                <li>🚀 Latest project updates and releases</li>
                <li>📚 Tech tips and best practices</li>
              </ul>
              
              <div style="background: rgba(79, 70, 229, 0.1); border-left: 4px solid #4f46e5; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #e2e8f0; font-style: italic;">
                  "Technology is best when it brings people together and solves real problems." - Bergaman
                </p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://bergaman.dev" 
                   style="display: inline-block; background: linear-gradient(135deg, #e8c547 0%, #f59e0b 100%); color: #1e1b4b; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  🌐 Visit My Portfolio
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: rgba(30, 27, 75, 0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(79, 70, 229, 0.3);">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                You're receiving this because you subscribed to Bergaman's newsletter.
              </p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #64748b;">
                AI & Blockchain Developer | Full Stack Engineer | The Dragon's Domain
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter! Welcome to the Dragon\'s Domain.',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        status: subscriber.status
      }
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
} 
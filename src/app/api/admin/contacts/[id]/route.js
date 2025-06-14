import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Contact from '../../../../../models/Contact';
import nodemailer from 'nodemailer';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    return NextResponse.json(contact);

  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status, adminReply } = await request.json();

    const contact = await Contact.findById(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update contact
    if (status) {
      contact.status = status;
    }

    if (adminReply) {
      contact.adminReply = adminReply;
      contact.status = 'replied';
      contact.repliedAt = new Date();
      contact.repliedBy = 'Admin'; // You can make this dynamic based on logged in user
    }

    await contact.save();

    // If replying, send email to user
    if (adminReply) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: `Re: Your message to Bergaman - Response from The Dragon's Domain`,
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
                  <h2 style="margin: 0 0 15px 0; color: #e8c547; font-size: 20px;">Reply to Your Message</h2>
                  <p style="margin: 0; color: #d1d5db; line-height: 1.6; font-size: 16px;">This is a personal response from <strong>Ömer</strong>, Electrical & Electronics Engineer</p>
                </div>
                
                <div style="background: rgba(14, 27, 18, 0.5); padding: 25px; border-radius: 8px; border: 1px solid rgba(62, 80, 62, 0.3); margin-bottom: 30px;">
                  <div style="white-space: pre-wrap; line-height: 1.7; font-size: 15px; color: #d1d5db;">${adminReply.replace(/\n/g, '<br>').replace(/\n/g, '<br>')}</div>
                </div>

                <!-- Original Message Reference -->
                <div style="background: rgba(46, 61, 41, 0.2); border: 1px solid rgba(62, 80, 62, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                  <h4 style="margin: 0 0 15px 0; color: #60a5fa; font-size: 16px;">
                    📝 Your Original Message
                  </h4>
                  <div style="font-size: 14px; color: #9ca3af; line-height: 1.6; font-style: italic;">
                    "${contact.message.substring(0, 200)}${contact.message.length > 200 ? '...' : ''}"
                  </div>
                  <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                    Sent on: ${new Date(contact.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <!-- Call to Action -->
                <div style="text-align: center; margin-top: 30px;">
                  <p style="margin: 0 0 20px 0; color: #d1d5db;">
                    Feel free to reply to this email if you have any follow-up questions!
                  </p>
                  
                  <a href="mailto:omerguler53@gmail.com?subject=Re: Response from Bergaman&body=Hi Ömer,%0D%0A%0D%0A" 
                     style="display: inline-block; background: linear-gradient(135deg, #e8c547 0%, #d4b445 100%); color: #0e1b12; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px;">
                    📧 Reply to This Message
                  </a>
                  
                  <a href="https://bergaman.dev" 
                     style="display: inline-block; background: linear-gradient(135deg, #2e3d29 0%, #1a2e1a 100%); color: #e8c547; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px; border: 1px solid #e8c547;">
                    🌐 Visit My Portfolio
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: rgba(14, 27, 18, 0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(62, 80, 62, 0.3);">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  This is a personal response from 
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
        console.error('Error sending reply email:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json(contact);

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Contact deleted successfully' });

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
} 
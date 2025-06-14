import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function POST(request) {
  try {
    console.log('Email webhook received');
    
    // Parse the incoming email data
    const body = await request.text();
    console.log('Webhook body:', body);
    
    // Try to parse as JSON first (for services like SendGrid, Mailgun)
    let emailData;
    try {
      emailData = JSON.parse(body);
    } catch (e) {
      // If not JSON, try to parse as form data (for services like Postmark)
      const formData = new URLSearchParams(body);
      emailData = {
        from: formData.get('From') || formData.get('from'),
        to: formData.get('To') || formData.get('to'),
        subject: formData.get('Subject') || formData.get('subject'),
        text: formData.get('TextBody') || formData.get('text') || formData.get('body-plain'),
        html: formData.get('HtmlBody') || formData.get('html') || formData.get('body-html'),
        messageId: formData.get('MessageID') || formData.get('message-id'),
        inReplyTo: formData.get('In-Reply-To') || formData.get('in-reply-to'),
        references: formData.get('References') || formData.get('references')
      };
    }

    console.log('Parsed email data:', emailData);

    // Extract sender information
    const fromEmail = extractEmail(emailData.from);
    const fromName = extractName(emailData.from) || fromEmail;
    const subject = emailData.subject || '';
    const message = emailData.text || emailData.html || '';

    console.log('Extracted info:', { fromEmail, fromName, subject });

    if (!fromEmail || !message) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Skip if it's from our own email (to prevent loops)
    if (fromEmail.toLowerCase() === process.env.EMAIL_USER?.toLowerCase()) {
      console.log('Skipping email from self');
      return NextResponse.json({ message: 'Email from self, skipping' });
    }

    await connectDB();

    // Try to extract contact ID from subject line
    let contactId = null;
    const idMatch = subject.match(/\[ID:([a-f0-9]{24})\]/i);
    if (idMatch) {
      contactId = idMatch[1];
      console.log('Found contact ID in subject:', contactId);
    }

    // Try to find existing contact by ID first, then by email
    let contact = null;
    if (contactId) {
      contact = await Contact.findById(contactId);
      console.log('Found contact by ID:', contact ? contact._id : 'not found');
    }
    
    if (!contact) {
      contact = await Contact.findOne({ 
        email: { $regex: new RegExp(fromEmail, 'i') } 
      }).sort({ createdAt: -1 });
      console.log('Found contact by email:', contact ? contact._id : 'not found');
    }

    if (contact) {
      console.log('Found existing contact:', contact._id);
      
      // Add reply to existing contact
      const reply = {
        message: cleanEmailMessage(message),
        isFromAdmin: false,
        senderName: fromName,
        senderEmail: fromEmail,
        timestamp: new Date(),
        ipAddress: 'email-webhook',
        userAgent: 'email-client'
      };

      await Contact.findByIdAndUpdate(
        contact._id,
        {
          $push: { replies: reply },
          $set: { status: 'read' }
        }
      );

      console.log('Added reply to existing contact');
    } else {
      console.log('Creating new contact from email');
      
      // Create new contact if none exists
      contact = new Contact({
        name: fromName,
        email: fromEmail,
        message: cleanEmailMessage(message),
        status: 'new',
        ipAddress: 'email-webhook',
        userAgent: 'email-client',
        referrer: 'email-reply'
      });

      await contact.save();
      console.log('Created new contact:', contact._id);
    }

    // Send notification to admin (optional)
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const adminNotification = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `🔔 New Email Reply from ${fromName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e8c547;">New Email Reply Received</h2>
            <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${cleanEmailMessage(message)}</pre>
            </div>
            <p><a href="${process.env.NEXTAUTH_URL || 'https://bergaman.dev'}/admin/contacts" style="background: #e8c547; color: #0e1b12; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
          </div>
        `
      };

      await transporter.sendMail(adminNotification);
      console.log('Admin notification sent');
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    return NextResponse.json({ 
      message: 'Email processed successfully',
      contactId: contact._id 
    });

  } catch (error) {
    console.error('Error processing email webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}

// Helper function to extract email from "Name <email@domain.com>" format
function extractEmail(fromString) {
  if (!fromString) return null;
  
  const emailMatch = fromString.match(/<([^>]+)>/);
  if (emailMatch) {
    return emailMatch[1];
  }
  
  // If no angle brackets, assume the whole string is an email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = fromString.match(emailRegex);
  return match ? match[0] : fromString;
}

// Helper function to extract name from "Name <email@domain.com>" format
function extractName(fromString) {
  if (!fromString) return null;
  
  const nameMatch = fromString.match(/^([^<]+)</);
  if (nameMatch) {
    return nameMatch[1].trim().replace(/"/g, '');
  }
  
  // If no angle brackets, try to extract name before @
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  if (!emailRegex.test(fromString)) {
    return fromString; // Assume it's a name
  }
  
  return null;
}

// Helper function to clean email message content
function cleanEmailMessage(message) {
  if (!message) return '';
  
  // Remove HTML tags if it's HTML content
  let cleaned = message.replace(/<[^>]*>/g, '');
  
  // Remove email signatures and quoted text
  const lines = cleaned.split('\n');
  const cleanedLines = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Stop at common email signature indicators
    if (
      trimmedLine.startsWith('--') ||
      trimmedLine.startsWith('___') ||
      trimmedLine.startsWith('From:') ||
      trimmedLine.startsWith('Sent:') ||
      trimmedLine.startsWith('To:') ||
      trimmedLine.startsWith('Subject:') ||
      trimmedLine.includes('wrote:') ||
      trimmedLine.includes('On ') && trimmedLine.includes(' at ') && trimmedLine.includes(' wrote:')
    ) {
      break;
    }
    
    cleanedLines.push(line);
  }
  
  return cleanedLines.join('\n').trim();
}

// Allow GET for webhook verification (some services require this)
export async function GET(request) {
  const url = new URL(request.url);
  const challenge = url.searchParams.get('challenge');
  
  if (challenge) {
    return new Response(challenge);
  }
  
  return NextResponse.json({ message: 'Email webhook endpoint is active' });
} 
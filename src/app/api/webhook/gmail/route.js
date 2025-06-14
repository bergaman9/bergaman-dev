import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request) {
  try {
    console.log('Gmail webhook received');
    
    // Connect to database
    await connectDB();
    
    // Parse the forwarded email content
    const body = await request.text();
    console.log('Gmail forward body:', body);
    
    // Extract email data from Gmail forward format
    const emailData = parseGmailForward(body);
    
    if (!emailData) {
      return NextResponse.json(
        { error: 'Could not parse email data' },
        { status: 400 }
      );
    }
    
    // Extract contact ID from subject
    const contactId = extractContactId(emailData.subject);
    
    let contact;
    
    if (contactId) {
      // Find contact by ID
      contact = await Contact.findById(contactId);
      console.log('Found contact by ID:', contactId);
    }
    
    if (!contact && emailData.from) {
      // Fallback: find by email
      const emailMatch = emailData.from.match(/<(.+?)>/) || [null, emailData.from];
      const senderEmail = emailMatch[1] || emailData.from;
      
      contact = await Contact.findOne({ email: senderEmail });
      console.log('Found contact by email:', senderEmail);
    }
    
    if (!contact) {
      // Create new contact
      contact = new Contact({
        name: extractNameFromEmail(emailData.from),
        email: extractEmailFromString(emailData.from),
        message: 'Initial contact via email reply',
        replies: []
      });
      console.log('Created new contact');
    }
    
    // Clean email content
    const cleanContent = cleanEmailContent(emailData.text || emailData.html || '');
    
    // Add reply to contact
    const reply = {
      message: cleanContent,
      timestamp: new Date(),
      isFromUser: true,
      metadata: {
        source: 'gmail_forward',
        originalSubject: emailData.subject,
        userAgent: request.headers.get('user-agent') || 'Gmail Forward',
        ipAddress: getClientIP(request)
      }
    };
    
    contact.replies = contact.replies || [];
    contact.replies.push(reply);
    contact.status = 'replied';
    contact.lastReplyAt = new Date();
    
    await contact.save();
    console.log('Reply added to contact');
    
    return NextResponse.json({
      success: true,
      message: 'Email reply processed successfully',
      contactId: contact._id,
      replyCount: contact.replies.length
    });
    
  } catch (error) {
    console.error('Gmail webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}

function parseGmailForward(body) {
  try {
    // Gmail forward format parsing
    const lines = body.split('\n');
    const emailData = {};
    
    // Look for forwarded message markers
    let inForwardedContent = false;
    let contentLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect forwarded message start
      if (line.includes('---------- Forwarded message') || 
          line.includes('Begin forwarded message') ||
          line.includes('From:') && line.includes('@')) {
        inForwardedContent = true;
        continue;
      }
      
      if (inForwardedContent) {
        // Extract headers
        if (line.startsWith('From:')) {
          emailData.from = line.replace('From:', '').trim();
        } else if (line.startsWith('Subject:')) {
          emailData.subject = line.replace('Subject:', '').trim();
        } else if (line.startsWith('To:')) {
          emailData.to = line.replace('To:', '').trim();
        } else if (line === '' && emailData.from) {
          // Empty line after headers, content starts
          contentLines = lines.slice(i + 1);
          break;
        }
      }
    }
    
    emailData.text = contentLines.join('\n').trim();
    
    return emailData.from ? emailData : null;
    
  } catch (error) {
    console.error('Error parsing Gmail forward:', error);
    return null;
  }
}

function extractContactId(subject) {
  if (!subject) return null;
  
  const match = subject.match(/\[ID:([a-f0-9]{24})\]/i);
  return match ? match[1] : null;
}

function extractNameFromEmail(fromString) {
  if (!fromString) return 'Unknown';
  
  // Extract name from "Name <email>" format
  const nameMatch = fromString.match(/^(.+?)\s*</);
  if (nameMatch) {
    return nameMatch[1].trim().replace(/['"]/g, '');
  }
  
  // Fallback to email username
  const emailMatch = fromString.match(/([^@]+)@/);
  return emailMatch ? emailMatch[1] : 'Unknown';
}

function extractEmailFromString(fromString) {
  if (!fromString) return '';
  
  const emailMatch = fromString.match(/<(.+?)>/) || fromString.match(/([^\s]+@[^\s]+)/);
  return emailMatch ? emailMatch[1] : fromString;
}

function cleanEmailContent(content) {
  if (!content) return '';
  
  // Remove HTML tags
  let cleaned = content.replace(/<[^>]*>/g, '');
  
  // Remove common email signatures
  cleaned = cleaned.replace(/--\s*\n[\s\S]*$/m, '');
  cleaned = cleaned.replace(/Sent from my \w+/gi, '');
  
  // Remove quoted text (lines starting with >)
  cleaned = cleaned.replace(/^>.*$/gm, '');
  
  // Remove forwarded message headers
  cleaned = cleaned.replace(/---------- Forwarded message.*$/gm, '');
  cleaned = cleaned.replace(/Begin forwarded message:.*$/gm, '');
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
} 
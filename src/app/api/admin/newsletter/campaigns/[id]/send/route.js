import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../../lib/mongodb';
import NewsletterCampaign from '../../../../../../../models/NewsletterCampaign';
import Newsletter from '../../../../../../../models/Newsletter';
import { marked } from 'marked';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    // Get campaign
    const campaign = await NewsletterCampaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json(
        { error: 'Campaign has already been sent or is not in draft status' },
        { status: 400 }
      );
    }

    // Get target subscribers
    let audienceQuery = { status: 'active' };
    if (campaign.targetAudience?.status === 'active') {
      audienceQuery.status = 'active';
    }

    const subscribers = await Newsletter.find(audienceQuery);

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    // Update campaign status
    campaign.status = 'sending';
    campaign.recipients.total = subscribers.length;
    await campaign.save();

    // Send emails
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Convert markdown to HTML
      const htmlContent = marked(campaign.content);

      let sentCount = 0;
      let failedCount = 0;

      // Send emails in batches to avoid rate limiting
      const batchSize = 10;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const emailPromises = batch.map(async (subscriber) => {
          try {
            const unsubscribeUrl = `${process.env.NEXTAUTH_URL || 'https://bergaman.dev'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: subscriber.email,
              subject: campaign.subject,
              html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>${campaign.subject}</title>
                  <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    body {
                      margin: 0;
                      padding: 0;
                      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                      background-color: #f5f5f5;
                      color: #333;
                      line-height: 1.6;
                    }
                    
                    .email-container {
                      max-width: 600px;
                      margin: 0 auto;
                      background: linear-gradient(135deg, #0e1b12 0%, #1a2e1a 100%);
                      border-radius: 16px;
                      overflow: hidden;
                      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
                      border: 1px solid rgba(232, 197, 71, 0.2);
                    }
                    
                    .email-header {
                      background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%);
                      padding: 40px 30px;
                      text-align: center;
                      position: relative;
                    }
                    
                    .email-header::after {
                      content: '';
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      height: 6px;
                      background: linear-gradient(90deg, #e8c547 0%, #d4b445 100%);
                    }
                    
                    .logo {
                      font-size: 42px;
                      margin-bottom: 10px;
                    }
                    
                    .header-title {
                      margin: 0;
                      color: white;
                      font-size: 32px;
                      font-weight: 700;
                      letter-spacing: -0.5px;
                    }
                    
                    .header-subtitle {
                      margin: 5px 0 0;
                      color: rgba(255, 255, 255, 0.8);
                      font-size: 16px;
                      font-weight: 500;
                    }
                    
                    .email-content {
                      padding: 40px 30px;
                      color: #e2e8f0;
                      font-size: 16px;
                      line-height: 1.7;
                    }
                    
                    .email-content h1, 
                    .email-content h2, 
                    .email-content h3 {
                      color: #e8c547;
                      margin-top: 30px;
                      margin-bottom: 15px;
                    }
                    
                    .email-content h1 {
                      font-size: 26px;
                    }
                    
                    .email-content h2 {
                      font-size: 22px;
                    }
                    
                    .email-content h3 {
                      font-size: 18px;
                    }
                    
                    .email-content p {
                      margin-bottom: 20px;
                    }
                    
                    .email-content a {
                      color: #e8c547;
                      text-decoration: underline;
                      font-weight: 500;
                    }
                    
                    .email-content ul, 
                    .email-content ol {
                      margin-bottom: 20px;
                      padding-left: 20px;
                    }
                    
                    .email-content li {
                      margin-bottom: 8px;
                    }
                    
                    .email-content img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 8px;
                      margin: 20px 0;
                    }
                    
                    .email-content blockquote {
                      border-left: 4px solid #e8c547;
                      padding-left: 15px;
                      margin-left: 0;
                      font-style: italic;
                      color: #94a3b8;
                    }
                    
                    .email-content code {
                      background-color: rgba(0, 0, 0, 0.2);
                      padding: 2px 5px;
                      border-radius: 4px;
                      font-family: monospace;
                    }
                    
                    .email-content pre {
                      background-color: rgba(0, 0, 0, 0.2);
                      padding: 15px;
                      border-radius: 8px;
                      overflow-x: auto;
                      font-family: monospace;
                    }
                    
                    .email-footer {
                      background-color: rgba(30, 27, 75, 0.8);
                      padding: 30px;
                      text-align: center;
                      border-top: 1px solid rgba(232, 197, 71, 0.2);
                    }
                    
                    .footer-text {
                      margin: 0;
                      font-size: 14px;
                      color: #94a3b8;
                    }
                    
                    .footer-links {
                      margin: 15px 0 0;
                      font-size: 13px;
                      color: #64748b;
                    }
                    
                    .footer-links a {
                      color: #64748b;
                      text-decoration: underline;
                      margin: 0 8px;
                    }
                    
                    .social-icons {
                      margin-top: 20px;
                    }
                    
                    .social-icon {
                      display: inline-block;
                      margin: 0 8px;
                      color: #94a3b8;
                      font-size: 18px;
                      text-decoration: none;
                    }
                    
                    .btn {
                      display: inline-block;
                      background: linear-gradient(90deg, #e8c547 0%, #d4b445 100%);
                      color: #0e1b12 !important;
                      text-decoration: none !important;
                      padding: 12px 24px;
                      border-radius: 8px;
                      font-weight: 600;
                      margin: 20px 0;
                      text-align: center;
                    }
                    
                    @media only screen and (max-width: 600px) {
                      .email-container {
                        border-radius: 0;
                      }
                      
                      .email-header {
                        padding: 30px 20px;
                      }
                      
                      .email-content {
                        padding: 30px 20px;
                      }
                      
                      .email-footer {
                        padding: 20px;
                      }
                      
                      .header-title {
                        font-size: 28px;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="email-container">
                    ${campaign.template.settings.includeHeader ? `
                    <div class="email-header">
                      <div class="logo">🐉</div>
                      <h1 class="header-title">Bergaman's Newsletter</h1>
                      <p class="header-subtitle">The Dragon's Domain</p>
                    </div>
                    ` : ''}
                    
                    <div class="email-content">
                      ${htmlContent}
                    </div>
                    
                    ${campaign.template.settings.includeFooter ? `
                    <div class="email-footer">
                      <p class="footer-text">
                        You're receiving this because you subscribed to Bergaman's newsletter.
                      </p>
                      <p class="footer-links">
                        <a href="${unsubscribeUrl}">Unsubscribe</a> | 
                        <a href="https://bergaman.dev">Visit Website</a>
                      </p>
                      <div class="social-icons">
                        <a href="https://twitter.com/bergaman" class="social-icon">
                          <span>𝕏</span>
                        </a>
                        <a href="https://github.com/bergaman" class="social-icon">
                          <span>GitHub</span>
                        </a>
                        <a href="https://linkedin.com/in/bergaman" class="social-icon">
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
                    ` : ''}
                  </div>
                </body>
                </html>
              `,
            };

            await transporter.sendMail(mailOptions);
            sentCount++;
          } catch (error) {
            console.error(`Failed to send email to ${subscriber.email}:`, error);
            failedCount++;
          }
        });

        await Promise.all(emailPromises);
        
        // Add delay between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Update campaign with results
      campaign.status = 'sent';
      campaign.sentAt = new Date();
      campaign.recipients.sent = sentCount;
      campaign.recipients.failed = failedCount;
      await campaign.save();

      return NextResponse.json({
        message: 'Campaign sent successfully',
        results: {
          total: subscribers.length,
          sent: sentCount,
          failed: failedCount
        }
      });

    } catch (emailError) {
      console.error('Error sending campaign emails:', emailError);
      
      // Update campaign status to failed
      campaign.status = 'failed';
      await campaign.save();
      
      return NextResponse.json(
        { error: 'Failed to send campaign emails' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
} 
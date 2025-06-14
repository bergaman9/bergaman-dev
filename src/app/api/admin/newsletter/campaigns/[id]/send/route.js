import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../../lib/mongodb';
import NewsletterCampaign from '../../../../../../../models/NewsletterCampaign';
import Newsletter from '../../../../../../../models/Newsletter';
import { marked } from 'marked';

export async function POST(request, { params }) {
  try {
    const { id } = params;

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
      
      const transporter = nodemailer.createTransporter({
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
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%); color: #e2e8f0; border-radius: 12px; overflow: hidden;">
                  
                  ${campaign.template.settings.includeHeader ? `
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, ${campaign.template.settings.headerColor} 0%, ${campaign.template.settings.accentColor} 100%); padding: 30px 40px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🐉</div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Bergaman's Newsletter</h1>
                    <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">The Dragon's Domain</p>
                  </div>
                  ` : ''}
                  
                  <!-- Content -->
                  <div style="padding: 40px;">
                    <div style="color: #e2e8f0; line-height: 1.6;">
                      ${htmlContent}
                    </div>
                  </div>

                  ${campaign.template.settings.includeFooter ? `
                  <!-- Footer -->
                  <div style="background: rgba(30, 27, 75, 0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(79, 70, 229, 0.3);">
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      You're receiving this because you subscribed to Bergaman's newsletter.
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 11px; color: #64748b;">
                      <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> | 
                      <a href="https://bergaman.dev" style="color: #64748b; text-decoration: underline;">Visit Website</a>
                    </p>
                  </div>
                  ` : ''}
                </div>
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
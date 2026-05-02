import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import NewsletterCampaign from '../../../../../models/NewsletterCampaign';
import Newsletter from '../../../../../models/Newsletter';
import { clampString, jsonError, readJsonLimited, validateEnum } from '../../../../../lib/serverSecurity';

const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'failed'];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit'), 10) || 20));
    const status = searchParams.get('status');

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = validateEnum(status, CAMPAIGN_STATUSES, 'status');
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch campaigns with pagination
    const campaigns = await NewsletterCampaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await NewsletterCampaign.countDocuments(query);

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter campaigns:', error);
    return jsonError(error, 500);
  }
}

export async function POST(request) {
  try {
    const campaignData = await readJsonLimited(request, { maxBytes: 128 * 1024 });
    campaignData.title = clampString(campaignData.title, 160);
    campaignData.subject = clampString(campaignData.subject, 200);

    if (!campaignData.title || !campaignData.subject || !campaignData.content) {
      return NextResponse.json(
        { error: 'Title, subject, and content are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Count target audience
    let audienceQuery = {};
    if (campaignData.targetAudience?.status === 'active') {
      audienceQuery.status = 'active';
    }

    const targetCount = await Newsletter.countDocuments(audienceQuery);

    // Create campaign
    const campaign = new NewsletterCampaign({
      ...campaignData,
      recipients: {
        total: targetCount,
        sent: 0,
        failed: 0,
        opened: 0,
        clicked: 0
      }
    });

    await campaign.save();

    return NextResponse.json({
      message: 'Campaign created successfully',
      campaign
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    return jsonError(error, 500);
  }
}

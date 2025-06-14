import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import NewsletterCampaign from '../../../../../models/NewsletterCampaign';
import Newsletter from '../../../../../models/Newsletter';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');

    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
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
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const campaignData = await request.json();

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
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 
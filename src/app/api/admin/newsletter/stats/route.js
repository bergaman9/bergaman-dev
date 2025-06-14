import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import Newsletter from '../../../../../models/Newsletter';
import NewsletterCampaign from '../../../../../models/NewsletterCampaign';

export async function GET() {
  try {
    await connectDB();

    // Get subscriber statistics
    const subscriberStats = await Newsletter.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = subscriberStats.find(s => s._id === 'active')?.count || 0;
    const unsubscribed = subscriberStats.find(s => s._id === 'unsubscribed')?.count || 0;

    // Get campaign statistics
    const campaignStats = await NewsletterCampaign.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const campaignsSent = campaignStats.find(s => s._id === 'sent')?.count || 0;
    const totalCampaigns = await NewsletterCampaign.countDocuments();

    // Calculate open rate (simplified calculation)
    const sentCampaigns = await NewsletterCampaign.find({ status: 'sent' });
    let totalSent = 0;
    let totalOpened = 0;

    sentCampaigns.forEach(campaign => {
      totalSent += campaign.recipients?.sent || 0;
      totalOpened += campaign.recipients?.opened || 0;
    });

    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) + '%' : '0%';

    // Recent activity
    const recentSubscribers = await Newsletter.find({ status: 'active' })
      .sort({ subscribedAt: -1 })
      .limit(5)
      .select('email name subscribedAt')
      .lean();

    const recentCampaigns = await NewsletterCampaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt recipients')
      .lean();

    return NextResponse.json({
      statistics: {
        totalSubscribers,
        activeSubscribers,
        unsubscribed,
        campaignsSent,
        totalCampaigns,
        openRate,
        recentSubscribers,
        recentCampaigns
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 
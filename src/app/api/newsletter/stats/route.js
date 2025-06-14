import { connectDB } from '../../../../lib/mongodb';
import Newsletter from '../../../../models/Newsletter';

export async function GET() {
  try {
    await connectDB();
    
    const totalSubscribers = await Newsletter.countDocuments({ status: 'active' });
    const totalUnsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });
    const totalBounced = await Newsletter.countDocuments({ status: 'bounced' });
    
    return Response.json({
      success: true,
      stats: {
        totalSubscribers,
        totalUnsubscribed,
        totalBounced,
        totalAll: totalSubscribers + totalUnsubscribed + totalBounced
      }
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch newsletter stats' },
      { status: 500 }
    );
  }
} 
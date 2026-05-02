import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';
import {
  clampString,
  createContactReplyToken,
  createSafeRegex,
  getSiteBaseUrl,
  jsonError,
  validateEnum,
} from '../../../../lib/serverSecurity';

const CONTACT_STATUSES = ['new', 'read', 'replied', 'active', 'closed'];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit'), 10) || 10));
    const status = searchParams.get('status');
    const search = clampString(searchParams.get('search'), 100);

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = validateEnum(status, CONTACT_STATUSES, 'status');
    }

    if (search) {
      const safeSearch = createSafeRegex(search);
      query.$or = [
        { name: safeSearch },
        { email: safeSearch },
        { message: safeSearch }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Contact.countDocuments(query);

    // Get statistics
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statistics = {
      total: await Contact.countDocuments(),
      new: stats.find(s => s._id === 'new')?.count || 0,
      read: stats.find(s => s._id === 'read')?.count || 0,
      replied: stats.find(s => s._id === 'replied')?.count || 0
    };

    const siteBaseUrl = getSiteBaseUrl();
    const contactsWithReplyLinks = await Promise.all(
      contacts.map(async (contact) => ({
        ...contact,
        replyUrl: `${siteBaseUrl}/contact/reply/${await createContactReplyToken(contact._id)}`,
      }))
    );

    const response = {
      contacts: contactsWithReplyLinks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in admin contacts API:', error.message);
    return jsonError(error, 500);
  }
}

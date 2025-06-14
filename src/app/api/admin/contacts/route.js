import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export async function GET(request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('Query parameters:', { page, limit, status, search });

    // Build query
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('MongoDB query:', query);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Fetch contacts with pagination
    console.log('Fetching contacts...');
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${contacts.length} contacts`);

    // Get total count
    const total = await Contact.countDocuments(query);
    console.log(`Total contacts: ${total}`);

    // Get statistics
    console.log('Calculating statistics...');
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Statistics:', stats);

    const statistics = {
      total: await Contact.countDocuments(),
      new: stats.find(s => s._id === 'new')?.count || 0,
      read: stats.find(s => s._id === 'read')?.count || 0,
      replied: stats.find(s => s._id === 'replied')?.count || 0
    };

    const response = {
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics
    };

    console.log('Sending response:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in admin contacts API:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error.message },
      { status: 500 }
    );
  }
} 
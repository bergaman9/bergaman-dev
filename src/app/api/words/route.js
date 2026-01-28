
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Word from '@/models/Word';

// Force dynamic rendering since we're using search params
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const level = searchParams.get('level');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;

        const ids = searchParams.get('ids');

        // Build query
        const query = {};

        if (ids) {
            const idList = ids.split(',');
            query._id = { $in: idList };
            // Ignore other filters if exporting specific IDs
        } else {
            if (search) {
                query.term = { $regex: search, $options: 'i' };
            }

            if (level && level !== 'All') {
                query.level = level;
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const words = await Word.find(query)
            .sort({ term: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Word.countDocuments(query);

        return NextResponse.json({
            success: true,
            count: words.length,
            total,
            totalWords: await Word.countDocuments({}), // Total unfiltered words
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: words,
        });
    } catch (error) {
        console.error('Error fetching words:', error);
        return NextResponse.json(
            { success: false, error: 'Server Error' },
            { status: 500 }
        );
    }
}

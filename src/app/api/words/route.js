
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Word from '@/models/Word';
import { clampString, createSafeRegex, parseObjectId, validateEnum } from '@/lib/serverSecurity';

// Force dynamic rendering since we're using search params
export const dynamic = 'force-dynamic';

const WORD_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const search = clampString(searchParams.get('search'), 100);
        const level = searchParams.get('level');
        const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit'), 10) || 20));

        const ids = searchParams.get('ids');

        // Build query
        const query = {};

        if (ids) {
            const idList = ids.split(',').slice(0, 100).map((id) => parseObjectId(id.trim()));
            query._id = { $in: idList };
            // Ignore other filters if exporting specific IDs
        } else {
            if (search) {
                query.term = createSafeRegex(search);
            }

            if (level && level !== 'All') {
                query.level = validateEnum(level, WORD_LEVELS, 'level');
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
            { success: false, error: error.message || 'Server Error' },
            { status: error.status || 500 }
        );
    }
}

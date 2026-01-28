import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';

export async function POST(request) {
    try {
        await connectDB();
        const { userId, wordId, status } = await request.json();

        if (!userId || !wordId || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the user's progress document
        let progress = await UserProgress.findOne({ userId });

        if (!progress) {
            // Create new if not exists
            progress = await UserProgress.create({
                userId,
                words: [{ wordId, status, lastUpdated: new Date() }],
                lastActive: new Date()
            });
        } else {
            // Update existing
            const wordIndex = progress.words.findIndex(w => w.wordId.toString() === wordId);

            if (wordIndex > -1) {
                // Update existing word status
                progress.words[wordIndex].status = status;
                progress.words[wordIndex].lastUpdated = new Date();
            } else {
                // Add new word
                progress.words.push({ wordId, status, lastUpdated: new Date() });
            }
            progress.lastActive = new Date();
            await progress.save();
        }

        return NextResponse.json({ success: true, data: progress });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { success: false, error: 'Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID required' },
                { status: 400 }
            );
        }

        const progress = await UserProgress.findOne({ userId });

        return NextResponse.json({
            success: true,
            data: progress ? progress.words : []
        });

    } catch (error) {
        console.error('Error fetching progress:', error);
        return NextResponse.json(
            { success: false, error: 'Server Error' },
            { status: 500 }
        );
    }
}

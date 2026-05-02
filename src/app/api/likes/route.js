import { NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rateLimit';
import { connectDB } from '@/lib/mongodb';
import Like from '@/models/Like';
import { clampString, hashClientIdentifier, normalizeClientIp, readJsonLimited } from '@/lib/serverSecurity';

// IP adresini al
function getClientIP(request) {
  return normalizeClientIp(request);
}

// GET - Like sayısını getir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = clampString(searchParams.get('slug'), 120);

    if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    await connectDB();
    const postData = await Like.findOne({ slug }).lean();
    const likes = postData?.likes || 0;

    return NextResponse.json({
      likes,
      totalLikes: likes
    });
  } catch (error) {
    console.error('Error getting likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Like ekle
async function handler(request) {
  try {
    const body = await readJsonLimited(request, { maxBytes: 4 * 1024 });
    const slug = clampString(body.slug, 120);

    if (!slug || typeof slug !== 'string' || slug.length > 120 || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const clientHash = hashClientIdentifier(`${clientIP}:${userAgent.slice(0, 120)}`);

    await connectDB();
    let updated = await Like.findOneAndUpdate(
      {
        slug,
        clientHashes: { $ne: clientHash },
      },
      {
        $inc: { likes: 1 },
        $push: { clientHashes: clientHash },
      },
      {
        new: true,
      }
    );

    if (!updated) {
      const existing = await Like.findOne({ slug }).lean();
      if (!existing) {
        updated = await Like.create({
          slug,
          likes: 1,
          clientHashes: [clientHash],
        });
      }
    }

    if (!updated) {
      const existing = await Like.findOne({ slug }).lean();
      return NextResponse.json({
        error: 'Already liked',
        likes: existing?.likes || 0
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      likes: updated.likes,
      message: 'Like added successfully'
    });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, {
  limit: 20,
  windowMs: 60 * 1000,
});

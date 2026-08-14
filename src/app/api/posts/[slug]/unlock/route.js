import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/userInfo';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { readJsonLimited } from '@/lib/serverSecurity';
import {
  createProtectedPostToken,
  protectedPostAccessTtl,
  protectedPostCookieName,
} from '@/lib/protectedPostAccess';
import { withRateLimit } from '@/lib/rateLimit';

async function unlockPost(request, { params }) {
  const { slug } = await params;
  const { password } = await readJsonLimited(request, { maxBytes: 2 * 1024 });
  if (typeof password !== 'string' || password.length < 1 || password.length > 256) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  }

  await connectDB();
  const post = await BlogPost.findOne({ slug, published: true, visibility: 'password' })
    .select('+passwordHash');
  if (!post?.passwordHash || !(await verifyPassword(password, post.passwordHash))) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createProtectedPostToken(slug);
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: protectedPostCookieName(slug),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: `/blog/${slug}`,
    maxAge: protectedPostAccessTtl,
  });
  return response;
}

export const POST = withRateLimit(unlockPost, { limit: 8, windowMs: 15 * 60 * 1000 });

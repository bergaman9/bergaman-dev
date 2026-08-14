import 'server-only';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import BlogPost from '@/models/BlogPost';
import { connectDB } from '@/lib/mongodb';
import { getJwtSecret } from '@/lib/serverSecurity';

const encoder = new TextEncoder();
const ACCESS_TTL_SECONDS = 15 * 60;

export function protectedPostCookieName(slug) {
  return `blog_access_${crypto.createHash('sha256').update(slug).digest('hex').slice(0, 16)}`;
}

export async function createProtectedPostToken(slug) {
  return new SignJWT({ type: 'blog_access', slug })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .setIssuer('https://www.bergaman.dev')
    .setAudience('bergaman-protected-blog')
    .setJti(crypto.randomUUID())
    .sign(encoder.encode(getJwtSecret()));
}

async function hasProtectedPostAccess(slug) {
  const token = (await cookies()).get(protectedPostCookieName(slug))?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, encoder.encode(getJwtSecret()), {
      algorithms: ['HS256'],
      issuer: 'https://www.bergaman.dev',
      audience: 'bergaman-protected-blog',
    });
    return payload.type === 'blog_access' && payload.slug === slug;
  } catch {
    return false;
  }
}

export async function getBlogPostPageData(slug) {
  await connectDB();
  const post = await BlogPost.findOne({
    slug,
    published: true,
    visibility: { $in: ['public', 'password'] },
  }).lean();

  if (!post) return null;
  if (post.visibility !== 'password') return JSON.parse(JSON.stringify(post));

  if (!(await hasProtectedPostAccess(slug))) {
    return { slug, visibility: 'password', protected: true };
  }

  return JSON.parse(JSON.stringify(post));
}

export const protectedPostAccessTtl = ACCESS_TTL_SECONDS;

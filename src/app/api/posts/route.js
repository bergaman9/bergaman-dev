import { NextResponse } from 'next/server';
import { queryPublicPosts } from '@/lib/publicContent';

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=86400',
};

export async function GET(request) {
  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);
  const data = await queryPublicPosts({
    page: Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10)),
    limit: Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '10', 10))),
    category: searchParams.get('category'),
    search: searchParams.get('search')?.slice(0, 100),
    slug: searchParams.get('slug'),
    tag: searchParams.get('tag'),
  });

  console.log(JSON.stringify({ level: 'info', message: 'public_query', route: '/api/posts', requestId: request.headers.get('x-vercel-id'), durationMs: Date.now() - startedAt, resultCount: data.posts.length }));
  return NextResponse.json({ success: true, ...data }, { headers: CACHE_HEADERS });
}

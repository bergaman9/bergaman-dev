import { NextResponse } from 'next/server';
import { queryPublicRecommendations } from '@/lib/publicContent';

export async function GET(request) {
  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);
  const data = await queryPublicRecommendations({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    category: searchParams.get('category'),
  });
  console.log(JSON.stringify({ level: 'info', message: 'public_query', route: '/api/recommendations', requestId: request.headers.get('x-vercel-id'), durationMs: Date.now() - startedAt, resultCount: data.recommendations.length }));
  return NextResponse.json({ success: true, ...data }, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=1800, stale-while-revalidate=86400' },
  });
}

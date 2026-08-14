import { NextResponse } from 'next/server';
import { getPublicPortfolios } from '@/lib/publicContent';

export async function GET(request) {
  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('limit') || '100', 10)));
  let portfolios = await getPublicPortfolios();
  if (category && category !== 'all') portfolios = portfolios.filter((item) => item.category === category);
  if (featured) portfolios = portfolios.filter((item) => item.featured);
  portfolios = portfolios.slice(0, limit);
  console.log(JSON.stringify({ level: 'info', message: 'public_query', route: '/api/portfolio', requestId: request.headers.get('x-vercel-id'), durationMs: Date.now() - startedAt, resultCount: portfolios.length }));
  return NextResponse.json({ success: true, portfolios }, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=86400' },
  });
}

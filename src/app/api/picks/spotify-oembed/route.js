import { NextResponse } from 'next/server';
import axios from 'axios';

// Proxies Spotify's public oEmbed endpoint (no auth) so music picks can show
// the real track title + album art instead of a raw URL. Cached in memory.
const cache = new Map(); // url -> { data, ts }
const TTL = 24 * 60 * 60 * 1000; // 1 day

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('url');

  if (!raw || !/^https:\/\/open\.spotify\.com\//.test(raw)) {
    return NextResponse.json({ error: 'Invalid Spotify url' }, { status: 400 });
  }
  // The intl-xx/ locale prefix breaks the oEmbed lookup — strip it.
  const url = raw.replace(/open\.spotify\.com\/intl-[a-z]{2}\//i, 'open.spotify.com/');

  const cached = cache.get(url);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await axios.get(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { timeout: 6000 });
    const data = {
      title: res.data?.title || null,
      thumbnail: res.data?.thumbnail_url || null,
    };
    cache.set(url, { data, ts: Date.now() });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ title: null, thumbnail: null });
  }
}

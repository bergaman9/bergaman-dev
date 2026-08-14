import 'server-only';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import BlogPost from '@/models/BlogPost';
import Comment from '@/models/Comment';
import Portfolio from '@/models/Portfolio';
import Recommendation from '@/models/Recommendation';
import { connectDB } from '@/lib/mongodb';
import { blogPosts as staticBlogPosts } from '@/data/blogPosts';
import { escapeRegExp } from '@/lib/serverSecurity';

const PUBLIC_POST_QUERY = {
  published: true,
  $or: [{ visibility: 'public' }, { visibility: { $exists: false } }],
};

function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}

function postDate(post) {
  return new Date(post.createdAt || post.date || 0).getTime();
}

function matchesStaticPost(post, { category, search, slug, tag } = {}) {
  if (category && category !== 'all' && post.category !== category) return false;
  if (slug && post.slug !== slug) return false;
  if (tag && !post.tags?.some((value) => value.toLowerCase() === tag.toLowerCase())) return false;
  if (search) {
    const haystack = [post.title, post.description, post.excerpt, ...(post.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(search.toLowerCase())) return false;
  }
  return post.published !== false && (!post.visibility || post.visibility === 'public');
}

const getSpotifyMetadata = unstable_cache(async (rawUrl) => {
  if (!/^https:\/\/open\.spotify\.com\//.test(rawUrl || '')) return null;
  const url = rawUrl.replace(/open\.spotify\.com\/intl-[a-z]{2}\//i, 'open.spotify.com/');
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return { title: data.title || null, thumbnail: data.thumbnail_url || null };
  } catch {
    return null;
  }
}, ['spotify-oembed'], { revalidate: 86400, tags: ['spotify-oembed'] });

export async function queryPublicPosts({ page = 1, limit = 9, category, search, slug, tag } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 9));
  const filters = { category, search: search?.slice(0, 100), slug, tag };
  const staticMatches = staticBlogPosts
    .filter((post) => matchesStaticPost(post, filters))
    .map((post) => ({ ...post, createdAt: post.createdAt || post.date, commentCount: 0 }))
    .sort((a, b) => postDate(b) - postDate(a));

  try {
    await connectDB();
    const query = { ...PUBLIC_POST_QUERY };
    if (category && category !== 'all') query.category = category;
    if (slug) query.slug = slug;
    if (tag) query.tags = { $in: [new RegExp(`^${escapeRegExp(tag)}$`, 'i')] };
    if (filters.search) {
      const safeSearch = escapeRegExp(filters.search);
      query.$and = [
        { $or: query.$or },
        { $or: [
          { title: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { tags: { $in: [new RegExp(safeSearch, 'i')] } },
        ] },
      ];
      delete query.$or;
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      BlogPost.countDocuments(query),
    ]);
    const staticBySlug = new Map(staticBlogPosts.map((post) => [post.slug, post]));
    posts.forEach((post) => {
      const fallback = staticBySlug.get(post.slug);
      if (!post.translations?.tr?.content && fallback?.translations) post.translations = fallback.translations;
    });
    const dbSlugsOnPage = posts
      .map((post) => post.slug)
      .filter(Boolean);

    if (dbSlugsOnPage.length) {
      const counts = await Comment.aggregate([
        { $match: { postSlug: { $in: dbSlugsOnPage }, approved: true } },
        { $group: { _id: '$postSlug', count: { $sum: 1 } } },
      ]);
      const countBySlug = Object.fromEntries(counts.map(({ _id, count }) => [_id, count]));
      posts.forEach((post) => { post.commentCount = countBySlug[post.slug] || 0; });
    }

    const pages = Math.ceil(total / safeLimit);
    return serialize({
      posts,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages,
        hasNext: safePage < pages,
        hasPrev: safePage > 1,
      },
    });
  } catch (error) {
    console.error('Public posts fallback:', error.message);
    const posts = staticMatches.slice((safePage - 1) * safeLimit, safePage * safeLimit);
    const pages = Math.ceil(staticMatches.length / safeLimit);
    return serialize({
      posts,
      pagination: { page: safePage, limit: safeLimit, total: staticMatches.length, pages, hasNext: safePage < pages, hasPrev: safePage > 1 },
      source: 'static-fallback',
    });
  }
}

export const getInitialPublicPosts = unstable_cache(
  () => queryPublicPosts({ page: 1, limit: 9 }),
  ['public-blog-posts-page-1'],
  { revalidate: 600, tags: ['blog-posts'] },
);

export const getPublicPostBySlug = cache(async (slug) => {
  const result = await queryPublicPosts({ slug, page: 1, limit: 1 });
  return result.posts[0] || null;
});

export const getSitemapPosts = unstable_cache(async () => {
  const staticPosts = staticBlogPosts
    .filter((post) => matchesStaticPost(post))
    .map((post) => ({ slug: post.slug, image: post.image, updatedAt: post.updatedAt || post.createdAt || post.date }));

  try {
    await connectDB();
    const dbPosts = await BlogPost.find(PUBLIC_POST_QUERY)
      .select('slug image updatedAt createdAt')
      .sort({ createdAt: -1 })
      .lean();
    const dbSlugs = new Set(dbPosts.map((post) => post.slug));
    return serialize([...dbPosts, ...staticPosts.filter((post) => !dbSlugs.has(post.slug))]);
  } catch (error) {
    console.error('Sitemap post fallback:', error.message);
    return serialize(staticPosts);
  }
}, ['public-sitemap-posts'], { revalidate: 3600, tags: ['blog-posts'] });

export const getPublicPortfolios = unstable_cache(async () => {
  try {
    await connectDB();
    const portfolios = await Portfolio.find({})
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();
    return serialize(portfolios);
  } catch (error) {
    console.error('Public portfolio fallback:', error.message);
    return [];
  }
}, ['public-portfolios'], { revalidate: 1800, tags: ['portfolios'] });

export async function queryPublicRecommendations({ page = 1, limit = 24, category } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(48, Math.max(1, Number(limit) || 24));
  try {
    await connectDB();
    const filter = { status: 'active' };
    if (category && category !== 'all') filter.category = category === 'tv' ? 'series' : category;
    const [recommendations, total, groupedCounts] = await Promise.all([
      Recommendation.find(filter)
      .sort({ order: 1, createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      Recommendation.countDocuments(filter),
      Recommendation.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);
    const enrichedRecommendations = await Promise.all(recommendations.map(async (item) => {
      if (item.category !== 'music') return item;
      const spotify = await getSpotifyMetadata(item.url || item.link);
      return spotify ? { ...item, spotifyTitle: spotify.title, spotifyThumbnail: spotify.thumbnail } : item;
    }));
    const counts = Object.fromEntries(groupedCounts.map(({ _id, count }) => [_id === 'series' ? 'tv' : _id, count]));
    counts.all = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return serialize({
      recommendations: enrichedRecommendations,
      counts,
      pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit), hasMore: safePage * safeLimit < total },
    });
  } catch (error) {
    console.error('Public recommendations fallback:', error.message);
    return { recommendations: [], counts: { all: 0 }, pagination: { page: safePage, limit: safeLimit, total: 0, pages: 0, hasMore: false } };
  }
}

export const getInitialPublicRecommendations = unstable_cache(
  () => queryPublicRecommendations({ page: 1, limit: 24 }),
  ['public-recommendations-page-1'],
  { revalidate: 1800, tags: ['recommendations'] },
);

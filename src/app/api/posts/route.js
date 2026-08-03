import { NextResponse } from 'next/server';
import BlogPost from '../../../models/BlogPost';
import Comment from '../../../models/Comment';
import { connectDB } from '../../../lib/mongodb';
import { blogPosts as staticBlogPosts } from '../../../data/blogPosts';
import { escapeRegExp } from '@/lib/serverSecurity';

const PUBLIC_QUERY = {
  published: true,
  $or: [{ visibility: 'public' }, { visibility: { $exists: false } }]
};

function matchesStaticPost(post, { category, search, slug, tag }) {
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

function postDate(post) {
  return new Date(post.createdAt || post.date || 0).getTime();
}

function responseHeaders() {
  return {
    // Browser freshness plus Vercel CDN caching dramatically reduces repeated
    // MongoDB cold starts while still allowing regular content updates.
    'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=86400'
  };
}

// GET - Fetch public blog posts. Curated static posts are always available, so
// visitors and crawlers receive useful HTML/data even during a database outage.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '10', 10)));
  const filters = {
    category: searchParams.get('category'),
    search: searchParams.get('search')?.slice(0, 100),
    slug: searchParams.get('slug'),
    tag: searchParams.get('tag')
  };

  const staticMatches = staticBlogPosts
    .filter((post) => matchesStaticPost(post, filters))
    .map((post) => ({ ...post, commentCount: 0 }));

  try {
    await connectDB();

    const query = { ...PUBLIC_QUERY };
    if (filters.category && filters.category !== 'all') query.category = filters.category;
    if (filters.slug) query.slug = filters.slug;
    if (filters.tag) query.tags = { $in: [new RegExp(`^${escapeRegExp(filters.tag)}$`, 'i')] };
    if (filters.search) {
      const safeSearch = escapeRegExp(filters.search);
      query.$and = [
        { $or: query.$or },
        { $or: [
          { title: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { tags: { $in: [new RegExp(safeSearch, 'i')] } }
        ] }
      ];
      delete query.$or;
    }

    // Personal portfolios have a modest post count. Fetching the matching set
    // once lets us merge DB-managed posts with resilient static articles before
    // pagination, avoiding missing or duplicated first-page content.
    const dbPosts = await BlogPost.find(query).sort({ createdAt: -1 }).limit(250).lean();
    const dbSlugs = new Set(dbPosts.map((post) => post.slug));
    const posts = [...dbPosts, ...staticMatches.filter((post) => !dbSlugs.has(post.slug))]
      .sort((a, b) => postDate(b) - postDate(a));

    const pagePosts = posts.slice((page - 1) * limit, page * limit);
    const slugs = pagePosts.filter((post) => !String(post._id).startsWith('static-')).map((post) => post.slug).filter(Boolean);
    if (slugs.length) {
      const counts = await Comment.aggregate([
        { $match: { postSlug: { $in: slugs }, approved: true } },
        { $group: { _id: '$postSlug', count: { $sum: 1 } } }
      ]);
      const countBySlug = Object.fromEntries(counts.map(({ _id, count }) => [_id, count]));
      pagePosts.forEach((post) => { post.commentCount = countBySlug[post.slug] || 0; });
    }

    const pages = Math.ceil(posts.length / limit);
    return NextResponse.json({
      success: true,
      posts: pagePosts,
      pagination: { page, limit, total: posts.length, pages, hasNext: page < pages, hasPrev: page > 1 }
    }, { headers: responseHeaders() });
  } catch (error) {
    console.error('Error in /api/posts:', error.message);
    const pages = Math.ceil(staticMatches.length / limit);
    return NextResponse.json({
      success: true,
      posts: staticMatches.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total: staticMatches.length, pages, hasNext: page < pages, hasPrev: page > 1 },
      source: 'static-fallback'
    }, { headers: responseHeaders() });
  }
}

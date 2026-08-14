import { getSitemapPosts } from '@/lib/publicContent';

const BASE_URL = 'https://www.bergaman.dev';

export default async function sitemap() {
  const staticPages = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/picks', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  ].map(({ path, ...entry }) => ({ url: `${BASE_URL}${path}`, ...entry }));

  const posts = await getSitemapPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    ...(post.updatedAt ? { lastModified: new Date(post.updatedAt) } : {}),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

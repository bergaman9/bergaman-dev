import { getSitemapPosts } from '@/lib/publicContent';
import { ACTIVE_MINI_APPS } from '@/lib/miniApps';

const BASE_URL = 'https://www.bergaman.dev';

export default async function sitemap() {
  const staticPages = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/picks', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  ].map(({ path, ...entry }) => ({ url: `${BASE_URL}${path}`, lastModified: new Date('2026-08-14'), ...entry }));

  const labPages = ACTIVE_MINI_APPS.map((app) => ({
    url: `${BASE_URL}${app.href}`,
    lastModified: new Date('2026-08-14'),
    changeFrequency: 'monthly',
    priority: 0.55,
    ...(app.image ? { images: [`${BASE_URL}${app.image}`] } : {}),
  }));

  const posts = await getSitemapPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    ...(post.updatedAt ? { lastModified: new Date(post.updatedAt) } : {}),
    changeFrequency: 'monthly',
    priority: 0.7,
    ...(post.image ? { images: [new URL(post.image, BASE_URL).toString()] } : {}),
  }));

  return [...staticPages, ...labPages, ...blogPages];
}

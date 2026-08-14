import BlogPageClient from './BlogPageClient';
import { getInitialPublicPosts } from '@/lib/publicContent';

export const revalidate = 600;

export default async function BlogPage() {
  const data = await getInitialPublicPosts();
  return <BlogPageClient initialPosts={data.posts} initialTotal={data.pagination.total} />;
}

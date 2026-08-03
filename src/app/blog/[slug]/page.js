import BlogPostClient from './BlogPostClient';
import { blogPosts } from '../../../data/blogPosts';

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const initialPost = blogPosts.find((post) => post.slug === slug) || null;

  return <BlogPostClient slug={slug} initialPost={initialPost} />;
}

import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';
import { getBlogPostPageData } from '@/lib/protectedPostAccess';
import { getPublicPostBySlug } from '@/lib/publicContent';
import { blogPosts as staticBlogPosts } from '@/data/blogPosts';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return {};
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.description || post.excerpt;
  const url = `https://www.bergaman.dev/blog/${slug}`;
  return {
    title: { absolute: `${title} • Bergaman` },
    description,
    keywords: post.seo?.keywords || post.tags,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description, publishedTime: post.createdAt || post.date, modifiedTime: post.updatedAt || post.createdAt || post.date, images: post.image ? [{ url: post.image, alt: post.title }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: post.image ? [post.image] : undefined },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let initialPost;
  try {
    initialPost = await getBlogPostPageData(slug);
  } catch {
    initialPost = await getPublicPostBySlug(slug);
  }

  if (!initialPost) initialPost = await getPublicPostBySlug(slug);

  if (!initialPost) notFound();

  const staticFallback = staticBlogPosts.find((post) => post.slug === slug);
  if (!initialPost.translations && staticFallback?.translations) {
    initialPost = { ...initialPost, translations: staticFallback.translations };
  }

  const structuredData = initialPost.protected ? null : {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: initialPost.title,
    description: initialPost.description || initialPost.excerpt,
    image: initialPost.image ? new URL(initialPost.image, 'https://www.bergaman.dev').toString() : undefined,
    datePublished: initialPost.createdAt || initialPost.date,
    dateModified: initialPost.updatedAt || initialPost.createdAt || initialPost.date,
    author: {
      '@type': 'Person',
      name: 'Ömer',
      url: 'https://www.bergaman.dev/about',
    },
    mainEntityOfPage: `https://www.bergaman.dev/blog/${slug}`,
  };

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
      )}
      <BlogPostClient slug={slug} initialPost={initialPost} />
    </>
  );
}

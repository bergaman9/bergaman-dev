import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';
import { getBlogPostPageData } from '@/lib/protectedPostAccess';
import { getPublicPostBySlug } from '@/lib/publicContent';

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

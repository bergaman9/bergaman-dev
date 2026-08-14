import { getPublicPostBySlug } from '@/lib/publicContent';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const url = `https://www.bergaman.dev/blog/${slug}`;
  const post = await getPublicPostBySlug(slug);

  if (!post) return { title: 'Blog Post', alternates: { canonical: url } };

  const description = post.seo?.metaDescription || post.description || post.excerpt;
  return {
    title: post.seo?.metaTitle || post.title,
    description,
    keywords: post.seo?.keywords || post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: 'article',
      publishedTime: post.createdAt || post.date,
      ...(post.image ? { images: [{ url: post.image, alt: post.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      ...(post.image ? { images: [post.image] } : {}),
    },
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}

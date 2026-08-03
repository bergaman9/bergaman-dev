import { connectDB } from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';
import { blogPosts as staticBlogPosts } from '../../../data/blogPosts';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const url = `https://bergaman.dev/blog/${slug}`;

  try {
    await connectDB();
    const post = await BlogPost.findOne({
      slug,
      published: true,
      $or: [{ visibility: 'public' }, { visibility: { $exists: false } }],
    }).lean();

    if (post) {
      return {
        title: post.title,
        description: post.description || post.excerpt || undefined,
        alternates: { canonical: url },
        openGraph: {
          title: post.title,
          description: post.description || post.excerpt || undefined,
          url,
          type: 'article',
          ...(post.image ? { images: [{ url: post.image }] } : {}),
        },
      };
    }
  } catch {
    // Fall through to the generic metadata when the DB is unreachable.
  }

  const staticPost = staticBlogPosts.find((post) => post.slug === slug);
  if (staticPost) {
    const description = staticPost.seo?.metaDescription || staticPost.description || staticPost.excerpt;
    return {
      title: staticPost.seo?.metaTitle || staticPost.title,
      description,
      keywords: staticPost.seo?.keywords || staticPost.tags,
      alternates: { canonical: url },
      openGraph: {
        title: staticPost.title,
        description,
        url,
        type: 'article',
        publishedTime: staticPost.createdAt || staticPost.date,
        images: [{ url: staticPost.image, width: 1536, height: 1024, alt: staticPost.title }]
      },
      twitter: { card: 'summary_large_image', title: staticPost.title, description, images: [staticPost.image] }
    };
  }

  return { title: 'Blog Post', alternates: { canonical: url } };
}

export default function BlogPostLayout({ children }) {
  return children;
}

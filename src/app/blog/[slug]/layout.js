import { connectDB } from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';

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

  return {
    title: 'Blog Post',
    alternates: { canonical: url },
  };
}

export default function BlogPostLayout({ children }) {
  return children;
}

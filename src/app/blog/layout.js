export const metadata = {
  title: 'Blog',
  description: "Explore Bergaman's blog featuring insights on web development, AI, technology trends, and programming tutorials.",
  alternates: {
    canonical: 'https://bergaman.dev/blog',
  },
  openGraph: {
    title: 'Blog | Bergaman',
    description: "Explore Bergaman's blog featuring insights on web development, AI, and technology trends.",
    url: 'https://bergaman.dev/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }) {
  return children;
}

export const metadata = {
  title: 'Blog',
  description: "Ömer's technical writing on high-voltage engineering, power systems, automation, software development, and practical technology.",
  alternates: {
    canonical: 'https://www.bergaman.dev/blog',
  },
  openGraph: {
    title: 'Blog • Bergaman',
    description: 'Technical writing on high-voltage engineering, automation, software development, and practical technology.',
    url: 'https://www.bergaman.dev/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }) {
  return children;
}

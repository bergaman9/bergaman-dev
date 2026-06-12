export const metadata = {
  title: 'Newsletter',
  description: "Join Bergaman's newsletter for insights on AI, full-stack development, and tech innovation delivered to your inbox.",
  alternates: {
    canonical: 'https://bergaman.dev/newsletter',
  },
  openGraph: {
    title: 'Newsletter | Bergaman',
    description: "Join Bergaman's newsletter for insights on AI, full-stack development, and tech innovation.",
    url: 'https://bergaman.dev/newsletter',
    type: 'website',
  },
};

export default function NewsletterLayout({ children }) {
  return children;
}

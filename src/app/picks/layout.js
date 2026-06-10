export const metadata = {
  title: 'My Picks',
  description: 'A curated collection of movies, games, books, music, TV series, and links recommended by Bergaman.',
  alternates: {
    canonical: 'https://bergaman.dev/picks',
  },
  openGraph: {
    title: 'My Picks | Bergaman',
    description: 'A curated collection of movies, games, books, music, TV series, and links recommended by Bergaman.',
    url: 'https://bergaman.dev/picks',
    type: 'website',
  },
};

export default function PicksLayout({ children }) {
  return children;
}

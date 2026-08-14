export const metadata = {
  title: 'My Picks',
  description: 'A personal collection of movies, games, books, music, series, and useful links curated by Ömer.',
  alternates: {
    canonical: 'https://www.bergaman.dev/picks',
  },
  openGraph: {
    title: 'My Picks • Bergaman',
    description: 'A personal collection of movies, games, books, music, series, and useful links curated by Ömer.',
    url: 'https://www.bergaman.dev/picks',
    type: 'website',
  },
};

export default function PicksLayout({ children }) {
  return children;
}

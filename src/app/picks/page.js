import PicksPageClient from './PicksPageClient';
import { getInitialPublicRecommendations } from '@/lib/publicContent';

export const revalidate = 1800;

export default async function PicksPage() {
  const data = await getInitialPublicRecommendations();
  return (
    <PicksPageClient
      initialRecommendations={data.recommendations}
      initialCounts={data.counts}
      initialPagination={data.pagination}
    />
  );
}

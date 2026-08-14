import PortfolioPageClient from './PortfolioPageClient';
import { getPublicPortfolios } from '@/lib/publicContent';

export const revalidate = 1800;

export default async function PortfolioPage() {
  const portfolios = await getPublicPortfolios();
  return <PortfolioPageClient initialPortfolios={portfolios} />;
}

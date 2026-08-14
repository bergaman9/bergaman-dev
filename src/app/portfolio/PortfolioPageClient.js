"use client";

import { useMemo, useState } from 'react';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import { usePreferences } from '../components/PreferencesProvider';

function projectGroup(category = '') {
  const value = category.toLowerCase();
  if (value.includes('ai') || value.includes('machine')) return 'ai';
  if (value.includes('iot') || value.includes('embedded') || value.includes('electrical') || value.includes('automation')) return 'engineering';
  if (value.includes('web') || value.includes('bot') || value.includes('mobile') || value.includes('desktop')) return 'web';
  return 'all';
}

export default function PortfolioPageClient({ initialPortfolios = [], initialError = null }) {
  const { t } = usePreferences();
  const [portfolioItems, setPortfolioItems] = useState(initialPortfolios);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const filters = [
    { id: 'all', label: t('filterAll') },
    { id: 'web', label: t('filterWeb') },
    { id: 'engineering', label: t('filterEngineering') },
    { id: 'ai', label: t('filterAi') }
  ];

  const selectedProjects = useMemo(() => {
    const featured = portfolioItems.filter((item) => item.featured);
    return [...featured, ...portfolioItems.filter((item) => !item.featured)].slice(0, 3);
  }, [portfolioItems]);

  const filteredProjects = useMemo(() => (
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => projectGroup(item.category) === activeCategory)
  ), [activeCategory, portfolioItems]);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error(t('projectLoadError'));
      const data = await response.json();
      setPortfolioItems(data.portfolios || []);
      setError(null);
    } catch {
      setError(t('projectLoadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="page-scrollbar">
      <PageHeader
        title={t('selectedWork')}
        subtitle={t('selectedWorkSubtitle')}
        icon="fas fa-briefcase"
        variant="large"
      />

      {error && (
        <div role="alert" className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-gray-200">
          <p>{initialError ? t('projectLoadError') : error}</p>
          <Button onClick={fetchPortfolios} disabled={loading} variant="secondary" icon="fas fa-sync" className="mt-3">
            {loading ? t('loading') : t('tryAgain')}
          </Button>
        </div>
      )}

      {selectedProjects.length > 0 && (
        <section aria-labelledby="selected-projects" className="mb-14">
          <h2 id="selected-projects" className="mb-6 text-2xl font-bold text-[#e8c547]">{t('selectedCaseStudies')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {selectedProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="all-projects">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="all-projects" className="text-2xl font-bold text-white">{t('allProjects')}</h2>
            <p className="mt-1 text-gray-400">{t('browseCapability')}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label={t('filterProjects')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={activeCategory === filter.id}
                onClick={() => setActiveCategory(filter.id)}
                className={`min-h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547] ${activeCategory === filter.id ? 'border-[#e8c547] bg-[#e8c547] text-[#0e1b12]' : 'border-[#3e503e] bg-[#1a2e1a]/50 text-gray-300 hover:border-[#e8c547]/60'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-[#3e503e]/40 bg-[#1a2e1a]/30 p-10 text-center">
            <h3 className="text-xl font-bold text-gray-200">{t('noCategoryProjects')}</h3>
            <p className="mt-2 text-gray-400">{t('categoryExpanding')}</p>
            <Button onClick={() => setActiveCategory('all')} variant="secondary" className="mt-5">{t('viewAll')}</Button>
          </div>
        )}
      </section>
    </PageContainer>
  );
}

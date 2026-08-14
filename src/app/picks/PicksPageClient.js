"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import PickCard from '../components/PickCard';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Select from '../components/Select';
import { PageSkeleton, SkeletonBox } from '../components/Skeleton';

export default function PicksPageClient({ initialRecommendations = [], initialCounts = { all: 0 }, initialPagination = {} }) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [loading, setLoading] = useState(false);
  const [counts] = useState(initialCounts);
  const [page, setPage] = useState(initialPagination.page || 1);
  const [hasMore, setHasMore] = useState(Boolean(initialPagination.hasMore));
  const [isPending, startTransition] = useTransition();
  const initialCategoryRender = useRef(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [showTop, setShowTop] = useState(false);
  const loadMoreRef = useRef(null);

  // Reveal the back-to-top button only after scrolling down a bit.
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: 'fas fa-th' },
    { id: 'movie', label: 'Movies', icon: 'fas fa-film' },
    { id: 'game', label: 'Games', icon: 'fas fa-gamepad' },
    { id: 'book', label: 'Books', icon: 'fas fa-book' },
    { id: 'music', label: 'Music', icon: 'fas fa-music' },
    { id: 'tv', label: 'TV Series', icon: 'fas fa-tv' },
    { id: 'link', label: 'Links', icon: 'fas fa-link' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: 'fas fa-clock' },
    { value: 'oldest', label: 'Oldest First', icon: 'fas fa-history' },
    { value: 'rating', label: 'Highest Rated', icon: 'fas fa-star' },
    { value: 'title', label: 'Title A-Z', icon: 'fas fa-sort-alpha-down' }
  ];

  useEffect(() => {
    if (initialCategoryRender.current) {
      initialCategoryRender.current = false;
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/recommendations?page=1&limit=24&category=${encodeURIComponent(activeCategory)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Picks could not be loaded');
        return response.json();
      })
      .then((data) => {
        startTransition(() => {
          setRecommendations(data.recommendations || []);
          setPage(1);
          setHasMore(Boolean(data.pagination?.hasMore));
        });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setRecommendations([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [activeCategory]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setLoading(true);
    try {
      const response = await fetch(`/api/recommendations?page=${nextPage}&limit=24&category=${encodeURIComponent(activeCategory)}`);
      if (!response.ok) throw new Error('Picks could not be loaded');
      const data = await response.json();
      setRecommendations((current) => {
        const byId = new Map(current.map((item) => [String(item._id), item]));
        (data.recommendations || []).forEach((item) => byId.set(String(item._id), item));
        return [...byId.values()];
      });
      setPage(nextPage);
      setHasMore(Boolean(data.pagination?.hasMore));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, hasMore, loading, page]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '500px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const sorted = [...recommendations].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'title': return (a.title || '').localeCompare(b.title || '');
      default: return 0;
    }
  });

  if (loading && recommendations.length === 0) {
    return (
      <PageContainer>
        <PageSkeleton
          title="My Picks"
          subtitle="Curated collection of movies, games, books, music, and more"
          icon="fas fa-heart"
          headerVariant="large"
          controls={
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                {categories.map((cat) => (
                  <div key={cat.id} className="rounded-lg border border-[#3e503e]/30 bg-[#2e3d29]/30 p-4 text-center">
                    <SkeletonBox className="mx-auto mb-2 h-7 w-7" rounded="rounded" />
                    <SkeletonBox className="mx-auto h-4 w-14" rounded="rounded" />
                    <SkeletonBox className="mx-auto mt-2 h-5 w-6" rounded="rounded" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <SkeletonBox className="h-10 w-20" />
                <SkeletonBox className="h-10 w-48" />
              </div>
            </>
          }
          gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          itemCount={8}
          renderItem={(index) => (
            <div key={index} className="rounded-xl border border-[#3e503e]/30 bg-[#2e3d29]/30 overflow-hidden">
              <SkeletonBox className="aspect-[2/3] w-full" rounded="rounded-none" />
              <div className="p-4 space-y-2">
                <SkeletonBox className="h-4 w-3/4" />
                <SkeletonBox className="h-3 w-1/2" />
              </div>
            </div>
          )}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Picks"
        subtitle="Curated collection of movies, games, books, music, and more"
        icon="fas fa-heart"
        variant="large"
      />

      {/* Category stats / filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => startTransition(() => setActiveCategory(cat.id))}
            aria-pressed={activeCategory === cat.id}
            className={`p-4 rounded-lg transition-all duration-300 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${activeCategory === cat.id
              ? 'bg-[#e8c547]/20 border-2 border-[#e8c547] shadow-lg shadow-[#e8c547]/20'
              : 'bg-[#2e3d29]/30 border border-[#3e503e]/30 hover:border-[#e8c547]/50'
              }`}
          >
            <i className={`${cat.icon} text-xl mb-1.5 block ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-400'}`}></i>
            <div className={`text-sm font-medium ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-300'}`}>{cat.label}</div>
            <div className={`text-lg font-bold mt-0.5 ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-400'}`}>{counts[cat.id] || 0}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-1 bg-[#2e3d29]/30 rounded-lg p-1 self-start">
          <button
            onClick={() => setView('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
            className={`p-2 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${view === 'grid' ? 'bg-[#e8c547]/20 text-[#e8c547]' : 'text-gray-400 hover:text-[#e8c547]'}`}
          >
            <i className="fas fa-th-large text-lg"></i>
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
            className={`p-2 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 ${view === 'list' ? 'bg-[#e8c547]/20 text-[#e8c547]' : 'text-gray-400 hover:text-[#e8c547]'}`}
          >
            <i className="fas fa-list text-lg"></i>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Sort by:</span>
          <div className="w-48">
            <Select options={sortOptions} value={sortBy} onChange={setSortBy} variant="primary" icon="fas fa-sort" />
          </div>
        </div>
      </div>

      {/* Content */}
      <h2 className="sr-only">Curated picks</h2>
      <div aria-busy={loading || isPending}>
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-8 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
            <i className={`${categories.find(c => c.id === activeCategory)?.icon || 'fas fa-heart'} text-6xl text-[#e8c547]/30 mb-4 block`}></i>
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              No {activeCategory === 'all' ? 'picks' : categories.find(c => c.id === activeCategory)?.label.toLowerCase()} found
            </h3>
            <p className="text-gray-500 mb-4">New picks are added regularly — check back soon!</p>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-[#e8c547] hover:text-[#f4d76b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded px-2 py-1"
              >
                View all picks →
              </button>
            )}
          </div>
        </div>
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {sorted.map((item) => (
            <PickCard key={item._id} recommendation={item} variant="list" />
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {sorted.map((item) => (
            <div key={item._id} className="mb-5 break-inside-avoid"><PickCard recommendation={item} variant="grid" /></div>
          ))}
        </div>
      )}
      </div>

      {hasMore && sorted.length > 0 && <div ref={loadMoreRef} className="mt-8 flex min-h-16 items-center justify-center" role="status" aria-live="polite">{loading && <><i className="fas fa-circle-notch mr-2 animate-spin text-[#e8c547]"></i><span className="text-sm text-gray-400">Loading more picks…</span></>}</div>}

      {/* Back to top — appears after scrolling */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8c547] text-[#0e1b12] shadow-lg shadow-black/30 transition-all duration-300 hover:bg-[#f4d76b] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0e1b12] group"
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up transition-transform group-hover:-translate-y-0.5"></i>
        </button>
      )}
    </PageContainer>
  );
}

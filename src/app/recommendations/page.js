"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '@/lib/constants';
import RecommendationCard from '../components/RecommendationCard';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Select from '../components/Select';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('masonry');

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
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.recommendations) {
        // Remove duplicates by _id
        const uniqueRecommendations = data.recommendations.filter((item, index, self) =>
          index === self.findIndex((r) => r._id === item._id)
        );
        setRecommendations(uniqueRecommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter recommendations by category
  const filteredRecommendations = recommendations.filter(rec => {
    if (activeCategory === 'all') return true;
    return rec.category === activeCategory;
  });

  // Sort recommendations
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });

  // Group recommendations by category for showcase view
  const groupedRecommendations = categories.slice(1).reduce((acc, category) => {
    const items = recommendations.filter(rec => rec.category === category.id);
    if (items.length > 0) {
      acc.push({
        category: category,
        items: items.slice(0, 6) // Show max 6 items per category
      });
    }
    return acc;
  }, []);

  // Get category stats
  const getCategoryStats = () => {
    const stats = {
      all: recommendations.length
    };
    categories.slice(1).forEach(cat => {
      stats[cat.id] = recommendations.filter(rec => rec.category === cat.id).length;
    });
    return stats;
  };

  const stats = getCategoryStats();

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <PageHeader
          title="My Picks"
          subtitle="Curated collection of movies, games, books, music, and more"
          icon="fas fa-heart"
          variant="large"
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                p-4 rounded-lg transition-all duration-300 text-center
                ${activeCategory === cat.id
                  ? 'bg-[#e8c547]/20 border-2 border-[#e8c547] shadow-lg shadow-[#e8c547]/20'
                  : 'bg-[#2e3d29]/30 border border-[#3e503e]/30 hover:border-[#e8c547]/50'
                }
              `}
            >
              <i className={`${cat.icon} text-2xl mb-2 block ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-400'
                }`}></i>
              <div className={`text-sm font-medium ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-300'
                }`}>
                {cat.label}
              </div>
              <div className={`text-lg font-bold mt-1 ${activeCategory === cat.id ? 'text-[#e8c547]' : 'text-gray-400'
                }`}>
                {stats[cat.id] || 0}
              </div>
            </button>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* View Toggle - Dynamic based on category */}
          <div className="flex items-center gap-2 bg-[#2e3d29]/30 rounded-lg p-1">
            {activeCategory === 'all' && (
              <>
                <button
                  onClick={() => setView('masonry')}
                  className={`p-2 rounded transition-all ${view === 'masonry'
                    ? 'bg-[#e8c547]/20 text-[#e8c547]'
                    : 'text-gray-400 hover:text-[#e8c547]'
                    }`}
                  title="Masonry View"
                >
                  <i className="fas fa-th-large text-lg"></i>
                </button>
                <button
                  onClick={() => setView('showcase')}
                  className={`p-2 rounded transition-all ${view === 'showcase'
                    ? 'bg-[#e8c547]/20 text-[#e8c547]'
                    : 'text-gray-400 hover:text-[#e8c547]'
                    }`}
                  title="Showcase View"
                >
                  <i className="fas fa-layer-group text-lg"></i>
                </button>
              </>
            )}
            {activeCategory !== 'all' && (
              <>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded transition-all ${view === 'grid'
                    ? 'bg-[#e8c547]/20 text-[#e8c547]'
                    : 'text-gray-400 hover:text-[#e8c547]'
                    }`}
                  title="Grid View"
                >
                  <i className="fas fa-th text-lg"></i>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded transition-all ${view === 'list'
                    ? 'bg-[#e8c547]/20 text-[#e8c547]'
                    : 'text-gray-400 hover:text-[#e8c547]'
                    }`}
                  title="List View"
                >
                  <i className="fas fa-list text-lg"></i>
                </button>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          {/* Sort Dropdown */}
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort by:"
            variant="primary"
            icon="fas fa-sort"
          />
        </div>

        {/* Content Area */}
        {sortedRecommendations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-[#2e3d29]/30 rounded-lg border border-[#3e503e]/30">
              <i className={`${categories.find(c => c.id === activeCategory)?.icon || 'fas fa-heart'} text-6xl text-[#e8c547]/30 mb-4 block`}></i>
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No {activeCategory === 'all' ? 'recommendations' : categories.find(c => c.id === activeCategory)?.label.toLowerCase()} found
              </h3>
              <p className="text-gray-500">
                Check back later for new recommendations!
              </p>
            </div>
          </div>
        ) : view === 'showcase' && activeCategory === 'all' ? (
          // Showcase View - Show categories separately
          <div className="space-y-12">
            {groupedRecommendations.map(group => (
              <div key={group.category.id}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-200 flex items-center gap-3">
                    <i className={`${group.category.icon} text-[#e8c547]`}></i>
                    {group.category.label}
                  </h2>
                  <button
                    onClick={() => setActiveCategory(group.category.id)}
                    className="text-sm text-[#e8c547] hover:text-[#f4d76b] transition-colors"
                  >
                    View all {stats[group.category.id]} →
                  </button>
                </div>
                <div className={`grid gap-6 ${group.category.id === 'link'
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                  {group.items.map((item) => (
                    <RecommendationCard
                      key={item._id}
                      recommendation={item}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid/List/Masonry View
          <>
            {activeCategory === 'all' && view === 'masonry' ? (
              // Masonry view - optimized for mixed content
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                {sortedRecommendations.map((item) => (
                  <div
                    key={item._id}
                    className="h-fit"
                  >
                    <RecommendationCard
                      recommendation={item}
                      variant="default"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Regular grid view
              <div className={
                view === 'list'
                  ? 'space-y-4'
                  : activeCategory === 'link'
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                    : activeCategory === 'book'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }>
                {sortedRecommendations.map((item) => (
                  <RecommendationCard
                    key={item._id}
                    recommendation={item}
                    variant={view === 'list' ? 'compact' : 'default'}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-[#e8c547] text-[#0e1b12] rounded-full shadow-lg hover:bg-[#f4d76b] transition-all duration-300 group"
            title="Back to top"
          >
            <i className="fas fa-arrow-up group-hover:-translate-y-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

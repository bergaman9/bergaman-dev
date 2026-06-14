"use client";

import { useState, useEffect } from 'react';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import Select from '../components/Select';
import PageContainer from '../components/PageContainer';
import MiniAppCard from '../components/MiniAppCard';
import { PageSkeleton, SkeletonBox, SkeletonCard, SkeletonProjectCard } from '../components/Skeleton';
import { MINI_APPS } from '@/lib/miniApps';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Mini Apps Accordion State (default: 'vocabulary')
  const [activeMiniApp, setActiveMiniApp] = useState('vocabulary');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.portfolios) {
        setPortfolioItems(data.portfolios);
      } else {
        console.error('Failed to fetch portfolios:', data.error || 'Unknown error');
        setError(data.error || 'Failed to fetch portfolios');
        setPortfolioItems([]);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setError(error.message || 'Error fetching portfolios');
      setPortfolioItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter portfolios based on active category and search
  const filteredPortfolios = portfolioItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort portfolios
  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Get unique categories from portfolio items
  const categories = ['all', ...new Set(portfolioItems.map(item => item.category))];

  // Category configurations with updated names and icons
  const categoryConfig = {
    'Web Development': {
      name: 'Web',
      icon: 'fas fa-globe',
      description: 'Modern web applications and websites',
      color: 'from-blue-500 to-cyan-500'
    },
    'Mobile App': {
      name: 'Mobile',
      icon: 'fas fa-mobile-alt',
      description: 'Mobile applications for iOS and Android',
      color: 'from-purple-500 to-pink-500'
    },
    'AI/ML': {
      name: 'AI',
      icon: 'fas fa-brain',
      description: 'Artificial intelligence and ML projects',
      color: 'from-green-500 to-emerald-500'
    },
    'Desktop App': {
      name: 'Desktop',
      icon: 'fas fa-desktop',
      description: 'Desktop software and applications',
      color: 'from-orange-500 to-red-500'
    },
    'Game Development': {
      name: 'Games',
      icon: 'fas fa-gamepad',
      description: 'Games and interactive experiences',
      color: 'from-pink-500 to-rose-500'
    },
    'Bot Development': {
      name: 'Bots',
      icon: 'fas fa-robot',
      description: 'Automated solutions and Discord bots',
      color: 'from-indigo-500 to-purple-500'
    },
    'IoT': {
      name: 'IoT',
      icon: 'fas fa-microchip',
      description: 'Internet of Things devices and solutions',
      color: 'from-teal-500 to-cyan-500'
    },
    'Design': {
      name: 'Design',
      icon: 'fas fa-palette',
      description: 'Visual design and digital artwork',
      color: 'from-yellow-500 to-orange-500'
    },
    'Branding': {
      name: 'Branding',
      icon: 'fas fa-trademark',
      description: 'Branding and identity design',
      color: 'from-red-500 to-pink-500'
    },
    'Other': {
      name: 'Other',
      icon: 'fas fa-code',
      description: 'Miscellaneous projects and experiments',
      color: 'from-gray-500 to-gray-600'
    },
    'all': {
      name: 'All Projects',
      icon: 'fas fa-th-large',
      description: 'All projects across categories',
      color: 'from-[#e8c547] to-[#d4b445]'
    }
  };

  // Get stats for each category
  const categoryStats = categories.reduce((acc, category) => {
    if (category === 'all') {
      acc[category] = portfolioItems.length;
    } else {
      acc[category] = portfolioItems.filter(item => item.category === category).length;
    }
    return acc;
  }, {});

  // Sort options for select dropdown
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: 'fas fa-calendar-alt' },
    { value: 'oldest', label: 'Oldest First', icon: 'fas fa-calendar' },
    { value: 'featured', label: 'Featured', icon: 'fas fa-star' },
    { value: 'name', label: 'Name A-Z', icon: 'fas fa-sort-alpha-down' },
    { value: 'status', label: 'Status', icon: 'fas fa-signal' }
  ];

  if (loading) {
    return (
      <PageContainer>
        <PageSkeleton
          title="Portfolio"
          subtitle="Explore my projects, tools, and experiments"
          icon="fas fa-briefcase"
          controls={
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <SkeletonBox key={index} className="h-16" />
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <SkeletonBox className="h-11 flex-1" />
                <SkeletonBox className="h-11 w-full md:w-48" />
                <SkeletonBox className="h-11 w-full md:w-32" />
              </div>
            </div>
          }
          gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-8"
          itemCount={1}
          renderItem={() => (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonProjectCard key={index} />
                ))}
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonCard key={index} showImage={false} rows={2} footer={false} />
                ))}
              </div>
            </>
          )}
        />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Portfolio"
          subtitle={`Error: ${error}`}
          icon="fas fa-briefcase"
          actions={[
            {
              label: "Try Again",
              onClick: fetchPortfolios,
              variant: "primary",
              icon: "fas fa-sync"
            }
          ]}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="page-scrollbar">
      {/* Header */}
      <PageHeader
        title="Portfolio"
        subtitle="A showcase of my projects, from web applications to automation solutions"
        icon="fas fa-briefcase"
        variant="large"
        stats={[
          {
            label: "Total Projects",
            value: portfolioItems.length,
            icon: "fas fa-folder-open"
          },
          {
            label: "Completed",
            value: portfolioItems.filter(item => item.status === 'completed').length,
            icon: "fas fa-check-circle"
          },
          {
            label: "Active",
            value: portfolioItems.filter(item => item.status === 'active').length,
            icon: "fas fa-circle"
          },
          {
            label: "Featured",
            value: portfolioItems.filter(item => item.featured).length,
            icon: "fas fa-star"
          }
        ]}
      />

      {/* Search and Controls Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-3 bg-[#2e3d29]/20 border border-[#3e503e]/30 rounded-xl">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <label htmlFor="portfolio-search" className="sr-only">Search projects</label>
            <input
              id="portfolio-search"
              type="text"
              placeholder="Search projects, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-4 pl-12 bg-[#0e1b12]/60 border border-[#3e503e]/40 rounded-lg text-gray-200 focus:outline-none focus:border-[#e8c547]/50 focus:ring-1 focus:ring-[#e8c547]/30 transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Sort */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          className="sm:min-w-[160px] h-12"
          variant="secondary"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#e8c547] mb-2 flex items-center justify-center gap-2">
            <i className="fas fa-filter"></i>
            Explore by Category
          </h2>
          <p className="text-gray-400">
            {activeCategory === 'all'
              ? 'All projects across categories'
              : categoryConfig[activeCategory]?.description
            }
          </p>
        </div>

        <div className="flex flex-nowrap sm:flex-wrap sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {categories.map((category) => {
            const config = categoryConfig[category] || { name: category, icon: 'fas fa-folder' };
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`
                  relative group shrink-0 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300
                  hover:-translate-y-0.5 text-sm sm:text-base
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60
                  ${isActive
                    ? 'bg-gradient-to-r ' + config.color + ' text-white shadow-lg'
                    : 'bg-[#1a2e1a]/50 text-gray-300 hover:bg-[#2e3d29]/50 border border-[#3e503e]/30'
                  }
                `}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <i className={`${config.icon} text-xs sm:text-sm`}></i>
                  <span>{config.name}</span>
                  <Badge
                    size="sm"
                    variant={isActive ? "light" : "secondary"}
                    className="text-xs"
                  >
                    {categoryStats[category]}
                  </Badge>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Portfolio Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Projects Section */}
        <div className="lg:col-span-2">
          {portfolioItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <i className="fas fa-folder-open text-6xl text-gray-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Projects Yet</h3>
                <p className="text-gray-500">Portfolio projects will appear here once they're added.</p>
              </div>
            </div>
          ) : filteredPortfolios.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-8">
                <i className="fas fa-search text-6xl text-gray-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Projects Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? `No projects match "${searchTerm}" in the selected category.`
                    : 'No projects match the selected category.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchTerm && (
                    <Button
                      onClick={() => setSearchTerm('')}
                      variant="secondary"
                      icon="fas fa-times"
                    >
                      Clear Search
                    </Button>
                  )}
                  <Button
                    onClick={() => setActiveCategory('all')}
                    variant="primary"
                    icon="fas fa-th-large"
                  >
                    View All Projects
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <p className="text-gray-400">
                  Showing <span className="text-[#e8c547] font-semibold">{filteredPortfolios.length}</span> project{filteredPortfolios.length !== 1 ? 's' : ''}
                  {activeCategory !== 'all' && (
                    <span> in <span className="text-[#e8c547]">{categoryConfig[activeCategory]?.name}</span></span>
                  )}
                  {searchTerm && (
                    <span> matching "<span className="text-[#e8c547]">{searchTerm}</span>"</span>
                  )}
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
                {sortedPortfolios.map((project, index) => (
                  <div
                    key={project._id}
                    className="animate-slideInUp"
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>

              {/* Back to Top Button */}
              {sortedPortfolios.length > 6 && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    variant="secondary"
                    icon="fas fa-arrow-up"
                  >
                    Back to Top
                  </Button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Sidebar for Mini Apps — a deliberate product shelf, not a leftover */}
        <aside className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-[#3e503e]/30 pt-8 lg:pt-0 lg:pl-8">
          <div className="sticky top-24 rounded-2xl bg-[#1a2e1a]/20 border border-[#3e503e]/30 p-5">
            <div className="mb-5">
              <h3 className="font-bold text-[#e8c547] flex items-center gap-2 text-lg">
                <i className="fas fa-microchip"></i> Mini Tools &amp; Apps
              </h3>
              <p className="text-sm text-gray-400 mt-1">Self-contained utilities I built and use.</p>
            </div>

            <div className="space-y-4">
              {MINI_APPS.map((app) => (
                <MiniAppCard
                  key={app.id}
                  {...app}
                  isOpen={activeMiniApp === app.id}
                  onClick={() => setActiveMiniApp(activeMiniApp === app.id ? null : app.id)}
                />
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#0e1b12]/40 border border-[#3e503e]/20 text-center">
              <p className="text-xs text-gray-500">
                <i className="fas fa-hammer mr-1.5 text-[#e8c547]/60"></i>
                More tools are being crafted
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Scoped entrance animations (motion-reduce safe) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideInUp {
          opacity: 0;
          animation: slideInUp 0.6s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn,
          .animate-slideInUp {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </PageContainer>
  );
}

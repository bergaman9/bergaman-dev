"use client";

// Force dynamic rendering to prevent initialization errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import ImageModal from '../components/ImageModal';
import Card from '../components/Card';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import SafeImage from '../components/SafeImage';
import Select from '../components/Select';
import PageContainer from '../components/PageContainer';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

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
      console.log("Portfolio API response:", data);

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

  const openModal = (project) => {
    setSelectedModal({
      src: project.image || '/images/portfolio/default.svg',
      alt: project.title
    });
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

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
        <PageHeader
          title="Portfolio"
          subtitle="Loading my projects and work..."
          icon="fas fa-briefcase"
        />

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-[#0e1b12]/95 border border-[#2e3d29]/30 rounded-xl h-[400px] flex flex-col">
              {/* Skeleton Image */}
              <div className="h-48 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-t-xl"></div>

              {/* Skeleton Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Skeleton Title */}
                <div className="h-6 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded mb-3"></div>

                {/* Skeleton Description */}
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="h-4 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
                </div>

                {/* Skeleton Tags */}
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                  <div className="h-6 w-12 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                  <div className="h-6 w-20 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded"></div>
                </div>

                {/* Skeleton Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-[#3e503e]/30">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
                    <div className="h-8 w-8 bg-gradient-to-r from-[#2e3d29] via-[#3e503e] to-[#2e3d29] bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-4 pl-12 bg-[#2e3d29]/20 border border-[#3e503e]/30 rounded-lg text-gray-200 focus:outline-none focus:border-[#e8c547]/50 transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* View Mode and Sort */}
        <div className="flex gap-3">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            className="min-w-[140px] h-12"
            variant="secondary"
          />


        </div>
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

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => {
            const config = categoryConfig[category] || { name: category, icon: 'fas fa-folder' };
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  relative group px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300
                  transform hover:scale-105 hover:-translate-y-0.5 text-sm sm:text-base
                  ${isActive
                    ? 'bg-gradient-to-r ' + config.color + ' text-white shadow-lg'
                    : 'bg-[#1a2e1a]/50 text-gray-300 hover:bg-[#2e3d29]/50 border border-[#3e503e]/30'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <i className={`${config.icon} ${isActive ? 'animate-pulse' : ''} text-xs sm:text-sm`}></i>
                  <span className="hidden sm:inline">{config.name}</span>
                  <Badge
                    size="sm"
                    variant={isActive ? "light" : "secondary"}
                    className="text-xs"
                  >
                    {categoryStats[category]}
                  </Badge>
                </span>

                {/* Hover effect */}
                {!isActive && (
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Display */}
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

          {/* Projects Grid/List */}
          <div className={`
            ${viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }
            animate-fadeIn
          `}>
            {sortedPortfolios.map((project, index) => {
              return (
                <div
                  key={project._id}
                  className="animate-slideInUp"
                  style={{
                    animationDelay: `${Math.min(index * 50, 500)}ms`
                  }}
                >
                  {viewMode === 'grid' ? (
                    <ProjectCard project={project} />
                  ) : (
                    // List View
                    <Card className="p-6 hover:border-[#e8c547]/30 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image */}
                        <div className="lg:w-1/3">
                          <div className="relative h-48 lg:h-full rounded-lg overflow-hidden bg-[#0a1a0f] cursor-pointer"
                            onClick={() => openModal(project)}>
                            <SafeImage
                              src={project.image || '/images/portfolio/default.svg'}
                              alt={project.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              <Badge
                                variant={
                                  project.status === 'active' ? 'success' :
                                    project.status === 'completed' ? 'warning' :
                                      'secondary'
                                }
                                size="sm"
                              >
                                <i className={`mr-1 text-xs ${project.status === 'active' ? 'fas fa-circle' :
                                  project.status === 'completed' ? 'fas fa-check-circle' :
                                    'fas fa-pause-circle'
                                  }`}></i>
                                {project.status === 'active' ? 'Active' :
                                  project.status === 'completed' ? 'Completed' :
                                    project.status === 'in_progress' ? 'In Progress' :
                                      'Planned'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="lg:w-2/3 flex flex-col">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-[#e8c547] mb-2">
                                {project.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span>
                                  <i className={`${categoryConfig[project.category]?.icon || 'fas fa-folder'} mr-1`}></i>
                                  {project.category}
                                </span>
                                {project.createdAt && (
                                  <span>
                                    <i className="fas fa-calendar mr-1"></i>
                                    {new Date(project.createdAt).getFullYear()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {project.featured && (
                              <Badge variant="warning" icon="fas fa-star">
                                Featured
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-300 mb-4 flex-1 line-clamp-3">
                            {project.description}
                          </p>

                          {/* Technologies */}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.slice(0, 6).map((tech, techIndex) => (
                                <Badge key={techIndex} variant="secondary" size="sm">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 6 && (
                                <Badge variant="secondary" size="sm">
                                  +{project.technologies.length - 6} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex flex-wrap items-center gap-4">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gray-400 hover:text-[#e8c547] transition-colors"
                              >
                                <i className="fas fa-external-link-alt mr-2"></i>
                                Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gray-400 hover:text-[#e8c547] transition-colors"
                              >
                                <i className="fab fa-github mr-2"></i>
                                Source Code
                              </a>
                            )}
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-gray-400 hover:text-[#e8c547] transition-colors"
                              >
                                <i className="fas fa-play-circle mr-2"></i>
                                Demo
                              </a>
                            )}
                            {!project.liveUrl && !project.githubUrl && !project.demoUrl && (
                              <span className="text-gray-500 text-sm italic">
                                No links available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              );
            })}
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

      {/* Image Modal */}
      {selectedModal && (
        <ImageModal
          src={selectedModal.src}
          alt={selectedModal.alt}
          onClose={closeModal}
        />
      )}

      {/* Custom animations and styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideInUp {
          opacity: 0;
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Grid improvements */
        .grid {
          display: grid;
          align-items: stretch;
        }
        
        /* Ensure consistent card heights */
        .grid > div {
          display: flex;
          flex-direction: column;
        }
        
        /* Image loading placeholder */
        .image-loading {
          background: linear-gradient(
            90deg,
            #2e3d29 25%,
            #3e503e 50%,
            #2e3d29 75%
          );
          background-size: 200% 100%;
          animation: loading-shimmer 2s infinite;
        }
        
        @keyframes loading-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </PageContainer>
  );
}

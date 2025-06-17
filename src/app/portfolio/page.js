"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageModal from '../components/ImageModal';
import Card from '../components/Card';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import PageHeader from '../components/PageHeader';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      // Use our new dedicated API endpoint
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
        console.log(`Found ${data.portfolios.length} portfolio items`);
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

  // Filter portfolios based on active category
  const filteredPortfolios = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  // Get unique categories from portfolio items
  const categories = ['all', ...new Set(portfolioItems.map(item => item.category))];

  // Category configurations with updated names and icons
  const categoryConfig = {
    'Web': { name: 'Web Development', icon: 'fas fa-globe', description: 'Modern web applications and websites' },
    'Mobile': { name: 'Mobile Apps', icon: 'fas fa-mobile-alt', description: 'Mobile applications for iOS and Android' },
    'AI': { name: 'AI & Machine Learning', icon: 'fas fa-brain', description: 'Artificial intelligence and ML projects' },
    'Desktop': { name: 'Desktop Applications', icon: 'fas fa-desktop', description: 'Desktop software and applications' },
    'Game': { name: 'Game Development', icon: 'fas fa-gamepad', description: 'Games and interactive experiences' },
    'Bot': { name: 'Bots & Automation', icon: 'fas fa-robot', description: 'Automated solutions and Discord bots' },
    'IoT': { name: 'IoT Projects', icon: 'fas fa-microchip', description: 'Internet of Things devices and solutions' },
    'Graphic Design': { name: 'Graphic Design', icon: 'fas fa-palette', description: 'Visual design and digital artwork' },
    'Brand': { name: 'Brand Projects', icon: 'fas fa-copyright', description: 'Branding and identity design' },
    'Other': { name: 'Other Projects', icon: 'fas fa-folder', description: 'Miscellaneous projects and experiments' },
    'all': { name: 'All Projects', icon: 'fas fa-th-large', description: 'All projects across categories' }
  };

  // Get placeholder image based on category
  const getPlaceholderImage = (category) => {
    const placeholders = {
      Web: '/images/portfolio/web-placeholder.svg',
      Mobile: '/images/portfolio/mobile-placeholder.svg',
      AI: '/images/portfolio/ai-placeholder.svg',
      Desktop: '/images/portfolio/desktop-placeholder.svg',
      Game: '/images/portfolio/game-placeholder.svg',
      Bot: '/images/portfolio/bot-placeholder.svg',
      IoT: '/images/portfolio/iot-placeholder.svg',
      'Graphic Design': '/images/portfolio/design-placeholder.svg',
      Brand: '/images/portfolio/brand-placeholder.svg',
      Other: '/images/portfolio/default.svg'
    };
    
    return placeholders[category] || '/images/portfolio/default.svg';
  };

  const openModal = (project) => {
    setSelectedModal({
      src: project.image || getPlaceholderImage(project.category),
      alt: project.title
    });
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen page-container">
        <div className="page-content">
          <PageHeader 
            title="Portfolio"
            subtitle="Loading my projects and work..."
            icon="fas fa-briefcase"
          />
          
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-container">
        <div className="page-content">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-container">
      <div className="page-content">
        {/* Header */}
        <PageHeader 
          title="Portfolio"
          subtitle="A showcase of my projects, from web applications to automation solutions"
          icon="fas fa-briefcase"
          variant="large"
          stats={[
            { label: "Total Projects", value: portfolioItems.length },
            { label: "Categories", value: categories.filter(c => c !== 'all').length },
            { label: "Featured", value: portfolioItems.filter(item => item.featured).length }
          ]}
        />

        {/* Category Filter */}
        <div className="content-section mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categories.map((category) => {
              const config = categoryConfig[category] || { name: category, icon: 'fas fa-folder' };
              
              return (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  variant={activeCategory === category ? "primary" : "secondary"}
                  size="sm"
                >
                  <i className={`${config.icon} mr-2`}></i>
                  <span>{config.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

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
              <p className="text-gray-500">No projects match the selected category.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedModal && (
        <ImageModal
          src={selectedModal.src}
          alt={selectedModal.alt}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

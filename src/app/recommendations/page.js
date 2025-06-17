"use client";

import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import RecommendationCard from '../components/RecommendationCard';

// Category configurations
const categoryConfig = {
  movie: { name: 'Movies', icon: 'fas fa-film' },
  game: { name: 'Games', icon: 'fas fa-gamepad' },
  book: { name: 'Books', icon: 'fas fa-book' },
  music: { name: 'Music', icon: 'fas fa-music' },
  series: { name: 'TV Series', icon: 'fas fa-tv' },
  link: { name: 'Links & Tools', icon: 'fas fa-link' },
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('movie');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations(activeCategory);
  }, [activeCategory]);

  const fetchRecommendations = async (category) => {
    try {
      setLoading(true);
      const url = `/api/recommendations?category=${category}`;
      
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'Error fetching recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDetails = (category) => {
    return categoryConfig[category] || { name: category, icon: 'fas fa-star' };
  };
  
  const categories = ['movie', 'game', 'book', 'series', 'link'];
  const filteredRecommendations = recommendations;

  return (
    <div className="min-h-screen page-container">
      <div className="page-content">
        {/* Header */}
        <PageHeader
          title="Recommendations"
          subtitle="A curated list of my favorite movies, games, books, and tools."
          icon="fas fa-heart"
          variant="large"
          stats={[
            { label: "Total", value: recommendations.length },
            { label: "Categories", value: categories.length }
          ]}
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => {
            const { name, icon } = getCategoryDetails(category);
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category
                    ? 'bg-[#e8c547] text-[#0e1b12]'
                    : 'bg-[#2e3d29]/20 hover:bg-[#e8c547]/20 border border-[#3e503e]/30'
                }`}
              >
                <i className={icon}></i>
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecommendations.map((item) => (
              <RecommendationCard
                key={item._id}
                recommendation={item}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400">No recommendations found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Category configurations
const categoryConfig = {
  movie: { name: 'Movies', icon: 'fas fa-film' },
  game: { name: 'Games', icon: 'fas fa-gamepad' },
  book: { name: 'Books', icon: 'fas fa-book' },
  music: { name: 'Music', icon: 'fas fa-music' },
  series: { name: 'TV Series', icon: 'fas fa-tv' },
  link: { name: 'Links & Tools', icon: 'fas fa-link' },
  all: { name: 'All Recommendations', icon: 'fas fa-th-large' },
};

// Get placeholder image for a category
const getPlaceholderImage = (category) => {
  const placeholders = {
    movie: '/images/movies/default.jpg',
    book: '/images/books/default.jpg',
    game: '/images/games/default.jpg',
    music: '/images/music/default.jpg',
    series: '/images/series/default.jpg',
    link: '/images/links/default.png',
  };
  return placeholders[category] || '/images/links/default.png';
};

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations(activeCategory);
  }, [activeCategory]);

  const fetchRecommendations = async (category) => {
    try {
      setLoading(true);
      const url = category === 'all' 
        ? '/api/recommendations' 
        : `/api/recommendations?category=${category}`;
      
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
  
  const categories = ['all', 'movie', 'game', 'book', 'series', 'link'];
  const filteredRecommendations = recommendations;

  return (
    <div className="min-h-screen page-container">
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            <i className="page-title-icon fas fa-heart"></i>
            Recommendations
          </h1>
          <p className="page-subtitle">
            A curated list of my favorite movies, games, books, and tools.
          </p>
        </div>

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
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((item) => (
              <div
                key={item._id}
                className="bg-[#2e3d29]/20 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden hover:border-[#e8c547]/50 transition-all duration-300 group"
              >
                <div className="relative h-48">
                  <Image
                    src={item.image || getPlaceholderImage(item.category)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = getPlaceholderImage(item.category); }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-medium flex items-center gap-1">
                      <i className="fas fa-star"></i>{item.rating}/10
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="px-3 py-1 bg-[#0e1b12]/80 text-gray-300 rounded-full text-xs flex items-center gap-1 mb-2 capitalize w-fit">
                    <i className={getCategoryDetails(item.category).icon}></i>
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#e8c547] mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">{item.recommendation}</p>
                  {item.category === 'link' && item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#e8c547] hover:underline text-sm">
                      Visit Link <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No recommendations found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

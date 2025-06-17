"use client";

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Button from '@/app/components/Button';
import ImageUpload from '@/app/components/ImageUpload';
import Modal from '@/app/components/Modal';
import Card from '@/app/components/Card';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';

export default function AdminRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'movie',
    image: '',
    rating: 5,
    year: new Date().getFullYear(),
    genre: '',
    director: '',
    author: '',
    developer: '',
    url: '',
    linkType: '',
    recommendation: '',
    status: 'active',
    order: 0
  });

  const categories = [
    { value: 'movie', label: 'Movie', icon: 'fas fa-film' },
    { value: 'game', label: 'Game', icon: 'fas fa-gamepad' },
    { value: 'book', label: 'Book', icon: 'fas fa-book' },
    { value: 'series', label: 'Series', icon: 'fas fa-tv' },
    { value: 'music', label: 'Music', icon: 'fas fa-music' },
    { value: 'link', label: 'Link', icon: 'fas fa-external-link-alt' }
  ];

  const linkTypes = [
    'Development',
    'Documentation',
    'CSS Framework',
    'Deployment',
    'Database',
    'Other'
  ];

  // Önceden tanımlanmış görseller
  const predefinedImages = {
    game: [
      '/images/games/witcher3.png',
      '/images/games/rdr2.png',
      '/images/games/cyberpunk2077.png',
      '/images/games/rdr2.jpg',
      '/images/portfolio/game-placeholder.svg'
    ],
    movie: [
      '/images/movies/matrix.jpg',
      '/images/movies/inception.jpg',
      '/images/movies/terminator.png',
      '/images/movies/teknominator.png',
      '/images/movies/drive.png',
      '/images/movies/dune.jpg',
      '/images/movies/foundation.jpg',
      '/images/movies/hitchhiker.jpg',
      '/images/movies/neuromancer.jpg'
    ],
    book: [
      '/images/books/1984.png',
      '/images/books/sapiens.png',
      '/images/books/ikigai.png'
    ],
    series: [
      '/images/movies/foundation.jpg'
    ],
    link: [
      '/images/portfolio/web-placeholder.svg',
      '/images/portfolio/ai-placeholder.svg',
      '/images/portfolio/bot-placeholder.svg',
      '/images/portfolio/brand-placeholder.svg',
      '/images/portfolio/default.svg',
      '/images/portfolio/design-placeholder.svg',
      '/images/portfolio/desktop-placeholder.svg',
      '/images/portfolio/game-placeholder.svg',
      '/images/portfolio/iot-placeholder.svg',
      '/images/portfolio/mobile-placeholder.svg',
      '/images/portfolio/web-project.svg',
      '/images/portfolio/ai-project.svg'
    ]
  };

  // Tüm görselleri bir arada gösteren fonksiyon
  const getAllImages = () => {
    const allImages = [];
    Object.values(predefinedImages).forEach(categoryImages => {
      categoryImages.forEach(img => {
        if (!allImages.includes(img)) {
          allImages.push(img);
        }
      });
    });
    return allImages;
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/recommendations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingRecommendation 
        ? `/api/admin/recommendations/${editingRecommendation._id}`
        : '/api/admin/recommendations';
      
      const method = editingRecommendation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingRecommendation ? 'Recommendation updated!' : 'Recommendation created!');
        setShowModal(false);
        resetForm();
        fetchRecommendations();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error('Failed to save recommendation');
    }
  };

  const handleEdit = (recommendation) => {
    setEditingRecommendation(recommendation);
    setFormData({
      title: recommendation.title,
      description: recommendation.description,
      category: recommendation.category,
      image: recommendation.image,
      rating: recommendation.rating,
      year: recommendation.year || new Date().getFullYear(),
      genre: recommendation.genre || '',
      director: recommendation.director || '',
      author: recommendation.author || '',
      developer: recommendation.developer || '',
      url: recommendation.url || '',
      linkType: recommendation.linkType || '',
      recommendation: recommendation.recommendation,
      status: recommendation.status,
      order: recommendation.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/recommendations/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Recommendation deleted!');
        fetchRecommendations();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast.error('Failed to delete recommendation');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'movie',
      image: '',
      rating: 5,
      year: new Date().getFullYear(),
      genre: '',
      director: '',
      author: '',
      developer: '',
      url: '',
      linkType: '',
      recommendation: '',
      status: 'active',
      order: 0
    });
    setEditingRecommendation(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size too large (max 5MB)');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      toast.loading('Uploading image...');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image: data.url
        }));
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Görsel seçme işlevi
  const handleSelectImage = (imageUrl) => {
    setFormData({...formData, image: imageUrl});
    setShowImageSelector(false);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesFilter = filter === 'all' || rec.category === filter;
    const matchesSearch = !searchTerm || 
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    return {
      all: recommendations.length,
      movie: recommendations.filter(r => r.category === 'movie').length,
      game: recommendations.filter(r => r.category === 'game').length,
      book: recommendations.filter(r => r.category === 'book').length,
      series: recommendations.filter(r => r.category === 'series').length,
      music: recommendations.filter(r => r.category === 'music').length,
      link: recommendations.filter(r => r.category === 'link').length
    };
  };

  // Handle stat filter click
  const handleStatFilter = (key) => {
    setActiveFilter(key);
    
    // Filter recommendations based on the selected category
    if (key === 'all') {
      fetchRecommendations();
    } else {
      fetchRecommendations(key);
    }
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e8c547]"></div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="admin-content">
      {/* Header */}
      <PageHeader
        title="Recommendations"
        subtitle="Manage your recommendations for books, movies, games, and more"
        icon="fas fa-heart"
        actions={[
          {
            label: "Add New",
            variant: "primary",
            icon: "fas fa-plus",
            iconPosition: "left",
            onClick: () => {
              resetForm();
              setShowModal(true);
            }
          }
        ]}
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleStatFilter(key)}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              activeFilter === key 
                ? 'bg-[#e8c547]/10 border-[#e8c547]/30 text-white' 
                : 'bg-[#2e3d29]/20 border-[#3e503e]/30 hover:bg-[#2e3d29]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">{key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
              <div className={`text-2xl ${key === 'all' ? 'text-[#e8c547]' : key === 'movie' ? 'text-blue-400' : key === 'game' ? 'text-green-400' : key === 'book' ? 'text-purple-400' : key === 'series' ? 'text-red-400' : key === 'music' ? 'text-pink-400' : 'text-gray-400'}`}>
                <i className={`${key === 'all' ? 'fas fa-list' : key === 'movie' ? 'fas fa-film' : key === 'game' ? 'fas fa-gamepad' : key === 'book' ? 'fas fa-book' : key === 'series' ? 'fas fa-tv' : key === 'music' ? 'fas fa-music' : 'fas fa-link'}`}></i>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search recommendations..."
          className="flex-grow px-4 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation._id}
              className="bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg p-6 hover:border-[#e8c547] transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {recommendation.image ? (
                      <Image
                        src={recommendation.image}
                        alt={recommendation.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className={`${categories.find(c => c.value === recommendation.category)?.icon} text-gray-500`}></i>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recommendation.category === 'movie' ? 'bg-red-500/20 text-red-400' :
                        recommendation.category === 'game' ? 'bg-blue-500/20 text-blue-400' :
                        recommendation.category === 'book' ? 'bg-green-500/20 text-green-400' :
                        recommendation.category === 'link' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {recommendation.category}
                      </span>
                      {recommendation.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recommendation.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {recommendation.status}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-2">{recommendation.description}</p>
                    
                    {/* Meta info */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
                      {recommendation.year && <span>Year: {recommendation.year}</span>}
                      {recommendation.rating && <span>Rating: {recommendation.rating}/10</span>}
                      {recommendation.genre && <span>Genre: {recommendation.genre}</span>}
                      {recommendation.director && <span>Director: {recommendation.director}</span>}
                      {recommendation.author && <span>Author: {recommendation.author}</span>}
                      {recommendation.developer && <span>Developer: {recommendation.developer}</span>}
                      {recommendation.linkType && <span>Type: {recommendation.linkType}</span>}
                      {recommendation.url && (
                        <a href={recommendation.url} target="_blank" rel="noopener noreferrer" className="text-[#e8c547] hover:underline">
                          Visit Link
                        </a>
                      )}
                    </div>

                    <div className="bg-[#1a241a]/50 border-l-4 border-[#e8c547] p-2 text-sm text-gray-300 italic">
                      "{recommendation.recommendation}"
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(recommendation)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors duration-300"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(recommendation._id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-heart text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No recommendations found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first recommendation.</p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-[#e8c547] text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-300"
            >
              Add First Recommendation
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRecommendation ? 'Edit Recommendation' : 'Add Recommendation'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Personal Recommendation *</label>
                <textarea
                  value={formData.recommendation}
                  onChange={(e) => setFormData({...formData, recommendation: e.target.value})}
                  rows={3}
                  placeholder="Your personal note about why you recommend this..."
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Category-specific and Metadata */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Details & Media</h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageSelector(!showImageSelector)}
                      className="px-4 py-2 bg-[#2e3d29]/50 border border-[#3e503e] rounded-lg text-white hover:bg-[#2e3d29] transition-colors"
                    >
                      <i className="fas fa-images mr-2"></i>
                      Choose from Library
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#2e3d29]/50 border border-[#3e503e] rounded-lg text-white hover:bg-[#2e3d29] transition-colors"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Upload New
                    </button>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Image Selector */}
                  {showImageSelector && (
                    <div className="mt-4 p-4 bg-[#1a241a] border border-[#3e503e] rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-[#e8c547]">Select an Image</h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowImageSelector(false)}
                            className="text-gray-400 hover:text-white text-sm"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        <button
                          type="button"
                          onClick={() => setFilter('all')}
                          className={`px-3 py-1 text-xs rounded-full ${
                            filter === 'all' 
                              ? 'bg-[#e8c547] text-[#0e1b12]' 
                              : 'bg-[#2e3d29]/50 text-gray-300'
                          }`}
                        >
                          All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
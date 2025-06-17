"use client";

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Select from '@/app/components/Select';
import ImageUpload from '@/app/components/ImageUpload';
import Modal from '@/app/components/Modal';
import Card from '@/app/components/Card';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/PageHeader';
import RecommendationCard from '../../../components/RecommendationCard';

export default function AdminRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('movie');
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [filter, setFilter] = useState('movie');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'movie',
    image: '',
    rating: 7.5,
    year: new Date().getFullYear(),
    genre: '',
    director: '',
    author: '',
    developer: '',
    url: '',
    link: '',
    linkType: '',
    recommendation: '',
    status: 'active',
    order: 0
  });

  // Add state to track click position for modal
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const categories = [
    { value: 'movie', label: 'Movie', icon: 'fas fa-film' },
    { value: 'game', label: 'Game', icon: 'fas fa-gamepad' },
    { value: 'book', label: 'Book', icon: 'fas fa-book' },
    { value: 'series', label: 'Series', icon: 'fas fa-tv' },
    { value: 'music', label: 'Music', icon: 'fas fa-music' },
    { value: 'link', label: 'Link', icon: 'fas fa-external-link-alt' }
  ];

  const linkTypeOptions = [
    { value: 'Development', label: 'Development', icon: 'fas fa-code' },
    { value: 'Documentation', label: 'Documentation', icon: 'fas fa-book' },
    { value: 'CSS Framework', label: 'CSS Framework', icon: 'fab fa-css3' },
    { value: 'Deployment', label: 'Deployment', icon: 'fas fa-rocket' },
    { value: 'Database', label: 'Database', icon: 'fas fa-database' },
    { value: 'Other', label: 'Other', icon: 'fas fa-ellipsis-h' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', icon: 'fas fa-check-circle' },
    { value: 'draft', label: 'Draft', icon: 'fas fa-pencil-alt' },
    { value: 'archived', label: 'Archived', icon: 'fas fa-archive' }
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

  const handleUploadImage = async (file) => {
    if (!file) return null;
    
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.url;
      } else {
        toast.error('Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (recommendation, e) => {
    // Store click position for modal positioning
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Doğrudan modal pozisyonunu ayarlamak yerine sadece düzenleme modunu açıyoruz
      setEditingRecommendation(recommendation);
      setFormData({
        title: recommendation.title,
        description: recommendation.description,
        category: recommendation.category,
        image: recommendation.image,
        rating: recommendation.rating || 7.5,
        year: recommendation.year || new Date().getFullYear(),
        genre: recommendation.genre || '',
        director: recommendation.director || '',
        author: recommendation.author || '',
        developer: recommendation.developer || '',
        url: recommendation.url || recommendation.link || '',
        link: recommendation.link || recommendation.url || '',
        linkType: recommendation.linkType || '',
        recommendation: recommendation.recommendation,
        status: recommendation.status,
        order: recommendation.order || 0
      });
      
      // Modal'ı hemen açıyoruz
      setShowModal(true);
      return;
    }
    
    setEditingRecommendation(recommendation);
    setFormData({
      title: recommendation.title,
      description: recommendation.description,
      category: recommendation.category,
      image: recommendation.image,
      rating: recommendation.rating || 7.5,
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
      rating: 7.5,
      year: new Date().getFullYear(),
      genre: '',
      director: '',
      author: '',
      developer: '',
      url: '',
      link: '',
      linkType: '',
      recommendation: '',
      status: 'active',
      order: 0
    });
    setEditingRecommendation(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectImage = (imageUrl) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
    setShowImageSelector(false);
  };

  const handleImageUpload = async (imageUrl) => {
    if (imageUrl) {
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  // Filter recommendations based on the current filter
  const filteredRecommendations = recommendations.filter(item => {
    // Status filters
    if (filter === 'active' && item.status === 'active') return true;
    if (filter === 'draft' && item.status === 'draft') return true;
    if (filter === 'archived' && item.status === 'archived') return true;
    
    // Category filters
    if (filter === 'movie' && item.category === 'movie') return true;
    if (filter === 'game' && item.category === 'game') return true;
    if (filter === 'book' && item.category === 'book') return true;
    if (filter === 'series' && item.category === 'series') return true;
    if (filter === 'music' && item.category === 'music') return true;
    if (filter === 'link' && item.category === 'link') return true;
    
    return false;
  }).filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.genre?.toLowerCase().includes(searchLower) ||
      item.director?.toLowerCase().includes(searchLower) ||
      item.author?.toLowerCase().includes(searchLower) ||
      item.developer?.toLowerCase().includes(searchLower) ||
      item.recommendation?.toLowerCase().includes(searchLower)
    );
  });

  // Get stats for each category
  const getStats = () => {
    const stats = { all: recommendations.length };
    categories.forEach(cat => {
      stats[cat.value] = recommendations.filter(rec => rec.category === cat.value).length;
    });
    return stats;
  };

  const stats = getStats();

  const handleStatFilter = (key) => {
    if (key === 'active' || key === 'draft' || key === 'archived') {
      setFilter(key);
      return;
    }
    
    setFilter(key);
  };

  // Add genre options for different categories
  const movieGenres = [
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Animation', label: 'Animation' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Documentary', label: 'Documentary' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Western', label: 'Western' }
  ];
  
  const bookGenres = [
    { value: 'Biography', label: 'Biography' },
    { value: 'Business', label: 'Business' },
    { value: 'Children', label: 'Children' },
    { value: 'Classics', label: 'Classics' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'History', label: 'History' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Non-fiction', label: 'Non-fiction' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Sci-Fi', label: 'Science Fiction' },
    { value: 'Self-Help', label: 'Self-Help' },
    { value: 'Thriller', label: 'Thriller' }
  ];
  
  const gameGenres = [
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Casual', label: 'Casual' },
    { value: 'Fighting', label: 'Fighting' },
    { value: 'FPS', label: 'FPS' },
    { value: 'Indie', label: 'Indie' },
    { value: 'MMO', label: 'MMO' },
    { value: 'Platformer', label: 'Platformer' },
    { value: 'Puzzle', label: 'Puzzle' },
    { value: 'Racing', label: 'Racing' },
    { value: 'RPG', label: 'RPG' },
    { value: 'Simulation', label: 'Simulation' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Strategy', label: 'Strategy' }
  ];

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'movie':
        return (
          <>
            <div className="mb-4">
              <Input
                label="Director"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                placeholder="Director name"
              />
            </div>
            <div className="mb-4">
              <Select
                label="Genre"
                options={movieGenres}
                value={formData.genre}
                onChange={(value) => handleSelectChange('genre', value)}
                placeholder="Select genre"
                variant="primary"
                fullWidth
              />
            </div>
          </>
        );
      case 'book':
        return (
          <>
            <div className="mb-4">
              <Input
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
              />
            </div>
            <div className="mb-4">
              <Select
                label="Genre"
                options={bookGenres}
                value={formData.genre}
                onChange={(value) => handleSelectChange('genre', value)}
                placeholder="Select genre"
                variant="primary"
                fullWidth
              />
            </div>
          </>
        );
      case 'game':
        return (
          <>
            <div className="mb-4">
              <Input
                label="Developer"
                name="developer"
                value={formData.developer}
                onChange={handleInputChange}
                placeholder="Developer name"
              />
            </div>
            <div className="mb-4">
              <Select
                label="Genre"
                options={gameGenres}
                value={formData.genre}
                onChange={(value) => handleSelectChange('genre', value)}
                placeholder="Select genre"
                variant="primary"
                fullWidth
              />
            </div>
          </>
        );
      case 'link':
        return (
          <>
            <div className="mb-4">
              <Input
                label="URL"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="mb-4">
              <Select
                label="Link Type"
                options={linkTypeOptions}
                value={formData.linkType}
                onChange={(value) => handleSelectChange('linkType', value)}
                placeholder="Select link type"
                variant="primary"
                fullWidth
              />
            </div>
          </>
        );
      case 'music':
        return (
          <>
            <div className="mb-4">
              <Input
                label="Artist"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Artist name"
              />
            </div>
            <div className="mb-4">
              <Input
                label="Spotify URL"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://open.spotify.com/track/..."
              />
            </div>
            <div className="mb-4">
              <Input
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="Music genre (Pop, Rock, Hip-Hop, etc.)"
              />
            </div>
          </>
        );
      case 'series':
        return (
          <>
            <div className="mb-4">
              <Input
                label="Director/Creator"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                placeholder="Director or creator name"
              />
            </div>
            <div className="mb-4">
              <Select
                label="Genre"
                options={movieGenres}
                value={formData.genre}
                onChange={(value) => handleSelectChange('genre', value)}
                placeholder="Select genre"
                variant="primary"
                fullWidth
              />
            </div>
            <div className="mb-4">
              <Input
                label="Streaming Link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="Netflix, HBO, etc. URL"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-content">
      <PageHeader
        title="Recommendations"
        subtitle="Manage your recommendations"
        icon="fas fa-star"
        actions={[
          {
            label: 'Add New',
            variant: 'primary',
            icon: 'fas fa-plus',
            onClick: () => {
              resetForm();
              setShowModal(true);
            }
          }
        ]}
      />
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleStatFilter('movie')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'movie'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-film text-sm mr-2"></i>
          <span>Movie</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.movie}
          </span>
        </button>
        
        <button
          onClick={() => handleStatFilter('game')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'game'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-gamepad text-sm mr-2"></i>
          <span>Game</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.game}
          </span>
        </button>
        
        <button
          onClick={() => handleStatFilter('book')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'book'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-book text-sm mr-2"></i>
          <span>Book</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.book}
          </span>
        </button>
        
        <button
          onClick={() => handleStatFilter('series')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'series'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-tv text-sm mr-2"></i>
          <span>Series</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.series}
          </span>
        </button>
        
        <button
          onClick={() => handleStatFilter('music')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'music'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-music text-sm mr-2"></i>
          <span>Music</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.music}
          </span>
        </button>
        
        <button
          onClick={() => handleStatFilter('link')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeFilter === 'link'
              ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
              : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
          }`}
        >
          <i className="fas fa-link text-sm mr-2"></i>
          <span>Link</span>
          <span className="ml-2 bg-[#2e3d29] px-2 py-0.5 rounded-full text-xs">
            {stats.link}
          </span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 bg-[#2e3d29]/20 border border-[#3e503e]/30 rounded-lg text-gray-200 focus:outline-none focus:border-[#e8c547]/50"
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
      </div>
      
      {/* Recommendations Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547]"></div>
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation._id}
              recommendation={recommendation}
              variant="admin"
              onEdit={handleEdit}
              isAdminMode={true}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-400 mb-2">No recommendations found</h3>
            <p className="text-gray-500">
              {filter !== 'movie' 
                ? `No ${filter} recommendations found. Try a different filter or add a new one.`
                : searchTerm 
                  ? `No results found for "${searchTerm}". Try a different search term.`
                  : 'No recommendations found. Add a new recommendation to get started.'}
            </p>
          </div>
        </div>
      )}
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingRecommendation ? `Edit Recommendation: ${editingRecommendation.title}` : "Add New Recommendation"}
        size="4xl"
        variant="default"
        position="center"
        hideFooter={true}
        scrollable={true}
        zIndex={1050}
        preventScroll={true}
      >
        <form id="modalForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#e8c547]">Basic Information</h3>
              
              <div className="mb-4">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <Select
                  label="Category"
                  options={categories}
                  value={formData.category}
                  onChange={(value) => handleSelectChange('category', value)}
                  placeholder="Select category"
                  variant="primary"
                  fullWidth
                  required
                />
              </div>
              
              <div className="mb-4">
                <Input
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year of release"
                />
              </div>
              
              <div className="mb-4">
                <Input
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description"
                />
              </div>
              
              {/* Rating - Only for movies, series, games, and books */}
              {formData.category !== 'link' && formData.category !== 'music' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (1-10)
                  </label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-3 text-lg font-medium text-[#e8c547]">
                        {formData.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: num })}
                          className={`text-lg ${
                            Math.round(formData.rating) === num ? 'text-[#e8c547]' : 'text-gray-500'
                          } focus:outline-none transition-colors duration-200`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => {
                          const starValue = (i + 1) * 2;
                          const isHalfFilled = formData.rating > starValue - 2 && formData.rating < starValue;
                          const isFilled = formData.rating >= starValue;
                          
                          return (
                            <div key={i} className="relative">
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: starValue - 1 })}
                                className="absolute left-0 w-1/2 h-full z-10 focus:outline-none"
                                title={`${starValue - 1}`}
                              ></button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: starValue })}
                                className="absolute right-0 w-1/2 h-full z-10 focus:outline-none"
                                title={`${starValue}`}
                              ></button>
                              <span className="text-2xl">
                                {isHalfFilled ? (
                                  <span className="text-[#e8c547]">
                                    <i className="fas fa-star-half-alt"></i>
                                  </span>
                                ) : isFilled ? (
                                  <span className="text-[#e8c547]">
                                    <i className="fas fa-star"></i>
                                  </span>
                                ) : (
                                  <span className="text-gray-500">
                                    <i className="far fa-star"></i>
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {renderCategorySpecificFields()}
              
              <div className="mb-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleSelectChange('status', value)}
                  placeholder="Select status"
                  variant="primary"
                  fullWidth
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#e8c547]">Details & Media</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image
                </label>
                <div className="flex flex-col space-y-4">
                  <div className="relative w-full h-48 bg-[#0e1b12] border border-[#3e503e] rounded-lg overflow-hidden">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Recommendation"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <i className="fas fa-image text-3xl"></i>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <ImageUpload 
                      onImageUpload={handleImageUpload} 
                      currentImage={formData.image} 
                    />
                    
                    {/* Image URL Input */}
                    <div className="mt-2">
                      <Input
                        label="Image URL"
                        name="image"
                        value={formData.image || ''}
                        onChange={handleInputChange}
                        placeholder="Enter image URL or upload an image"
                        className="w-full"
                      />
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="fas fa-images"
                      onClick={() => setShowImageSelector(true)}
                    >
                      Choose from Library
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personal Recommendation
                </label>
                <textarea
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleInputChange}
                  placeholder="Why do you recommend this?"
                  className="w-full px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#e8c547] focus:border-[#e8c547] transition-all duration-300"
                  rows="6"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <Input
                  label="Display Order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  placeholder="Display order (lower numbers shown first)"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={uploadingImage}
                >
                  {editingRecommendation ? 'Update' : 'Create'} Recommendation
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
      
      {/* Image Selector Modal */}
      <Modal
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        title="Select Image"
        size="4xl"
        position="center"
        preventScroll={true}
        zIndex={1100}
        hideFooter={true}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(formData.category !== 'all' && predefinedImages[formData.category]
            ? predefinedImages[formData.category]
            : getAllImages()
          ).map((img, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 hover:border-[#e8c547] transition-all duration-200"
              onClick={() => handleSelectImage(img)}
            >
              <Image
                src={img}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            variant="secondary"
            onClick={() => setShowImageSelector(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
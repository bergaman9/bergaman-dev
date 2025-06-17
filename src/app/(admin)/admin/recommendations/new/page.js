"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ImageUpload from '@/app/components/ImageUpload';
import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import PageHeader from '@/app/components/PageHeader';

export default function NewRecommendationPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState({
    title: '',
    category: 'game',
    description: '',
    image: '',
    rating: 8,
    year: new Date().getFullYear(),
    genre: '',
    developer: '',
    author: '',
    director: '',
    platform: '',
    linkType: '',
    url: '',
    recommendation: '',
    featured: false,
    status: 'active',
    order: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRecommendation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (url) => {
    setRecommendation(prev => ({ ...prev, image: url }));
  };

  // Görsel seçme işlevi
  const handleSelectImage = (imageUrl) => {
    setRecommendation(prev => ({ ...prev, image: imageUrl }));
    setShowImageSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendation),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create recommendation.');
      }

      toast.success('Recommendation created successfully!');
      router.push('/admin/recommendations');
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="admin-content">
      {/* Header */}
      <PageHeader
        title="New Recommendation"
        subtitle="Create a new recommendation for books, movies, games, and more"
        icon="fas fa-plus-circle"
        backButton={true}
        backButtonText="Back to Recommendations"
        onBackClick={() => router.back()}
      />

      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={recommendation.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  value={recommendation.category}
                  onChange={handleChange}
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
                  name="description"
                  value={recommendation.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Personal Recommendation *</label>
                <textarea
                  name="recommendation"
                  value={recommendation.recommendation}
                  onChange={handleChange}
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle file upload
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        toast.loading('Uploading image...');
                        
                        fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        })
                        .then(response => response.json())
                        .then(data => {
                          toast.dismiss();
                          if (data.success) {
                            handleImageUpload(data.url);
                            toast.success('Image uploaded successfully');
                          } else {
                            throw new Error(data.error || 'Upload failed');
                          }
                        })
                        .catch(error => {
                          toast.dismiss();
                          toast.error(`Failed to upload image: ${error.message}`);
                        });
                      }
                    }}
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
                        {Object.keys(predefinedImages).map(category => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setFilter(category)}
                            className={`px-3 py-1 text-xs rounded-full capitalize ${
                              filter === category 
                                ? 'bg-[#e8c547] text-[#0e1b12]' 
                                : 'bg-[#2e3d29]/50 text-gray-300'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-1">
                        {(filter === 'all' ? getAllImages() : predefinedImages[filter] || []).map((img, index) => (
                          <div 
                            key={index} 
                            className={`relative h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                              recommendation.image === img ? 'border-[#e8c547]' : 'border-transparent hover:border-[#e8c547]/50'
                            }`}
                            onClick={() => handleSelectImage(img)}
                          >
                            <Image
                              src={img}
                              alt={`Predefined image ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                console.error('Image load error:', img);
                                e.target.src = '/images/portfolio/default.svg';
                              }}
                            />
                            {recommendation.image === img && (
                              <div className="absolute top-1 right-1 bg-[#e8c547] rounded-full p-1">
                                <i className="fas fa-check text-xs text-[#0e1b12]"></i>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {(filter === 'all' ? getAllImages() : predefinedImages[filter] || []).length === 0 && (
                          <div className="col-span-3 py-8 text-center text-gray-400">
                            No predefined images available for this category.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 relative h-48 rounded-lg overflow-hidden border border-[#3e503e]">
                    {recommendation.image ? (
                      <Image
                        src={recommendation.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error('Image load error:', recommendation.image);
                          e.target.src = '/images/portfolio/default.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1a241a]">
                        <i className="fas fa-image text-4xl text-gray-500"></i>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Keep the URL input as a fallback/alternative */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (alternative)</label>
                  <input
                    type="text"
                    name="image"
                    value={recommendation.image}
                    onChange={handleChange}
                    placeholder="/images/category/image.jpg or https://example.com/image.jpg"
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    <i className="fas fa-info-circle mr-1"></i>
                    You can use relative paths (e.g., /images/games/game.png) or full URLs
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-10)</label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="10"
                    step="0.1"
                    value={recommendation.rating}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={recommendation.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={recommendation.genre}
                  onChange={handleChange}
                  placeholder="e.g., Action, RPG, Sci-Fi"
                  className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                />
              </div>

              {/* Category-specific fields */}
              {(recommendation.category === 'movie' || recommendation.category === 'series') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
                  <input
                    type="text"
                    name="director"
                    value={recommendation.director}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              )}

              {recommendation.category === 'book' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={recommendation.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              )}

              {recommendation.category === 'game' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Developer</label>
                  <input
                    type="text"
                    name="developer"
                    value={recommendation.developer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              )}

              {recommendation.category === 'link' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                    <input
                      type="text"
                      name="url"
                      value={recommendation.url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      <i className="fas fa-info-circle mr-1"></i>
                      Enter a full URL including http:// or https://
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Link Type</label>
                    <select
                      name="linkType"
                      value={recommendation.linkType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                    >
                      <option value="">Select type...</option>
                      {linkTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={recommendation.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={recommendation.order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#2e3d29]/30 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={recommendation.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">Featured recommendation</label>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
              <p><i className="fas fa-exclamation-triangle mr-2"></i> {error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-[#3e503e]">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="secondary"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Create Recommendation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 
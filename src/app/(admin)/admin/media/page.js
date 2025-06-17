"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

export default function MediaManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name
  const [filterType, setFilterType] = useState('all'); // all, image, document
  const [groupBy, setGroupBy] = useState('none'); // none, folder, type, date
  const [zoomLevel, setZoomLevel] = useState(2); // 0: small, 1: medium, 2: large, 3: xlarge
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl) => {
    if (imageUrl) {
      // Refresh images list
      fetchImages();
      setShowUpload(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
    alert('URL copied to clipboard!');
  };

  const toggleImageSelection = (imageUrl) => {
    setSelectedImages(prev => {
      if (prev.includes(imageUrl)) {
        return prev.filter(url => url !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: selectedImages }),
      });

      if (response.ok) {
        setSelectedImages([]);
        fetchImages();
      } else {
        alert('Failed to delete images');
      }
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('Failed to delete images');
    }
  };

  // Get image file extension
  const getFileExtension = (url) => {
    return url.split('.').pop().toLowerCase();
  };

  // Get image folder path
  const getImageFolder = (url) => {
    const parts = url.split('/');
    if (parts.length > 2) {
      return parts[parts.length - 2];
    }
    return 'root';
  };

  // Get image type based on extension
  const getImageType = (url) => {
    const ext = getFileExtension(url);
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return 'image';
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) {
      return 'document';
    } else {
      return 'other';
    }
  };

  // Get image upload date (simulated from URL)
  const getImageDate = (url) => {
    // This is a placeholder - in a real app, you'd get this from metadata
    const date = new Date();
    // Use some property of the URL to simulate different dates
    date.setDate(date.getDate() - (url.length % 30));
    return date;
  };

  // Format date as YYYY-MM
  const formatYearMonth = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  // Group images based on selected grouping
  const groupImages = useCallback((images) => {
    if (groupBy === 'none') return { 'All Images': images };
    
    return images.reduce((groups, image) => {
      let groupKey;
      
      switch (groupBy) {
        case 'folder':
          groupKey = getImageFolder(image);
          break;
        case 'type':
          groupKey = getImageType(image);
          break;
        case 'date':
          groupKey = formatYearMonth(getImageDate(image));
          break;
        default:
          groupKey = 'All Images';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(image);
      return groups;
    }, {});
  }, [groupBy]);

  // Filter and sort images
  const processedImages = useCallback(() => {
    // Filter by type
    let filtered = images;
    if (filterType !== 'all') {
      filtered = images.filter(image => getImageType(image) === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(image => 
        image.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort images
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => getImageDate(b) - getImageDate(a));
        break;
      case 'oldest':
        filtered.sort((a, b) => getImageDate(a) - getImageDate(b));
        break;
      case 'name':
        filtered.sort((a, b) => {
          const aName = a.split('/').pop();
          const bName = b.split('/').pop();
          return aName.localeCompare(bName);
        });
        break;
    }
    
    return filtered;
  }, [images, filterType, sortBy, searchTerm]);

  // Get grid column class based on zoom level
  const getGridColumns = () => {
    switch (zoomLevel) {
      case 0: return 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12';
      case 1: return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10';
      case 2: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
    }
  };

  // Open image in zoom modal
  const openZoomModal = (image) => {
    setZoomImage(image);
    setShowZoomModal(true);
  };

  // Get grouped and processed images
  const groupedImages = groupImages(processedImages());

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mr-4"></i>
        <p className="text-gray-400">Loading media...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            <i className="fas fa-images mr-3"></i>
            Media Management
          </h1>
          <p className="text-gray-400 mt-2">Manage uploaded images and media files</p>
        </div>
        
        <div className="flex gap-3">
          {selectedImages.length > 0 && (
            <button
              onClick={deleteSelectedImages}
              className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-300"
            >
              <i className="fas fa-trash mr-2"></i>
              Delete ({selectedImages.length})
            </button>
          )}
          
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-[#e8c547]/20 hover:bg-[#e8c547]/30 border border-[#e8c547]/50 text-[#e8c547] px-6 py-2 rounded-lg font-medium transition-all duration-300"
          >
            <i className="fas fa-plus mr-2"></i>
            Upload New
          </button>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <h2 className="text-xl font-bold gradient-text mb-4">
            <i className="fas fa-cloud-upload-alt mr-2"></i>
            Upload New Image
          </h2>
          <ImageUpload
            onImageUpload={handleImageUpload}
            className="max-w-md"
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-[#e8c547]/20 rounded-lg mr-4">
              <i className="fas fa-images text-[#e8c547] text-xl"></i>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Images</p>
              <p className="text-2xl font-bold text-white">{images.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
              <i className="fas fa-check-square text-blue-400 text-xl"></i>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Selected</p>
              <p className="text-2xl font-bold text-white">{selectedImages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg mr-4">
              <i className="fas fa-hdd text-green-400 text-xl"></i>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Storage Used</p>
              <p className="text-2xl font-bold text-white">~{Math.round(images.length * 0.5)}MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Controls */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {/* View Mode */}
            <div className="flex border border-[#3e503e] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#3e503e] text-white' : 'bg-[#0e1b12] text-gray-400'}`}
                title="Grid View"
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#3e503e] text-white' : 'bg-[#0e1b12] text-gray-400'}`}
                title="List View"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
            
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name</option>
            </select>
            
            {/* Group By */}
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
            >
              <option value="none">No Grouping</option>
              <option value="folder">By Folder</option>
              <option value="type">By Type</option>
              <option value="date">By Date</option>
            </select>
            
            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="other">Other</option>
            </select>
            
            {/* Zoom Controls */}
            <div className="flex border border-[#3e503e] rounded-lg overflow-hidden">
              <button
                onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
                className="px-3 py-2 bg-[#0e1b12] text-gray-400 hover:bg-[#3e503e] hover:text-white disabled:opacity-50"
                disabled={zoomLevel === 0}
                title="Zoom Out"
              >
                <i className="fas fa-search-minus"></i>
              </button>
              <button
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 1))}
                className="px-3 py-2 bg-[#0e1b12] text-gray-400 hover:bg-[#3e503e] hover:text-white disabled:opacity-50"
                disabled={zoomLevel === 3}
                title="Zoom In"
              >
                <i className="fas fa-search-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
        {images.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-image text-4xl text-gray-500 mb-4"></i>
            <p className="text-gray-400 mb-4">No images uploaded yet</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-[#e8c547]/20 hover:bg-[#e8c547]/30 border border-[#e8c547]/50 text-[#e8c547] px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <i className="fas fa-plus mr-2"></i>
              Upload Your First Image
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedImages).map(([group, groupImages]) => (
              <div key={group} className="space-y-4">
                {/* Group Header (if grouping is enabled) */}
                {groupBy !== 'none' && (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-[#e8c547]">
                      {groupBy === 'folder' && <i className="fas fa-folder mr-2"></i>}
                      {groupBy === 'type' && <i className="fas fa-file mr-2"></i>}
                      {groupBy === 'date' && <i className="fas fa-calendar mr-2"></i>}
                      {group}
                    </h3>
                    <span className="text-sm text-gray-400">({groupImages.length})</span>
                  </div>
                )}
                
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className={`grid ${getGridColumns()} gap-4`}>
                    {groupImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedImages.includes(image)
                            ? 'border-[#e8c547] bg-[#e8c547]/10'
                            : 'border-[#3e503e] hover:border-[#e8c547]/50'
                        }`}
                      >
                        <div 
                          className="aspect-square relative"
                          onClick={() => toggleImageSelection(image)}
                        >
                          <Image
                            src={image}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                          />
                          
                          {/* Selection Overlay */}
                          <div className={`absolute inset-0 transition-opacity ${
                            selectedImages.includes(image) 
                              ? 'bg-[#e8c547]/20 opacity-100' 
                              : 'bg-black/20 opacity-0 group-hover:opacity-100'
                          }`}>
                            <div className="absolute top-2 right-2">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedImages.includes(image)
                                  ? 'bg-[#e8c547] border-[#e8c547]'
                                  : 'bg-transparent border-white'
                              }`}>
                                {selectedImages.includes(image) && (
                                  <i className="fas fa-check text-black text-xs"></i>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image Actions */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openZoomModal(image);
                            }}
                            className="text-white text-xs py-1 px-2 bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
                            title="View Larger"
                          >
                            <i className="fas fa-search-plus"></i>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(image);
                            }}
                            className="text-white text-xs py-1 px-2 bg-[#e8c547]/20 hover:bg-[#e8c547]/30 rounded transition-colors"
                            title="Copy URL"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* List View */}
                {viewMode === 'list' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3e503e]">
                          <th className="py-2 px-4 text-left w-10">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="py-2 px-4 text-left w-16">Preview</th>
                          <th className="py-2 px-4 text-left">File Name</th>
                          <th className="py-2 px-4 text-left">Type</th>
                          <th className="py-2 px-4 text-left">Path</th>
                          <th className="py-2 px-4 text-left w-32">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupImages.map((image, index) => {
                          const fileName = image.split('/').pop();
                          const fileType = getFileExtension(image);
                          const filePath = image.substring(0, image.lastIndexOf('/'));
                          
                          return (
                            <tr key={index} className="border-b border-[#3e503e]/30 hover:bg-[#3e503e]/20">
                              <td className="py-2 px-4">
                                <div 
                                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer"
                                  onClick={() => toggleImageSelection(image)}
                                >
                                  {selectedImages.includes(image) ? (
                                    <div className="w-3 h-3 rounded-full bg-[#e8c547]"></div>
                                  ) : null}
                                </div>
                              </td>
                              <td className="py-2 px-4">
                                <div 
                                  className="w-12 h-12 relative rounded overflow-hidden cursor-pointer"
                                  onClick={() => openZoomModal(image)}
                                >
                                  <Image
                                    src={image}
                                    alt={fileName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-4 font-medium">{fileName}</td>
                              <td className="py-2 px-4 text-gray-400">.{fileType}</td>
                              <td className="py-2 px-4 text-gray-400 truncate max-w-xs">{filePath}</td>
                              <td className="py-2 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openZoomModal(image)}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="View"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(image)}
                                    className="text-[#e8c547] hover:text-[#d4b445]"
                                    title="Copy URL"
                                  >
                                    <i className="fas fa-copy"></i>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedImages([image]);
                                      deleteSelectedImages();
                                    }}
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {showZoomModal && zoomImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a2e1a] rounded-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3e503e]">
              <h3 className="text-lg font-semibold text-white">
                {zoomImage.split('/').pop()}
              </h3>
              <button
                onClick={() => setShowZoomModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            {/* Image Container */}
            <div className="relative w-full h-[70vh] bg-[#0e1b12]">
              <Image
                src={zoomImage}
                alt="Enlarged view"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Actions Footer */}
            <div className="p-4 border-t border-[#3e503e] flex justify-between">
              <div className="text-sm text-gray-400">
                <span className="mr-4">
                  <i className="fas fa-link mr-1"></i>
                  {zoomImage}
                </span>
                <span>
                  <i className="fas fa-file mr-1"></i>
                  {getFileExtension(zoomImage).toUpperCase()}
                </span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(zoomImage)}
                  className="bg-[#e8c547]/20 hover:bg-[#e8c547]/30 border border-[#e8c547]/50 text-[#e8c547] px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy URL
                </button>
                
                <button
                  onClick={() => {
                    setSelectedImages([zoomImage]);
                    deleteSelectedImages();
                    setShowZoomModal(false);
                  }}
                  className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
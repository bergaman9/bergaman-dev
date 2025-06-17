"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ImageUpload from '@/app/components/ImageUpload';
import PageHeader from '@/app/components/PageHeader';
import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';

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
      <PageHeader
        title="Media Management"
        subtitle="Manage uploaded images and media files"
        icon="fas fa-images"
        actions={[
          ...(selectedImages.length > 0 ? [
            {
              label: `Delete (${selectedImages.length})`,
              variant: 'danger',
              icon: 'fas fa-trash',
              onClick: deleteSelectedImages
            }
          ] : []),
          {
            label: 'Upload Media',
            variant: 'primary',
            icon: 'fas fa-upload',
            onClick: () => setShowUpload(!showUpload)
          }
        ]}
        filter={
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-lg overflow-hidden border border-[#3e503e]/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 ${viewMode === 'grid' ? 'bg-[#e8c547]/20 text-[#e8c547]' : 'bg-[#2e3d29]/30 text-gray-400 hover:text-gray-300'}`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 ${viewMode === 'list' ? 'bg-[#e8c547]/20 text-[#e8c547]' : 'bg-[#2e3d29]/30 text-gray-400 hover:text-gray-300'}`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-3 py-1 text-sm text-gray-300"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-3 py-1 text-sm text-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
            
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-3 py-1 text-sm text-gray-300"
            >
              <option value="none">No Grouping</option>
              <option value="folder">By Folder</option>
              <option value="type">By Type</option>
              <option value="date">By Date</option>
            </select>
            
            <div className="flex rounded-lg overflow-hidden border border-[#3e503e]/30">
              <button
                onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
                className="px-2 py-1 bg-[#2e3d29]/30 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                disabled={zoomLevel === 0}
              >
                <i className="fas fa-search-minus"></i>
              </button>
              <button
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 1))}
                className="px-2 py-1 bg-[#2e3d29]/30 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                disabled={zoomLevel === 3}
              >
                <i className="fas fa-search-plus"></i>
              </button>
            </div>
            
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:border-[#e8c547]/50"
              />
            </div>
          </div>
        }
      />

      {/* Upload Area */}
      {showUpload && (
        <div className="bg-[#1a2e1a]/50 border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-4">Upload Media</h2>
          <ImageUpload onImageUpload={handleImageUpload} />
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
      <Modal
        isOpen={showZoomModal}
        onClose={() => setShowZoomModal(false)}
        title="Image Preview"
        size="lg"
        variant="dark"
      >
        {zoomImage && (
          <div className="text-center">
            <img
              src={zoomImage}
              alt="Preview"
              className="max-w-full max-h-[70vh] mx-auto mb-4"
            />
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(zoomImage)}
              >
                <i className="fas fa-clipboard mr-2"></i>
                Copy URL
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  toggleImageSelection(zoomImage);
                  setShowZoomModal(false);
                }}
              >
                <i className="fas fa-trash mr-2"></i>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 
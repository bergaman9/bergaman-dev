"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/app/components/Modal';
import PageHeader from '@/app/components/PageHeader';
import Button from '@/app/components/Button';

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '/images/portfolio/default.svg',
    technologies: [],
    category: 'Web',
    status: 'active',
    featured: false,
    demoUrl: '',
    githubUrl: '',
    order: 0
  });
  const [techInput, setTechInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const categories = [
    { value: 'Web', label: 'Web Development' },
    { value: 'Mobile', label: 'Mobile App' },
    { value: 'Desktop', label: 'Desktop App' },
    { value: 'Game', label: 'Game Development' },
    { value: 'AI', label: 'AI/ML' },
    { value: 'Bot', label: 'Bot Development' },
    { value: 'IoT', label: 'IoT Projects' },
    { value: 'Graphic Design', label: 'Graphic Design' },
    { value: 'Brand', label: 'Brand Projects' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/portfolio');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPortfolios(data.portfolios || []);
      } else {
        throw new Error(data.error || 'Failed to fetch portfolios');
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast.error('Failed to load portfolios');
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare submission data with proper validation
    const submissionData = {
      ...formData
    };
    
    // Always set a valid image path
    if (!submissionData.image || submissionData.image.trim() === '') {
      submissionData.image = '/images/portfolio/default.svg';
    }
    
    // Ensure category is valid
    if (submissionData.category === 'bots' || submissionData.category === 'Bots') {
      submissionData.category = 'Bot';
    }
    
    // Ensure status is valid
    if (submissionData.status === 'published') {
      submissionData.status = 'active';
    }
    
    try {
      const url = editingPortfolio 
        ? `/api/admin/portfolio/${editingPortfolio._id}`
        : '/api/admin/portfolio';
      
      const method = editingPortfolio ? 'PUT' : 'POST';
      
      console.log('Submitting data:', submissionData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingPortfolio ? 'Portfolio updated!' : 'Portfolio created!');
        setShowModal(false);
        resetForm();
        fetchPortfolios();
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error(error.message || 'Failed to save portfolio');
    }
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      description: portfolio.description,
      image: portfolio.image,
      technologies: portfolio.technologies || [],
      category: portfolio.category,
      status: portfolio.status,
      featured: portfolio.featured,
      demoUrl: portfolio.demoUrl || '',
      githubUrl: portfolio.githubUrl || '',
      order: portfolio.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Portfolio deleted!');
        fetchPortfolios();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error('Failed to delete portfolio');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '/images/portfolio/default.svg',
      technologies: [],
      category: 'Web',
      status: 'active',
      featured: false,
      demoUrl: '',
      githubUrl: '',
      order: 0
    });
    setTechInput('');
    setEditingPortfolio(null);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
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
      
      console.log('Uploading file:', file.name);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

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
      // Set default image on error
      setFormData(prev => ({
        ...prev,
        image: '/images/portfolio/default.svg'
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Export portfolios as JSON
  const handleExport = () => {
    try {
      // Create a JSON string from the portfolios data
      const dataToExport = JSON.stringify(portfolios, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([dataToExport], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Portfolio data exported successfully');
    } catch (error) {
      console.error('Error exporting portfolio data:', error);
      toast.error('Failed to export portfolio data');
    }
  };

  // Import portfolios from JSON file
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImportFile(file);
  };

  const processImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      setImportLoading(true);
      
      // Read the file content
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (!Array.isArray(importedData)) {
            throw new Error('Invalid import format. Expected an array of portfolio items.');
          }
          
          toast.loading(`Importing ${importedData.length} portfolio items...`);
          
          // Process each item
          let successCount = 0;
          let errorCount = 0;
          
          for (const item of importedData) {
            try {
              // Remove _id to create new entries
              const { _id, createdAt, updatedAt, __v, ...portfolioData } = item;
              
              // Validate required fields
              if (!portfolioData.title || !portfolioData.description || !portfolioData.category) {
                errorCount++;
                continue;
              }
              
              // Send to API
              const response = await fetch('/api/admin/portfolio', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(portfolioData),
              });
              
              if (response.ok) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch (itemError) {
              console.error('Error importing portfolio item:', itemError);
              errorCount++;
            }
          }
          
          toast.dismiss();
          
          if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} portfolio items`);
            fetchPortfolios();
          }
          
          if (errorCount > 0) {
            toast.error(`Failed to import ${errorCount} portfolio items`);
          }
          
          setShowImportModal(false);
          setImportFile(null);
        } catch (parseError) {
          console.error('Error parsing import file:', parseError);
          toast.error('Invalid JSON format in import file');
        }
      };
      
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Error importing portfolio data:', error);
      toast.error('Failed to import portfolio data');
    } finally {
      setImportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading portfolios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Portfolio Management"
        subtitle="Showcase your projects and professional work"
        icon="fas fa-briefcase"
        actions={[
          {
            label: 'Add New Project',
            variant: 'primary',
            icon: 'fas fa-plus',
            onClick: () => {
              resetForm();
              setShowModal(true);
            }
          },
          {
            label: 'Import',
            variant: 'secondary',
            icon: 'fas fa-file-import',
            onClick: () => setShowImportModal(true)
          },
          {
            label: 'Export',
            variant: 'secondary',
            icon: 'fas fa-file-export',
            onClick: handleExport
          }
        ]}
        stats={[
          { label: 'Total Projects', value: portfolios.length }
        ]}
      />

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio._id} className="bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/30 overflow-hidden hover:border-[#e8c547]/30 transition-all duration-300">
            {/* Project Image */}
            <div className="relative h-48 bg-[#0e1b12]">
              {portfolio.image ? (
                <img
                  src={portfolio.image}
                  alt={portfolio.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/portfolio/default.svg';
                  }}
                />
              ) : (
                <img 
                  src="/images/portfolio/default.svg" 
                  alt="Default placeholder" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  portfolio.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {portfolio.status}
                </span>
              </div>

              {/* Featured Badge */}
              {portfolio.featured && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#e8c547]/20 text-[#e8c547] px-2 py-1 rounded-full text-xs font-medium border border-[#e8c547]/30">
                    <i className="fas fa-star mr-1"></i>
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white truncate">
                  {portfolio.title}
                </h3>
                <span className="text-xs text-gray-400 ml-2">
                  #{portfolio.order}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {portfolio.description}
              </p>

              {/* Category */}
              <div className="mb-3">
                <span className="inline-block bg-[#e8c547]/10 text-[#e8c547] px-2 py-1 rounded text-xs border border-[#e8c547]/20">
                  {categories.find(c => c.value === portfolio.category)?.label || portfolio.category}
                </span>
              </div>

              {/* Technologies */}
              {portfolio.technologies && portfolio.technologies.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {portfolio.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="bg-[#3e503e]/30 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {portfolio.technologies.length > 3 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{portfolio.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#3e503e]/30">
                <div className="flex space-x-2">
                  {portfolio.demoUrl && (
                    <a
                      href={portfolio.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#e8c547] hover:text-[#d4b445] transition-colors"
                      title="View Demo"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                  {portfolio.githubUrl && (
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#e8c547] hover:text-[#d4b445] transition-colors"
                      title="View Code"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {portfolios.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-briefcase text-6xl text-gray-600 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Portfolio Projects</h3>
          <p className="text-gray-500 mb-6">Start by adding your first project to showcase your work.</p>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Your First Project
          </Button>
        </div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingPortfolio ? 'Edit Project' : 'Add New Project'}
        size="xl"
        variant="modern"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setShowModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingPortfolio ? 'Update Project' : 'Create Project'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Image
            </label>
            <div className="space-y-3">
              {formData.image && (
                <div className="relative w-full h-40 bg-[#0e1b12] rounded-lg overflow-hidden mb-2">
                  <img 
                    src={formData.image} 
                    alt="Project thumbnail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/portfolio/default.svg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                    placeholder="Image path (optional)"
                  />
                </div>
                <span className="text-gray-400 flex items-center">or</span>
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`px-4 py-2 bg-[#3e503e] text-white rounded-lg cursor-pointer hover:bg-[#4e614e] transition-colors flex items-center ${
                      uploadingImage ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i>
                        Upload
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Demo URL
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                placeholder="https://demo.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                placeholder="Add technology (e.g., React, Node.js)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-[#e8c547] text-[#0e1b12] rounded-lg hover:bg-[#d4b445] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-[#3e503e]/30 text-gray-300 px-2 py-1 rounded text-sm flex items-center space-x-1"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Order and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                />
                <span className="text-sm text-gray-300">Featured Project</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportFile(null);
        }}
        title="Import Portfolio Projects"
        size="md"
        variant="elegant"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setShowImportModal(false);
              setImportFile(null);
            }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={processImport}
              disabled={!importFile || importLoading}
            >
              {importLoading ? 'Importing...' : 'Import'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Upload a JSON file containing portfolio projects to import.
          </p>
          
          <div className="border-2 border-dashed border-[#3e503e] rounded-lg p-6 text-center">
            <input
              type="file"
              id="import-file"
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <label htmlFor="import-file" className="cursor-pointer">
              <div className="space-y-2">
                <i className="fas fa-file-upload text-3xl text-gray-400"></i>
                <p className="text-gray-400">Click to select a JSON file</p>
                {importFile && (
                  <p className="text-[#e8c547]">{importFile.name}</p>
                )}
              </div>
            </label>
          </div>
          
          <div className="bg-[#0e1b12]/50 p-3 rounded-lg text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Note:</p>
            <p>The JSON file should contain an array of portfolio objects with title, description, and category fields at minimum.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/app/components/Modal';
import PageHeader from '@/app/components/PageHeader';
import Button from '@/app/components/Button';
import Checkbox from '@/app/components/Checkbox';
import Input from '@/app/components/Input';
import Select from '@/app/components/Select';
import ProjectCard from '@/app/components/ProjectCard';
import SafeImage from '@/app/components/SafeImage';

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '/images/portfolio/default.svg',
    technologies: [],
    category: 'Web Development',
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
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'Desktop App', label: 'Desktop App' },
    { value: 'Game Development', label: 'Game Development' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Bot Development', label: 'Bot Development' },
    { value: 'IoT', label: 'IoT Projects' },
    { value: 'Design', label: 'Design' },
    { value: 'Branding', label: 'Branding' },
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
      category: 'Web Development',
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

  // Get unique categories from portfolios
  const getUniqueCategories = () => {
    const uniqueCategories = [...new Set(portfolios.map(p => p.category))];
    return uniqueCategories.sort();
  };

  // Filter portfolios by category
  const filteredPortfolios = selectedCategory === 'all' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory);

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
    <>
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

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 p-4 bg-[#0e1b12]/50 rounded-lg border border-[#3e503e]/30 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#e8c547] text-black'
                : 'bg-[#1a2b1a] text-gray-300 hover:bg-[#2a3b2a] hover:text-white'
            }`}
          >
            All ({portfolios.length})
          </button>
          {getUniqueCategories().map((category) => {
            const count = portfolios.filter(p => p.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#e8c547] text-black'
                    : 'bg-[#1a2b1a] text-gray-300 hover:bg-[#2a3b2a] hover:text-white'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((portfolio) => (
            <ProjectCard
              key={portfolio._id}
              project={portfolio}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPortfolios.length === 0 && (
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
      </div>

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
        position="center"
        zIndex={99999}
        preventScroll={true}
        hideFooter={true}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Basic Information
              </h3>
            </div>
            
            {/* Title */}
            <div>
              <Input
                label="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter project title"
                icon="fas fa-heading"
              />
            </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <i className="fas fa-align-left mr-2"></i>
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
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-image"></i>
                Media
              </h3>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-image mr-2"></i>
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
                  <Button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2"
                    variant="danger"
                    size="sm"
                    icon="fas fa-times"
                    title="Remove image"
                  />
                </div>
              )}
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image path or upload a file"
                    icon="fas fa-link"
                  />
                </div>
                <span className="text-gray-400 flex items-center">or</span>
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploadingImage}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="fas fa-upload"
                    loading={uploadingImage}
                    disabled={uploadingImage}
                    className="relative"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Project Details Section */}
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-cog"></i>
                Project Details
              </h3>
            </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
              required
              icon="fas fa-folder"
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'planned', label: 'Planned' }
              ]}
              icon="fas fa-tasks"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Demo URL"
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://demo.example.com"
                icon="fas fa-external-link-alt"
              />
            </div>

            <div>
              <Input
                label="GitHub URL"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
                icon="fab fa-github"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <i className="fas fa-code mr-2"></i>
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
              <Button
                type="button"
                onClick={addTechnology}
                variant="primary"
                size="sm"
                icon="fas fa-plus"
              >
                Add
              </Button>
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
              <Input
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="0"
                icon="fas fa-sort-numeric-up"
                description="Lower numbers appear first"
              />
            </div>

            <div>
              <Checkbox
                checked={formData.featured}
                onChange={(checked) => setFormData({ ...formData, featured: checked })}
                label="Featured Project"
                description="Show this project prominently on the homepage"
                icon="fas fa-star"
                size="md"
                variant="primary"
              />
            </div>
          </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-[#3e503e]/30">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              icon="fas fa-times"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              icon={editingPortfolio ? 'fas fa-save' : 'fas fa-plus'}
              loading={uploadingImage}
            >
              {editingPortfolio ? 'Update Project' : 'Create Project'}
            </Button>
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
        position="center"
        zIndex={99999}
        preventScroll={true}
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
    </>
  );
} 
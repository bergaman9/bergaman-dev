"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import ImageUpload from '@/components/ImageUpload';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    excerpt: '',
    category: 'technology',
    tags: '',
    image: '',
    readTime: '5 min read',
    published: true,
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    },
    visibility: 'public',
    password: ''
  });

  const categories = [
    'technology',
    'ai',
    'web-development',
    'tutorial',
    'programming',
    'blockchain',
    'mobile',
    'design'
  ];

  // Format category name for display
  const formatCategoryName = (category) => {
    switch(category) {
      case 'ai': return 'AI';
      case 'web-development': return 'Web Development';
      case 'technology': return 'Technology';
      case 'tutorial': return 'Tutorial';
      case 'programming': return 'Programming';
      case 'blockchain': return 'Blockchain';
      case 'mobile': return 'Mobile';
      case 'design': return 'Design';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  // Calculate read time based on content
  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Generate SEO data from content
  const generateSEO = (title, description, content) => {
    const seo = {
      metaTitle: title || '',
      metaDescription: description || '',
      keywords: ''
    };

    // Auto-generate meta title if not provided
    if (title && !formData.seo.metaTitle) {
      seo.metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
    }

    // Auto-generate meta description if not provided
    if (description && !formData.seo.metaDescription) {
      seo.metaDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
    }

    // Extract keywords from content and title
    if ((title || content) && !formData.seo.keywords) {
      const text = `${title} ${content}`.toLowerCase();
      const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'];
      const words = text.match(/\b\w{4,}\b/g) || [];
      const uniqueWords = [...new Set(words)].filter(word => !commonWords.includes(word));
      seo.keywords = uniqueWords.slice(0, 10).join(', ');
    }

    return seo;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Auto-generate slug from title
    if (name === 'title' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Auto-generate SEO data
      const autoSEO = generateSEO(value, formData.description, formData.content);
      
      setFormData(prev => ({ 
        ...prev, 
        slug,
        seo: {
          ...prev.seo,
          ...autoSEO
        }
      }));
    }

    // Auto-calculate read time when content changes
    if (name === 'content' && value) {
      const autoReadTime = calculateReadTime(value);
      setFormData(prev => ({
        ...prev,
        readTime: autoReadTime
      }));
      
      // Auto-generate SEO keywords from content
      const autoSEO = generateSEO(formData.title, formData.description, value);
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: autoSEO.keywords || prev.seo.keywords
        }
      }));
    }

    // Auto-generate meta description from description
    if (name === 'description' && value) {
      const autoSEO = generateSEO(formData.title, value, formData.content);
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: autoSEO.metaDescription || prev.seo.metaDescription
        }
      }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl || ''
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    
    // Auto-calculate read time when content changes
    if (content) {
      const autoReadTime = calculateReadTime(content);
      setFormData(prev => ({
        ...prev,
        readTime: autoReadTime
      }));
      
      // Auto-generate SEO keywords from content
      const autoSEO = generateSEO(formData.title, formData.description, content);
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: autoSEO.keywords || prev.seo.keywords
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process tags
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
        }
      };

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });

      if (response.ok) {
        const post = await response.json();
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Post - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              <i className="fas fa-plus mr-3"></i>
              Create New Post
            </h1>
            <p className="text-gray-400 mt-2">Write and publish a new blog post</p>
          </div>
          <Link
            href="/admin/posts"
            className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-300 px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Posts
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-info-circle mr-2"></i>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="Brief description of the post"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="react, javascript, tutorial"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Featured Image
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.image}
                className="w-full"
              />
              <input
                type="hidden"
                name="image"
                value={formData.image}
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-edit mr-2"></i>
              Content
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="Short excerpt for the post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content * (Markdown Editor)
                </label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your post content here... You can use Markdown formatting."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-search mr-2"></i>
              SEO Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="seo.metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="SEO title (leave empty to use post title)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seo.metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="SEO description (leave empty to use post description)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  name="seo.keywords"
                  value={formData.seo.keywords}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="seo, keywords, blog"
                />
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-cog mr-2"></i>
              Publishing Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                  />
                  <span className="text-gray-300">Published</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                  />
                  <span className="text-gray-300">Featured</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  placeholder="5 min read"
                />
              </div>
            </div>
          </div>

          {/* Visibility & Security Settings */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-shield-alt mr-2"></i>
              Visibility & Security
            </h2>
            
            <div className="space-y-4">
              {/* Visibility Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Post Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                >
                  <option value="public">🌍 Public - Anyone can view</option>
                  <option value="password">🔒 Password Protected</option>
                  <option value="members">👥 Members Only</option>
                  <option value="private">🔐 Private - Only admins</option>
                </select>
              </div>

              {/* Password Field (show only if password protected) */}
              {formData.visibility === 'password' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Post Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password for this post"
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Readers will need this password to view the post
                  </p>
                </div>
              )}

              {/* Member Only Info */}
              {formData.visibility === 'members' && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <i className="fas fa-info-circle mr-2"></i>
                    Only registered members will be able to view this post
                  </p>
                </div>
              )}

              {/* Private Info */}
              {formData.visibility === 'private' && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-300">
                    <i className="fas fa-lock mr-2"></i>
                    This post will only be visible to administrators
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/posts"
              className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-300 rounded-lg font-medium transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center">
                  <i className="fas fa-save mr-2"></i>
                  Create Post
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 
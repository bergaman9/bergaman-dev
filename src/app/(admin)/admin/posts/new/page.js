"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

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
    }
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
      setFormData(prev => ({ ...prev, slug }));
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
                      {category.charAt(0).toUpperCase() + category.slice(1)}
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
                Featured Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="https://example.com/image.jpg"
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
                  Content * (Markdown supported)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={15}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300 font-mono"
                  placeholder="Write your post content here... You can use Markdown formatting."
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
            
            <div className="flex items-center space-x-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                />
                <span className="ml-2 text-gray-300">Publish immediately</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#e8c547] bg-[#0e1b12] border-[#3e503e] rounded focus:ring-[#e8c547] focus:ring-2"
                />
                <span className="ml-2 text-gray-300">Featured post</span>
              </label>
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
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'technology',
    tags: [],
    image: '',
    published: true,
    featured: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const categories = ['technology', 'ai', 'web-development', 'tutorial', 'programming'];

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setPost(data.post);
      } else {
        alert('Error loading post: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post updated successfully!');
        router.push('/admin/posts');
      } else {
        alert('Error updating post: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        metaTitle: title
      }
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setPost(prev => ({
      ...prev,
      tags,
      seo: {
        ...prev.seo,
        keywords: tags
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1b12] text-[#d1d5db] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1b12] text-[#d1d5db] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              <i className="fas fa-edit mr-3"></i>
              Edit Post
            </h1>
            <p className="text-gray-400">Update your blog post content</p>
          </div>
          <Link
            href="/admin/posts"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Posts
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                  required
                />
              </div>

              {/* Slug */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                  required
                />
              </div>

              {/* Description */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Description *
                </label>
                <textarea
                  value={post.description}
                  onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                  required
                />
              </div>

              {/* Content */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Content *
                </label>
                <textarea
                  value={post.content}
                  onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical font-mono"
                  placeholder="Write your blog post content here..."
                  required
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Publish Settings</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={post.published}
                      onChange={(e) => setPost(prev => ({ ...prev, published: e.target.checked }))}
                      className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                    />
                    <span className="text-gray-300">Published</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={post.featured}
                      onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                      className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                    />
                    <span className="text-gray-300">Featured</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Category
                </label>
                <select
                  value={post.category}
                  onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={post.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                />
                <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
              </div>

              {/* Featured Image */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <label className="block text-sm font-medium text-[#e8c547] mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={post.image}
                  onChange={(e) => setPost(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* SEO Settings */}
              <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-[#e8c547] mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={post.seo.metaTitle}
                      onChange={(e) => setPost(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                      className="w-full px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={post.seo.metaDescription}
                      onChange={(e) => setPost(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-4 py-2 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/posts"
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Update Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
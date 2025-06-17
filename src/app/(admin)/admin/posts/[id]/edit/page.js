'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import MarkdownEditor from '@/components/MarkdownEditor';
import ImageUpload from '@/components/ImageUpload';

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
    },
    visibility: 'public',
    password: ''
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    'technology', 
    'ai', 
    'web-development', 
    'tutorial', 
    'programming',
    'design',
    'ux-ui',
    'data-science',
    'blockchain',
    'cybersecurity',
    'mobile-dev',
    'cloud',
    'devops',
    'iot',
    'hardware'
  ];

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
        setPost(data); // The API returns the post directly, not wrapped in data.post
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
        ...prev?.seo,
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
        ...prev?.seo,
        keywords: tags
      }
    }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Avoid duplicates
    if (!post.tags.includes(tagInput.trim())) {
      const newTags = [...post.tags, tagInput.trim()];
      setPost(prev => ({
        ...prev,
        tags: newTags,
        seo: {
          ...prev?.seo,
          keywords: newTags
        }
      }));
    }
    
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = post.tags.filter(tag => tag !== tagToRemove);
    setPost(prev => ({
      ...prev,
      tags: newTags,
      seo: {
        ...prev?.seo,
        keywords: newTags
      }
    }));
  };

  const handleContentChange = (content) => {
    setPost(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setPost(prev => ({
      ...prev,
      image: imageUrl || ''
    }));
  };

  const formatCategoryName = (category) => {
    switch(category) {
      case 'ai': return 'AI';
      case 'web-development': return 'Web Development';
      case 'technology': return 'Technology';
      case 'tutorial': return 'Tutorial';
      case 'programming': return 'Programming';
      case 'design': return 'Design';
      case 'ux-ui': return 'UX/UI Design';
      case 'data-science': return 'Data Science';
      case 'blockchain': return 'Blockchain';
      case 'cybersecurity': return 'Cybersecurity';
      case 'mobile-dev': return 'Mobile Development';
      case 'cloud': return 'Cloud Computing';
      case 'devops': return 'DevOps';
      case 'iot': return 'IoT';
      case 'hardware': return 'Hardware';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
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
    <>
      <Head>
        <title>Edit Post - Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-[#0e1b12] to-[#1a2e1a] text-[#d1d5db] p-6">
        <div className="max-w-5xl mx-auto">
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
              className="bg-gray-600/30 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg transition-colors duration-300 border border-gray-600/50"
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
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={post?.title || ''}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={post?.slug || ''}
                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>

                {/* Description */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Description *
                  </label>
                  <textarea
                    value={post?.description || ''}
                    onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                    required
                  />
                </div>

                {/* Content */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Content * (Markdown Editor)
                  </label>
                  <MarkdownEditor
                    value={post?.content || ''}
                    onChange={handleContentChange}
                    placeholder="Write your blog post content here... You can use Markdown formatting."
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Publish Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={post?.published || false}
                        onChange={(e) => setPost(prev => ({ ...prev, published: e.target.checked }))}
                        className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                      />
                      <span className="text-gray-300">Published</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={post?.featured || false}
                        onChange={(e) => setPost(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2 text-[#e8c547] focus:ring-[#e8c547]"
                      />
                      <span className="text-gray-300">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Visibility & Security Settings */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-[#e8c547] mb-4">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Visibility & Security
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Visibility Setting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Post Visibility
                      </label>
                      <select
                        value={post?.visibility || 'public'}
                        onChange={(e) => setPost(prev => ({ ...prev, visibility: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                      >
                        <option value="public">🌍 Public - Anyone can view</option>
                        <option value="password">🔒 Password Protected</option>
                        <option value="members">👥 Members Only</option>
                        <option value="private">🔐 Private - Only admins</option>
                      </select>
                    </div>

                    {/* Password Field (show only if password protected) */}
                    {post?.visibility === 'password' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Post Password
                        </label>
                        <input
                          type="password"
                          value={post?.password || ''}
                          onChange={(e) => setPost(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password for this post"
                          className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Readers will need this password to view the post
                        </p>
                      </div>
                    )}

                    {/* Member Only Info */}
                    {post?.visibility === 'members' && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <i className="fas fa-info-circle mr-2"></i>
                          Only registered members will be able to view this post
                        </p>
                      </div>
                    )}

                    {/* Private Info */}
                    {post?.visibility === 'private' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-sm text-red-300">
                          <i className="fas fa-lock mr-2"></i>
                          This post will only be visible to administrators
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Category
                  </label>
                  <select
                    value={post?.category || 'technology'}
                    onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {formatCategoryName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Tags
                  </label>
                  
                  {/* Tag Input */}
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add a tag and press Enter"
                      className="flex-1 px-4 py-3 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-[#e8c547]/20 hover:bg-[#e8c547]/30 text-[#e8c547] border border-[#e8c547]/30 rounded-lg"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  
                  {/* Tag Display */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post?.tags?.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-[#3e503e]/40 text-white px-3 py-1 rounded-full text-sm flex items-center group"
                      >
                        <span>{tag}</span>
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                    
                    {post?.tags?.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No tags added yet</p>
                    )}
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <label className="block text-sm font-medium text-[#e8c547] mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={post?.image}
                    className="w-full"
                  />
                </div>

                {/* SEO Settings */}
                <div className="bg-[#1a2e1a]/70 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-[#e8c547] mb-4">SEO Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={post?.seo?.metaTitle || ''}
                        onChange={(e) => setPost(prev => ({
                          ...prev,
                          seo: { ...prev?.seo, metaTitle: e.target.value }
                        }))}
                        className="w-full px-4 py-2 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={post?.seo?.metaDescription || ''}
                        onChange={(e) => setPost(prev => ({
                          ...prev,
                          seo: { ...prev?.seo, metaDescription: e.target.value }
                        }))}
                        rows={3}
                        className="w-full px-4 py-2 bg-[#0e1b12]/70 border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none transition-colors duration-300 resize-vertical"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 mt-8">
              <Link
                href="/admin/posts"
                className="px-6 py-3 bg-gray-600/30 hover:bg-gray-600/50 text-white rounded-lg transition-colors duration-300 border border-gray-600/50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] hover:from-[#d4b445] hover:to-[#c5a53e] text-[#0e1b12] rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
    </>
  );
} 
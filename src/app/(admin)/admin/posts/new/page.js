"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/app/components/PageHeader';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Select from '@/app/components/Select';
import Checkbox from '@/app/components/Checkbox';
import MarkdownEditor from '@/app/components/MarkdownEditor';
import ImageUpload from '@/app/components/ImageUpload';
import Modal from '@/app/components/Modal';
import Card from '@/app/components/Card';
import Badge from '@/app/components/Badge';

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    excerpt: '',
    category: 'technology',
    tags: [],
    image: '',
    readTime: '5 min',
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
    { value: 'technology', label: 'Technology', icon: 'fas fa-microchip' },
    { value: 'ai', label: 'AI & Machine Learning', icon: 'fas fa-brain' },
    { value: 'web-development', label: 'Web Development', icon: 'fas fa-code' },
    { value: 'tutorial', label: 'Tutorial', icon: 'fas fa-graduation-cap' },
    { value: 'programming', label: 'Programming', icon: 'fas fa-laptop-code' },
    { value: 'blockchain', label: 'Blockchain', icon: 'fas fa-link' },
    { value: 'mobile', label: 'Mobile Development', icon: 'fas fa-mobile-alt' },
    { value: 'design', label: 'Design', icon: 'fas fa-palette' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: 'fas fa-globe', description: 'Anyone can view' },
    { value: 'password', label: 'Password Protected', icon: 'fas fa-lock', description: 'Requires password' },
    { value: 'members', label: 'Members Only', icon: 'fas fa-users', description: 'Registered users only' },
    { value: 'private', label: 'Private', icon: 'fas fa-user-lock', description: 'Only admins' }
  ];

  // Calculate read time based on content
  const calculateReadTime = (content) => {
    if (!content) return '0 min';
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  };

  // Update read time whenever content changes
  useEffect(() => {
    const readTime = calculateReadTime(formData.content);
    setFormData(prev => ({ ...prev, readTime }));
  }, [formData.content]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Auto-calculate SEO fields
  useEffect(() => {
    // Auto-set meta title if empty
    if (!formData.seo.metaTitle && formData.title) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: formData.title.substring(0, 60) // Limit to 60 chars
        }
      }));
    }
  }, [formData.title]);

  useEffect(() => {
    // Auto-set meta description if empty
    if (!formData.seo.metaDescription && formData.description) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: formData.description.substring(0, 160) // Limit to 160 chars
        }
      }));
    }
  }, [formData.description]);

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
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        ...formData,
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k)
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
        toast.success('Post created successfully!');
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Create New Post"
        subtitle="Write and publish a new blog post"
        icon="fas fa-plus"
        actions={[
          {
            label: 'Back to Posts',
            href: '/admin/posts',
            variant: 'secondary',
            icon: 'fas fa-arrow-left'
          },
          {
            label: 'Preview',
            onClick: () => setShowPreview(true),
            variant: 'secondary',
            icon: 'fas fa-eye'
          }
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card showImage={false}>
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter post title"
                icon="fas fa-heading"
              />

              <Input
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="post-url-slug"
                icon="fas fa-link"
              />

              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                icon="fas fa-folder"
                options={categories}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <i className="fas fa-clock mr-2"></i>
                  Read Time
                </label>
                <div className="relative">
                  <span className="px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] flex items-center">
                    <i className="fas fa-book-reader mr-2 text-[#e8c547]"></i>
                    {formData.readTime}
                    <span className="ml-2 text-gray-500">(auto-calculated)</span>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-file-alt mr-2"></i>
                Description
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

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-tags mr-2"></i>
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    placeholder="Add a tag and press Enter"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="secondary"
                    icon="fas fa-plus"
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="warning"
                        size="lg"
                        className="group cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <span>{tag}</span>
                        <i className="fas fa-times ml-2 opacity-70 group-hover:opacity-100"></i>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-image mr-2"></i>
                Featured Image
              </label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.image}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Content */}
        <Card showImage={false}>
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-edit"></i>
                Content
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-quote-left mr-2"></i>
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="Short excerpt for the post (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-pen mr-2"></i>
                Content (Markdown Editor)
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content here... You can use Markdown formatting."
                className="min-h-[400px]"
              />
            </div>
          </div>
        </Card>

        {/* SEO Settings */}
        <Card showImage={false}>
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-search"></i>
                SEO Settings
              </h3>
            </div>

            <Input
              label="Meta Title"
              name="seo.metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleInputChange}
              placeholder="SEO title (leave empty to use post title)"
              icon="fas fa-heading"
              description={!formData.seo.metaTitle && formData.title ? `Auto: ${formData.title.substring(0, 60)}` : null}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-align-left mr-2"></i>
                Meta Description
                {!formData.seo.metaDescription && formData.description && (
                  <span className="ml-2 text-xs text-[#e8c547]">(auto-calculated)</span>
                )}
              </label>
              <textarea
                name="seo.metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                placeholder="SEO description (leave empty to use post description)"
              />
              {!formData.seo.metaDescription && formData.description && (
                <p className="mt-1 text-xs text-gray-400">
                  <i className="fas fa-info-circle mr-1"></i>
                  Using: {formData.description.substring(0, 160)}...
                </p>
              )}
            </div>

            <Input
              label="Keywords"
              name="seo.keywords"
              value={formData.seo.keywords}
              onChange={handleInputChange}
              placeholder="seo, keywords, blog (comma separated)"
              icon="fas fa-key"
            />
          </div>
        </Card>

        {/* Publishing Options */}
        <Card showImage={false}>
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#3e503e]/30">
              <h3 className="text-lg font-semibold text-[#e8c547] flex items-center gap-2">
                <i className="fas fa-cog"></i>
                Publishing Options
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Checkbox
                  label="Published"
                  description="Make this post visible to readers"
                  checked={formData.published}
                  onChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  icon="fas fa-eye"
                />

                <Checkbox
                  label="Featured"
                  description="Display this post prominently"
                  checked={formData.featured}
                  onChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  icon="fas fa-star"
                />
              </div>

              <div>
                <Select
                  label="Visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  icon="fas fa-shield-alt"
                  options={visibilityOptions.map(option => ({
                    value: option.value,
                    label: `${option.label} - ${option.description}`
                  }))}
                />

                {formData.visibility === 'password' && (
                  <div className="mt-4">
                    <Input
                      label="Post Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password for this post"
                      icon="fas fa-lock"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visibility Info */}
            {formData.visibility !== 'public' && (
              <div className={`p-4 rounded-lg border ${
                formData.visibility === 'password' ? 'bg-yellow-500/10 border-yellow-500/30' :
                formData.visibility === 'members' ? 'bg-blue-500/10 border-blue-500/30' :
                'bg-red-500/10 border-red-500/30'
              }`}>
                <p className={`text-sm ${
                  formData.visibility === 'password' ? 'text-yellow-300' :
                  formData.visibility === 'members' ? 'text-blue-300' :
                  'text-red-300'
                }`}>
                  <i className={`${visibilityOptions.find(v => v.value === formData.visibility)?.icon} mr-2`}></i>
                  {visibilityOptions.find(v => v.value === formData.visibility)?.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            href="/admin/posts"
            icon="fas fa-times"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="fas fa-save"
          >
            Create Post
          </Button>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Post Preview"
        size="xl"
      >
        <div className="space-y-6">
          {formData.image && (
            <img
              src={formData.image}
              alt={formData.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div>
            <h1 className="text-3xl font-bold text-[#e8c547] mb-2">{formData.title || 'Untitled Post'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span><i className="fas fa-folder mr-1"></i> {categories.find(c => c.value === formData.category)?.label}</span>
              <span><i className="fas fa-clock mr-1"></i> {formData.readTime} read</span>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {formData.excerpt && (
            <p className="text-gray-300 italic border-l-4 border-[#e8c547] pl-4">
              {formData.excerpt}
            </p>
          )}

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet...</p>' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
} 
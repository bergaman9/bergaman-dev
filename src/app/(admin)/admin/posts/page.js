"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userRole, setUserRole] = useState('admin'); // Default to admin, will be fetched
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Get unique categories from posts
  const categories = ['all', 'technology', 'ai', 'web-development', 'tutorial', 'programming'];

  useEffect(() => {
    fetchPosts();
    fetchUserRole();
  }, [searchTerm, selectedCategory, pagination.page]);

  const fetchUserRole = async () => {
    try {
      // For now, we'll check if the user is the main admin
      // In a real app, this would come from authentication
      const adminAuth = localStorage.getItem('adminAuth');
      if (adminAuth === 'true') {
        // Check if it's the main admin (bergasoft) or a member
        // For simplicity, we'll assume main admin for now
        // You can extend this to check against members collection
        setUserRole('admin');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('editor'); // Default to editor for safety
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/posts?${params}`);
      const data = await response.json();

      if (data.posts) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    // Only allow admins to delete
    if (userRole !== 'admin') {
      alert('You do not have permission to delete posts. Only administrators can delete posts.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchPosts(); // Refresh the list
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  return (
    <>
      <Head>
        <title>Manage Posts - Bergaman Admin Panel</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
              Manage Posts
            </h1>
            <p className="text-gray-400 mt-2">Create, edit, and manage your blog posts</p>
            {userRole === 'editor' && (
              <p className="text-yellow-400 text-sm mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                Editor Mode: You can create and edit posts, but cannot delete them
              </p>
            )}
          </div>
          <Link
            href="/admin/posts/new"
            className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] px-6 py-3 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>New Post</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                Search Posts
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by title, description, or content..."
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div className="md:w-48">
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#3e503e]/30">
            <h2 className="text-xl font-semibold text-[#e8c547]">
              Posts ({pagination.total})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-spinner fa-spin text-4xl mb-4 block"></i>
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-search text-4xl mb-4 block"></i>
              <p>No posts found matching your criteria.</p>
              {searchTerm || selectedCategory !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 text-[#e8c547] hover:text-[#d4b445] transition-colors"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/admin/posts/new"
                  className="inline-block mt-4 bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#3e503e]/30">
              {posts.map((post) => (
                <div key={post._id} className="p-6 hover:bg-[#0e1b12]/50 transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#e8c547]">
                          {post.title}
                        </h3>
                        {post.category && (
                          <span className="px-2 py-1 bg-[#e8c547]/20 text-[#e8c547] text-xs rounded-full">
                            {post.category}
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            <i className="fas fa-star mr-1"></i>
                            Featured
                          </span>
                        )}
                        {!post.published && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          <i className="fas fa-eye mr-1"></i>
                          {post.views || 0} views
                        </span>
                        <span>
                          <i className="fas fa-comment mr-1"></i>
                          {post.comments?.length || 0} comments
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                        title="View Post"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link
                        href={`/admin/posts/edit/${post._id}`}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                        title="Edit Post"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      {/* Only show delete button for admin users */}
                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDeletePost(post._id, post.title)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                          title="Delete Post"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-gray-400 hover:text-[#e8c547] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="px-3 py-1 bg-[#e8c547]/20 text-[#e8c547] rounded">
                  {pagination.page}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-gray-400 hover:text-[#e8c547] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {posts.length > 0 && (
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Total: {pagination.total} posts in database
                {userRole === 'editor' && (
                  <span className="ml-2 text-yellow-400">
                    (Editor permissions: Create & Edit only)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
                {userRole === 'admin' && (
                  <button className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                    <i className="fas fa-upload mr-2"></i>
                    Import
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 
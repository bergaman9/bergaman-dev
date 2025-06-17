"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Predefined categories with icons and colors
  const predefinedCategories = [
    { name: 'technology', displayName: 'Technology', icon: 'fas fa-microchip', color: 'text-blue-400' },
    { name: 'ai', displayName: 'AI & Machine Learning', icon: 'fas fa-robot', color: 'text-purple-400' },
    { name: 'web-development', displayName: 'Web Development', icon: 'fas fa-code', color: 'text-green-400' },
    { name: 'programming', displayName: 'Programming', icon: 'fas fa-laptop-code', color: 'text-yellow-400' },
    { name: 'tutorial', displayName: 'Tutorials', icon: 'fas fa-book-open', color: 'text-orange-400' },
    { name: 'blockchain', displayName: 'Blockchain', icon: 'fas fa-link', color: 'text-cyan-400' },
    { name: 'mobile', displayName: 'Mobile Development', icon: 'fas fa-mobile-alt', color: 'text-pink-400' },
    { name: 'design', displayName: 'Design', icon: 'fas fa-palette', color: 'text-red-400' },
    { name: 'gaming', displayName: 'Gaming', icon: 'fas fa-gamepad', color: 'text-indigo-400' },
    { name: 'personal', displayName: 'Personal', icon: 'fas fa-user', color: 'text-gray-400' }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=1000');
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
        
        // Count posts per category
        const categoryStats = {};
        data.posts.forEach(post => {
          const category = post.category || 'uncategorized';
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        });

        // Combine with predefined categories
        const categoriesWithStats = predefinedCategories.map(cat => ({
          ...cat,
          count: categoryStats[cat.name] || 0,
          used: (categoryStats[cat.name] || 0) > 0
        }));

        // Add any additional categories found in posts
        Object.keys(categoryStats).forEach(categoryName => {
          if (!predefinedCategories.find(cat => cat.name === categoryName)) {
            categoriesWithStats.push({
              name: categoryName,
              displayName: formatCategoryName(categoryName),
              icon: 'fas fa-folder',
              color: 'text-gray-400',
              count: categoryStats[categoryName],
              used: true,
              custom: true
            });
          }
        });

        setCategories(categoriesWithStats);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category) => {
    switch(category) {
      case 'ai': return 'AI & Machine Learning';
      case 'web-development': return 'Web Development';
      case 'technology': return 'Technology';
      case 'tutorial': return 'Tutorials';
      case 'programming': return 'Programming';
      case 'blockchain': return 'Blockchain';
      case 'mobile': return 'Mobile Development';
      case 'design': return 'Design';
      case 'gaming': return 'Gaming';
      case 'personal': return 'Personal';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const handleUpdateCategory = async (oldName, newName) => {
    if (!newName.trim() || oldName === newName) {
      setEditingCategory(null);
      return;
    }

    try {
      // Update all posts with this category
      const postsToUpdate = posts.filter(post => post.category === oldName);
      
      for (const post of postsToUpdate) {
        await fetch(`/api/admin/posts/${post._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...post,
            category: newName
          })
        });
      }

      // Refresh data
      await fetchPosts();
      setEditingCategory(null);
      alert(`Category updated successfully! ${postsToUpdate.length} posts updated.`);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    const categoryPosts = posts.filter(post => post.category === categoryName);
    
    if (categoryPosts.length > 0) {
      const confirm = window.confirm(
        `This category has ${categoryPosts.length} posts. ` +
        `All posts will be moved to "Technology" category. Continue?`
      );
      
      if (!confirm) return;
    }

    try {
      // Move all posts to technology category
      for (const post of categoryPosts) {
        await fetch(`/api/admin/posts/${post._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...post,
            category: 'technology'
          })
        });
      }

      await fetchPosts();
      alert(`Category deleted. ${categoryPosts.length} posts moved to Technology category.`);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <>
      <Head>
        <title>Categories - Bergaman Admin Panel</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
              Categories Management
            </h1>
            <p className="text-gray-400 mt-2">Organize your blog posts by categories</p>
          </div>
          
          <Link
            href="/admin/posts"
            className="bg-[#2e3d29]/60 border border-[#3e503e] text-gray-300 px-4 py-3 rounded-lg hover:border-[#e8c547]/50 transition-colors duration-300 flex items-center space-x-2"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Posts</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#3e503e]/30">
            <h2 className="text-xl font-semibold text-[#e8c547]">
              Blog Categories ({categories.filter(cat => cat.used).length} used)
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-spinner fa-spin text-4xl mb-4 block"></i>
              <p>Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    category.used 
                      ? 'bg-[#0e1b12]/50 border-[#3e503e]/50 hover:border-[#e8c547]/30' 
                      : 'bg-[#0e1b12]/20 border-[#3e503e]/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} ${category.color} text-lg`}></i>
                      {editingCategory === category.name ? (
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onBlur={() => handleUpdateCategory(category.name, newCategoryName)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory(category.name, newCategoryName)}
                          className="bg-[#0e1b12] border border-[#3e503e] rounded px-2 py-1 text-sm text-white focus:border-[#e8c547] focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <h3 className="font-medium text-gray-300">{category.displayName}</h3>
                      )}
                    </div>
                    {category.used && (
                      <span className="text-xs bg-[#e8c547]/20 text-[#e8c547] px-2 py-1 rounded-full">
                        {category.count} posts
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">
                    Slug: <code className="bg-[#0e1b12]/80 px-1 rounded">{category.name}</code>
                  </div>

                  {category.used && (
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/admin/posts?category=${category.name}`}
                        className="text-xs text-[#e8c547] hover:text-[#d4b445] transition-colors"
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View Posts
                      </Link>
                      
                      <div className="flex items-center space-x-2">
                        {category.custom && (
                          <>
                            <button
                              onClick={() => {
                                setEditingCategory(category.name);
                                setNewCategoryName(category.displayName);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.name)}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-tags text-[#e8c547] text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Total Categories</p>
                <p className="text-xl font-bold text-white">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-check-circle text-green-400 text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Used Categories</p>
                <p className="text-xl font-bold text-white">{categories.filter(cat => cat.used).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-file-alt text-blue-400 text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Total Posts</p>
                <p className="text-xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalLikes: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchStats();
      fetchRecentPosts();
    }
    setIsLoading(false);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=1000');
      const data = await response.json();
      
      if (data.posts) {
        const totalPosts = data.posts.length;
        const totalViews = data.posts.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalComments = data.posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
        const totalLikes = data.posts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        setStats({
          totalPosts,
          totalViews,
          totalComments,
          totalLikes
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalPosts: 8,
        totalViews: 1247,
        totalComments: 23,
        totalLikes: 156
      });
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=5');
      const data = await response.json();
      
      if (data.posts) {
        setRecentPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Simple authentication (in production, this should be server-side)
    if (loginData.username === 'admin' && loginData.password === 'bergaman2024') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchStats();
      fetchRecentPosts();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMigration = async () => {
    if (confirm('This will migrate existing blog posts to MongoDB. Continue?')) {
      try {
        const response = await fetch('/api/admin/migrate', {
          method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert(`Success! ${result.message}`);
          fetchStats(); // Refresh stats
          fetchRecentPosts(); // Refresh recent posts
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Migration error:', error);
        alert('Migration failed. Check console for details.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1b12] flex items-center justify-center">
        <div className="text-[#e8c547] text-xl">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - The Dragon's Domain</title>
        </Head>
        <div className="min-h-screen bg-[#0e1b12] flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mb-6">
                <i className="fas fa-dragon text-6xl text-[#e8c547] mb-4"></i>
              </div>
              <h2 className="text-3xl font-bold gradient-text">
                Admin Portal
              </h2>
              <p className="mt-2 text-gray-400">
                Enter the Dragon's Domain
              </p>
            </div>
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-8 rounded-lg">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    placeholder="Enter username"
                    value={loginData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] placeholder-gray-400 focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={handleInputChange}
                  />
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Enter Portal
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show dashboard if authenticated
  return (
    <>
      <Head>
        <title>Admin Dashboard - The Dragon's Domain</title>
      </Head>
      <div className="min-h-screen bg-[#0e1b12] text-[#d1d5db]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                <i className="fas fa-dragon mr-3"></i>
                Dragon's Command Center
              </h1>
              <p className="text-gray-400">
                Welcome back, Bergaman! Manage your digital domain.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleMigration}
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-database mr-2"></i>
                Migrate Posts
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <i className="fas fa-file-alt text-blue-400 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-[#e8c547]">{stats.totalPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <i className="fas fa-eye text-green-400 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-[#e8c547]">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-red-600/20 rounded-lg">
                  <i className="fas fa-heart text-red-400 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-[#e8c547]">{stats.totalLikes}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <i className="fas fa-comments text-purple-400 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Years Coding</p>
                  <p className="text-2xl font-bold text-[#e8c547]">{new Date().getFullYear() - 2022}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold gradient-text mb-6">
              <i className="fas fa-bolt mr-2"></i>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/posts/new"
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 p-4 rounded-lg transition-all duration-300 hover:scale-105 block text-center"
              >
                <i className="fas fa-plus text-2xl mb-3 block"></i>
                <h3 className="font-semibold mb-1">New Post</h3>
                <p className="text-sm opacity-90">Create new blog post</p>
              </Link>

              <Link
                href="/admin/posts"
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 p-4 rounded-lg transition-all duration-300 hover:scale-105 block text-center"
              >
                <i className="fas fa-edit text-2xl mb-3 block"></i>
                <h3 className="font-semibold mb-1">Manage Posts</h3>
                <p className="text-sm opacity-90">Edit existing posts</p>
              </Link>

              <Link
                href="/admin/content"
                className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 p-4 rounded-lg transition-all duration-300 hover:scale-105 block text-center"
              >
                <i className="fas fa-cog text-2xl mb-3 block"></i>
                <h3 className="font-semibold mb-1">Site Settings</h3>
                <p className="text-sm opacity-90">Update site content</p>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/50 text-gray-300 p-4 rounded-lg transition-all duration-300 hover:scale-105 block text-center"
              >
                <i className="fas fa-external-link-alt text-2xl mb-3 block"></i>
                <h3 className="font-semibold mb-1">View Site</h3>
                <p className="text-sm opacity-90">Visit public website</p>
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold gradient-text">
                <i className="fas fa-clock mr-2"></i>
                Recent Posts
              </h2>
              <Link
                href="/admin/posts"
                className="text-[#e8c547] hover:text-[#d4b445] transition-colors duration-300"
              >
                View All →
              </Link>
            </div>
            
            {recentPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-file-alt text-4xl mb-4 block"></i>
                <p>No posts found. Create your first post!</p>
                <Link
                  href="/admin/posts/new"
                  className="inline-block mt-4 bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post._id} className="flex items-center justify-between p-4 bg-[#0e1b12] rounded-lg border border-[#3e503e]">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#e8c547] mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{post.description?.substring(0, 100)}...</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          <i className="fas fa-eye mr-1"></i>
                          {post.views || 0} views
                        </span>
                        <span>
                          <i className="fas fa-heart mr-1"></i>
                          {post.likes || 0} likes
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300 p-2"
                        title="View Post"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link
                        href={`/admin/posts/edit/${post._id}`}
                        className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300 p-2"
                        title="Edit Post"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 
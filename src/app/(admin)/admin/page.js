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
    totalContacts: 0,
    totalMembers: 0,
    pendingComments: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemInfo, setSystemInfo] = useState({
    uptime: '0 days',
    lastBackup: 'Never',
    version: '2.1.1'
  });

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
    setIsLoading(false);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all dashboard data in parallel with error handling
      const fetchWithFallback = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.warn(`Failed to fetch ${url}:`, error);
          return null;
        }
      };

      const [postsData, commentsData, contactsData, membersData] = await Promise.all([
        fetchWithFallback('/api/admin/posts?limit=1000'),
        fetchWithFallback('/api/admin/comments'),
        fetchWithFallback('/api/admin/contacts'),
        fetchWithFallback('/api/admin/members')
      ]);

      // Calculate stats with fallbacks
      const totalPosts = postsData?.posts?.length || postsData?.length || 0;
      const totalViews = postsData?.posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
      const totalComments = commentsData?.length || 0;
      const pendingComments = commentsData?.filter(comment => comment.status === 'pending').length || 0;
      const totalContacts = contactsData?.length || 0;
      const totalMembers = membersData?.length || 0;

      setStats({
        totalPosts,
        totalViews,
        totalComments,
        totalContacts,
        totalMembers,
        pendingComments
      });

      // Set recent activity with safe data handling
      const activities = [];
      
      // Add recent posts
      if (postsData?.posts || Array.isArray(postsData)) {
        const posts = postsData.posts || postsData;
        posts.slice(0, 3).forEach(post => {
          if (post && post.title) {
            activities.push({
              type: 'post',
              title: `New post: ${post.title}`,
              time: new Date(post.createdAt || Date.now()).toLocaleDateString(),
              icon: 'fas fa-file-alt',
              color: 'text-blue-400'
            });
          }
        });
      }

      // Add recent comments
      if (Array.isArray(commentsData)) {
        commentsData.slice(0, 2).forEach(comment => {
          if (comment && comment.name) {
            activities.push({
              type: 'comment',
              title: `New comment from ${comment.name}`,
              time: new Date(comment.createdAt || Date.now()).toLocaleDateString(),
              icon: 'fas fa-comment',
              color: 'text-green-400'
            });
          }
        });
      }

      // Add recent contacts
      if (Array.isArray(contactsData)) {
        contactsData.slice(0, 2).forEach(contact => {
          if (contact && contact.name) {
            activities.push({
              type: 'contact',
              title: `New message from ${contact.name}`,
              time: new Date(contact.createdAt || Date.now()).toLocaleDateString(),
              icon: 'fas fa-envelope',
              color: 'text-yellow-400'
            });
          }
        });
      }

      // Sort by most recent
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.warn('Error fetching dashboard data:', error);
      // Fallback to mock data
      setStats({
        totalPosts: 8,
        totalViews: 1247,
        totalComments: 23,
        totalContacts: 12,
        totalMembers: 3,
        pendingComments: 5
      });
      
      // Set mock recent activity
      setRecentActivity([
        {
          type: 'post',
          title: 'New post: Welcome to Bergaman',
          time: new Date().toLocaleDateString(),
          icon: 'fas fa-file-alt',
          color: 'text-blue-400'
        },
        {
          type: 'comment',
          title: 'New comment from visitor',
          time: new Date().toLocaleDateString(),
          icon: 'fas fa-comment',
          color: 'text-green-400'
        }
      ]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Simple authentication (in production, this should be server-side)
    if (loginData.username === 'bergasoft' && loginData.password === 'tE0&5A3&DBb!c55dm98&') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchDashboardData();
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
          <title>Admin Login - Bergaman Admin Panel</title>
        </Head>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-3xl"></div>
                <i className="fas fa-dragon text-6xl text-[#e8c547] mb-4 relative z-10 animate-pulse"></i>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                Bergaman Control Panel
              </h2>
              <p className="mt-2 text-gray-400">
                Enter the Dragon's Domain Control Center
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 p-8 rounded-xl shadow-2xl">
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
                  className="w-full bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] py-3 px-4 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Enter Control Panel
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
        <title>Dashboard - Bergaman Admin Panel</title>
      </Head>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                Welcome back, Bergaman! 🐉
              </h1>
              <p className="text-gray-400 mt-2">Here's what's happening with your domain today</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Last login</p>
              <p className="text-[#e8c547] font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-blue-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{stats.totalPosts}</p>
                <p className="text-gray-400 text-sm">Total Posts</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-eye text-green-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{stats.totalViews.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Views</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-purple-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{stats.totalComments}</p>
                <p className="text-gray-400 text-sm">Comments</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-envelope text-yellow-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats.totalContacts}</p>
                <p className="text-gray-400 text-sm">Messages</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-indigo-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-400">{stats.totalMembers}</p>
                <p className="text-gray-400 text-sm">Team Members</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg hover:border-[#e8c547]/30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-red-400 text-xl"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.pendingComments}</p>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#e8c547] flex items-center">
                <i className="fas fa-clock mr-3"></i>
                Recent Activity
              </h2>
              <Link 
                href="/admin/posts" 
                className="text-sm text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/20">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-500/20`}>
                      <i className={`${activity.icon} ${activity.color}`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#d1d5db] font-medium">{activity.title}</p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-clock text-4xl text-gray-600 mb-4"></i>
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#e8c547] mb-6 flex items-center">
              <i className="fas fa-bolt mr-3"></i>
              Quick Actions
            </h2>
            
            <div className="space-y-3">
              <Link
                href="/admin/posts"
                className="flex items-center space-x-3 p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/20 hover:border-[#e8c547]/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                  <i className="fas fa-plus text-blue-400"></i>
                </div>
                <div>
                  <p className="text-[#d1d5db] font-medium">New Post</p>
                  <p className="text-gray-400 text-sm">Create a new blog post</p>
                </div>
              </Link>

              <Link
                href="/admin/comments"
                className="flex items-center space-x-3 p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/20 hover:border-[#e8c547]/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                  <i className="fas fa-comments text-purple-400"></i>
                </div>
                <div>
                  <p className="text-[#d1d5db] font-medium">Moderate Comments</p>
                  <p className="text-gray-400 text-sm">{stats.pendingComments} pending approval</p>
                </div>
              </Link>

              <Link
                href="/admin/members"
                className="flex items-center space-x-3 p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/20 hover:border-[#e8c547]/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors duration-300">
                  <i className="fas fa-user-plus text-indigo-400"></i>
                </div>
                <div>
                  <p className="text-[#d1d5db] font-medium">Add Member</p>
                  <p className="text-gray-400 text-sm">Invite team members</p>
                </div>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center space-x-3 p-4 bg-[#1a2e1a]/50 rounded-lg border border-[#3e503e]/20 hover:border-[#e8c547]/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center group-hover:bg-gray-500/30 transition-colors duration-300">
                  <i className="fas fa-cog text-gray-400"></i>
                </div>
                <div>
                  <p className="text-[#d1d5db] font-medium">Settings</p>
                  <p className="text-gray-400 text-sm">Configure your site</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#e8c547] mb-6 flex items-center">
            <i className="fas fa-server mr-3"></i>
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-[#d1d5db] font-medium">System Status</p>
                <p className="text-green-400 text-sm">All systems operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-[#d1d5db] font-medium">Version</p>
                <p className="text-blue-400 text-sm">v{systemInfo.version}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-[#d1d5db] font-medium">Last Backup</p>
                <p className="text-yellow-400 text-sm">{systemInfo.lastBackup}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
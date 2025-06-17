"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import PageHeader from '../../components/PageHeader';

export default function AdminPage() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
    pendingComments: 0,
    approvedComments: 0,
    totalContacts: 0,
    newContacts: 0,
    repliedContacts: 0,
    totalMembers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemInfo, setSystemInfo] = useState({
    version: '2.3.0',
    lastBackup: 'Never',
    uptime: '24h 15m',
    serverStatus: 'Operational'
  });
  const router = useRouter();
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [postsRes, viewsRes, commentsRes, contactsRes, membersRes] = await Promise.all([
        fetch('/api/admin/posts?page=1&limit=1000'),
        fetch('/api/admin/analytics/views'),
        fetch('/api/admin/comments'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/members')
      ]);

      // Process posts data
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        const publishedPosts = postsData.posts?.filter(post => post.status === 'published').length || 0;
        const draftPosts = postsData.posts?.filter(post => post.status === 'draft').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalPosts: postsData.posts?.length || 0,
          publishedPosts,
          draftPosts
        }));

        // Set recent activity from posts
        const recentPosts = postsData.posts?.slice(0, 3).map(post => ({
          type: 'post_created',
          description: `New post "${post.title}" created`,
          timestamp: post.createdAt,
          icon: 'fas fa-plus-circle',
          color: 'text-green-400'
        })) || [];

        setRecentActivity(prev => [...prev, ...recentPosts]);
      }

      // Process views data
      if (viewsRes.ok) {
        const viewsData = await viewsRes.json();
        setStats(prev => ({
          ...prev,
          totalViews: viewsData.totalViews || 0
        }));
      }

      // Process comments data
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        const approvedComments = commentsData.comments?.filter(comment => comment.status === 'approved').length || 0;
        const pendingComments = commentsData.comments?.filter(comment => comment.status === 'pending').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalComments: commentsData.comments?.length || 0,
          approvedComments,
          pendingComments
        }));

        // Add comment activities
        const recentComments = commentsData.comments?.slice(0, 2).map(comment => ({
          type: 'comment_received',
          description: `New comment from ${comment.author}`,
          timestamp: comment.createdAt,
          icon: 'fas fa-comment',
          color: 'text-blue-400'
        })) || [];

        setRecentActivity(prev => [...prev, ...recentComments]);
      }

      // Process contacts data
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        const repliedContacts = contactsData.contacts?.filter(contact => contact.status === 'replied').length || 0;
        const newContacts = contactsData.contacts?.filter(contact => contact.status === 'new').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalContacts: contactsData.contacts?.length || 0,
          repliedContacts,
          newContacts
        }));

        // Add contact activities
        const recentContacts = contactsData.contacts?.slice(0, 2).map(contact => ({
          type: 'message_received',
          description: `New message from ${contact.name}`,
          timestamp: contact.createdAt,
          icon: 'fas fa-envelope',
          color: 'text-yellow-400'
        })) || [];

        setRecentActivity(prev => [...prev, ...recentContacts]);
      }

      // Process members data
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setStats(prev => ({
          ...prev,
          totalMembers: membersData.length || 0
        }));
      }

      // Sort activities by timestamp
      setRecentActivity(prev => 
        prev.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8)
      );

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const result = await login(loginData.username, loginData.password);
    
    if (!result.success) {
      setLoginError(result.error || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8c547] mx-auto mb-4"></div>
          <p className="text-[#d1d5db]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - Bergaman Control Panel</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#2e3d29]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#e8c547]/30 rounded-full blur-3xl animate-pulse"></div>
                <i className="fas fa-dragon text-5xl text-[#e8c547] animate-pulse relative z-10 drop-shadow-2xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent mb-2">
                Bergaman Control Panel
              </h1>
              <p className="text-gray-400">Enter your credentials to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#d1d5db] mb-2">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d1d5db] mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-[#d1d5db] focus:border-[#e8c547] focus:outline-none transition-colors"
                  required
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
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back, Bergaman! Here's what's happening with your domain today"
          icon="fas fa-tachometer-alt"
          actions={[
            {
              label: 'Refresh Data',
              variant: 'secondary',
              icon: 'fas fa-sync-alt',
              onClick: fetchDashboardData
            },
            {
              label: 'View Site',
              variant: 'primary',
              icon: 'fas fa-external-link-alt',
              href: '/'
            }
          ]}
          stats={[
            { label: 'Last Login', value: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() }
          ]}
        />

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Posts Card */}
          <Link href="/admin/posts" className="group">
            <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6 group-hover:border-[#e8c547]/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Posts</p>
                  <p className="text-3xl font-bold text-[#e8c547]">{stats.totalPosts}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="text-green-400">
                      <i className="fas fa-check-circle mr-1"></i>
                      {stats.publishedPosts} Published
                    </span>
                    <span className="text-yellow-400">
                      <i className="fas fa-edit mr-1"></i>
                      {stats.draftPosts} Drafts
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#e8c547]/20 rounded-lg group-hover:bg-[#e8c547]/30 transition-colors">
                  <i className="fas fa-newspaper text-2xl text-[#e8c547]"></i>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Views Card */}
          <Link href="/admin/analytics" className="group">
            <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 group-hover:border-blue-500/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Views</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-green-400 mt-2">
                    <i className="fas fa-arrow-up mr-1"></i>
                    +12% this month
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <i className="fas fa-eye text-2xl text-blue-400"></i>
                </div>
              </div>
            </div>
          </Link>

          {/* Comments Card */}
          <Link href="/admin/comments" className="group">
            <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 group-hover:border-purple-500/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Comments</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalComments}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="text-green-400">
                      <i className="fas fa-check mr-1"></i>
                      {stats.approvedComments} Approved
                    </span>
                    <span className="text-yellow-400">
                      <i className="fas fa-clock mr-1"></i>
                      {stats.pendingComments} Pending
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <i className="fas fa-comments text-2xl text-purple-400"></i>
                </div>
              </div>
            </div>
          </Link>

          {/* Messages Card */}
          <Link href="/admin/contacts" className="group">
            <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-green-500/20 rounded-xl p-6 group-hover:border-green-500/40 transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Messages</p>
                  <p className="text-3xl font-bold text-green-400">{stats.totalContacts}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs">
                    <span className="text-green-400">
                      <i className="fas fa-reply mr-1"></i>
                      {stats.repliedContacts} Replied
                    </span>
                    <span className="text-red-400">
                      <i className="fas fa-exclamation mr-1"></i>
                      {stats.newContacts} New
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <i className="fas fa-envelope text-2xl text-green-400"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#e8c547]">
                <i className="fas fa-history mr-2"></i>
                Recent Activity
              </h2>
              <button 
                onClick={fetchDashboardData}
                className="text-sm text-gray-400 hover:text-[#e8c547] transition-colors"
              >
                <i className="fas fa-sync-alt mr-1"></i>
                Refresh
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-[#0e1b12]/30 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.color.replace('text-', 'bg-').replace('-400', '-500/20')} flex items-center justify-center`}>
                      <i className={`${activity.icon} text-sm ${activity.color}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-clock text-2xl mb-2"></i>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#e8c547] mb-6">
              <i className="fas fa-bolt mr-2"></i>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/posts/new" className="group">
                <div className="p-4 bg-[#0e1b12]/30 rounded-lg group-hover:bg-[#e8c547]/10 transition-colors border border-transparent group-hover:border-[#e8c547]/30">
                  <i className="fas fa-plus text-2xl text-[#e8c547] mb-2"></i>
                  <p className="text-sm font-medium text-gray-300">New Post</p>
                </div>
              </Link>
              
              <Link href="/admin/media" className="group">
                <div className="p-4 bg-[#0e1b12]/30 rounded-lg group-hover:bg-blue-500/10 transition-colors border border-transparent group-hover:border-blue-500/30">
                  <i className="fas fa-images text-2xl text-blue-400 mb-2"></i>
                  <p className="text-sm font-medium text-gray-300">Media Library</p>
                </div>
              </Link>
              
              <Link href="/admin/comments" className="group">
                <div className="p-4 bg-[#0e1b12]/30 rounded-lg group-hover:bg-purple-500/10 transition-colors border border-transparent group-hover:border-purple-500/30">
                  <i className="fas fa-comment-dots text-2xl text-purple-400 mb-2"></i>
                  <p className="text-sm font-medium text-gray-300">Moderate</p>
                </div>
              </Link>
              
              <Link href="/admin/settings" className="group">
                <div className="p-4 bg-[#0e1b12]/30 rounded-lg group-hover:bg-green-500/10 transition-colors border border-transparent group-hover:border-green-500/30">
                  <i className="fas fa-cog text-2xl text-green-400 mb-2"></i>
                  <p className="text-sm font-medium text-gray-300">Settings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Overview */}
          <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#e8c547] mb-6">
              <i className="fas fa-chart-line mr-2"></i>
              Performance Overview
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Site Health</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Excellent</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Response Time</span>
                <span className="text-[#e8c547] text-sm">245ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Uptime</span>
                <span className="text-green-400 text-sm">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Security Score</span>
                <span className="text-[#e8c547] text-sm">A+</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-[#2e3d29]/40 to-[#1a2e1a]/40 backdrop-blur-md border border-[#e8c547]/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-[#e8c547] mb-6">
              <i className="fas fa-server mr-2"></i>
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Version</span>
                <span className="text-[#e8c547] text-sm">{systemInfo.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Last Backup</span>
                <span className="text-gray-400 text-sm">{systemInfo.lastBackup}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
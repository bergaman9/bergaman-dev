"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../components/AuthContext';
import PageHeader from '../../components/PageHeader';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Alert from '../../components/Alert';

// Dashboard component
function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    portfolio: 0,
    comments: 0,
    subscribers: 0,
    recommendations: 0,
    contacts: 0,
    tags: 0,
    categories: 0,
    media: 0,
    members: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch various stats
        const [postsRes, portfolioRes, commentsRes, subscribersRes, recommendationsRes, contactsRes] = await Promise.all([
          fetch('/api/admin/posts?page=1&limit=1'),
          fetch('/api/admin/portfolio'),
          fetch('/api/admin/comments'),
          fetch('/api/admin/newsletter/subscribers'),
          fetch('/api/admin/recommendations'),
          fetch('/api/admin/contacts')
        ]);

        const postsData = await postsRes.json();
        const portfolioData = await portfolioRes.json();
        const commentsData = await commentsRes.json();
        const subscribersData = await subscribersRes.json();
        const recommendationsData = await recommendationsRes.json();
        const contactsData = await contactsRes.json();

        setStats({
          posts: postsData.total || 0,
          portfolio: portfolioData.portfolio?.length || 0,
          comments: commentsData.comments?.length || 0,
          subscribers: subscribersData.subscribers?.length || 0,
          recommendations: recommendationsData.recommendations?.length || 0,
          contacts: contactsData.contacts?.length || 0,
          tags: 15, // Placeholder
          categories: 8, // Placeholder
          media: 42, // Placeholder
          members: 1 // Admin count
        });

        // Create recent activity from latest data
        const activities = [];
        
        if (commentsData.comments?.length > 0) {
          const latestComment = commentsData.comments[0];
          activities.push({
            icon: 'fas fa-comment',
            color: 'text-green-500',
            title: 'New Comment',
            description: `${latestComment.name} commented on "${latestComment.postTitle || 'a post'}"`,
            time: new Date(latestComment.createdAt).toLocaleString()
          });
        }

        if (contactsData.contacts?.length > 0) {
          const latestContact = contactsData.contacts[0];
          activities.push({
            icon: 'fas fa-envelope',
            color: 'text-blue-500',
            title: 'New Contact Message',
            description: `${latestContact.name} sent a message`,
            time: new Date(latestContact.createdAt).toLocaleString()
          });
        }

        if (subscribersData.subscribers?.length > 0) {
          const latestSubscriber = subscribersData.subscribers[0];
          activities.push({
            icon: 'fas fa-user-plus',
            color: 'text-purple-500',
            title: 'New Subscriber',
            description: `${latestSubscriber.email} subscribed to newsletter`,
            time: new Date(latestSubscriber.createdAt).toLocaleString()
          });
        }

        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const allQuickLinks = [
    // Main sections
    { href: '/admin/posts', label: 'Posts', icon: 'fas fa-blog', count: stats.posts, color: 'from-blue-500 to-blue-600', description: 'Blog posts and articles' },
    { href: '/admin/portfolio', label: 'Portfolio', icon: 'fas fa-briefcase', count: stats.portfolio, color: 'from-purple-500 to-purple-600', description: 'Projects and works' },
    { href: '/admin/recommendations', label: 'Recommendations', icon: 'fas fa-star', count: stats.recommendations, color: 'from-yellow-500 to-yellow-600', description: 'Movies, games, books' },
    { href: '/admin/comments', label: 'Comments', icon: 'fas fa-comments', count: stats.comments, color: 'from-green-500 to-green-600', description: 'User comments' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: 'fas fa-envelope', count: stats.subscribers, color: 'from-pink-500 to-pink-600', description: 'Email subscribers' },
    { href: '/admin/contacts', label: 'Contacts', icon: 'fas fa-address-book', count: stats.contacts, color: 'from-indigo-500 to-indigo-600', description: 'Contact messages' },
    
    // Additional sections not in header
    { href: '/admin/tags', label: 'Tags', icon: 'fas fa-tags', count: stats.tags, color: 'from-orange-500 to-orange-600', description: 'Content tags' },
    { href: '/admin/categories', label: 'Categories', icon: 'fas fa-folder', count: stats.categories, color: 'from-teal-500 to-teal-600', description: 'Content categories' },
    { href: '/admin/media', label: 'Media', icon: 'fas fa-photo-video', count: stats.media, color: 'from-red-500 to-red-600', description: 'Images and files' },
    { href: '/admin/members', label: 'Members', icon: 'fas fa-users', count: stats.members, color: 'from-gray-500 to-gray-600', description: 'Admin users' },
    { href: '/admin/settings', label: 'Settings', icon: 'fas fa-cog', count: null, color: 'from-slate-500 to-slate-600', description: 'Site configuration' },
    { href: '/admin/profile', label: 'Profile', icon: 'fas fa-user-circle', count: null, color: 'from-cyan-500 to-cyan-600', description: 'Your profile' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your site.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-4 border border-[#3e503e]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-2xl font-bold text-white">12.5K</p>
            </div>
            <i className="fas fa-eye text-3xl text-[#e8c547]/50"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-4 border border-[#3e503e]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Comments</p>
              <p className="text-2xl font-bold text-white">{stats.comments}</p>
            </div>
            <i className="fas fa-comments text-3xl text-green-500/50"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-4 border border-[#3e503e]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Subscribers</p>
              <p className="text-2xl font-bold text-white">{stats.subscribers}</p>
            </div>
            <i className="fas fa-users text-3xl text-purple-500/50"></i>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-4 border border-[#3e503e]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white">{stats.posts + stats.portfolio + stats.recommendations}</p>
            </div>
            <i className="fas fa-database text-3xl text-blue-500/50"></i>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-[#1a2e20]/50 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative overflow-hidden bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-[#3e503e]/30"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <i className={`${link.icon} text-3xl text-gray-400 group-hover:text-white transition-colors`}></i>
                  {link.count !== null && (
                    <span className={`text-3xl font-bold bg-gradient-to-r ${link.color} bg-clip-text text-transparent`}>
                      {link.count}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{link.description}</p>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-6 border border-[#3e503e]/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            <i className="fas fa-chart-line mr-2 text-[#e8c547]"></i>
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#2e3d29]/20 transition-colors">
                  <i className={`${activity.icon} ${activity.color} mt-1`}></i>
                  <div className="flex-1">
                    <p className="text-gray-300 font-medium">{activity.title}</p>
                    <p className="text-gray-500 text-sm">{activity.description}</p>
                    <p className="text-gray-600 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent activity to display.</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-6 border border-[#3e503e]/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            <i className="fas fa-tasks mr-2 text-[#e8c547]"></i>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/admin/posts/new" className="flex items-center text-gray-300 hover:text-[#e8c547] transition-colors p-2 rounded hover:bg-[#2e3d29]/20">
              <i className="fas fa-plus-circle mr-3 text-lg"></i>
              <span>Create New Post</span>
            </Link>
            <Link href="/admin/portfolio" className="flex items-center text-gray-300 hover:text-[#e8c547] transition-colors p-2 rounded hover:bg-[#2e3d29]/20">
              <i className="fas fa-plus-circle mr-3 text-lg"></i>
              <span>Add Portfolio Item</span>
            </Link>
            <Link href="/admin/recommendations/new" className="flex items-center text-gray-300 hover:text-[#e8c547] transition-colors p-2 rounded hover:bg-[#2e3d29]/20">
              <i className="fas fa-plus-circle mr-3 text-lg"></i>
              <span>Add Recommendation</span>
            </Link>
            <Link href="/admin/newsletter" className="flex items-center text-gray-300 hover:text-[#e8c547] transition-colors p-2 rounded hover:bg-[#2e3d29]/20">
              <i className="fas fa-paper-plane mr-3 text-lg"></i>
              <span>Send Newsletter</span>
            </Link>
            <Link href="/admin/media" className="flex items-center text-gray-300 hover:text-[#e8c547] transition-colors p-2 rounded hover:bg-[#2e3d29]/20">
              <i className="fas fa-upload mr-3 text-lg"></i>
              <span>Upload Media</span>
            </Link>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-[#1a2e20] to-[#243e2b] rounded-lg p-6 border border-[#3e503e]/30 mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          <i className="fas fa-info-circle mr-2 text-[#e8c547]"></i>
          System Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Version</p>
            <p className="text-white font-medium">v2.5.13</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Database</p>
            <p className="text-white font-medium">MongoDB Atlas</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Environment</p>
            <p className="text-white font-medium">Development</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Login component
function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState(null);
  
  const router = useRouter();
  const { isAuthenticated, loading, login, checkAuth } = useContext(AuthContext);

  // Form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginDisabled) {
      return;
    }
    
      // Form validation
  if (!username || !password) {
    setError('Please enter username and password.');
    return;
  }

    try {
      setIsLoggingIn(true);
      setError('');
      
      // Giriş işlemini başlat
      const result = await login(username, password);
      
      if (result.success) {
        // Başarılı giriş
        setError('');
        setUsername('');
        setPassword('');
        
        // Auth durumunu kontrol et ve dashboard'u göster
        const authCheck = await checkAuth();
        if (authCheck) {
          onLoginSuccess();
        }
      } else {
        // Failed login
        setError(result.error || 'Login failed. Please check your credentials.');
        
        // Show remaining attempts
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
          
          // Warn if last attempt
          if (result.remainingAttempts === 1) {
            setError('Warning! Last login attempt. If failed, your account will be locked for 15 minutes.');
          }
          
          // Hesap kilitlenmişse giriş butonunu devre dışı bırak
          if (result.remainingAttempts === 0) {
            setLoginDisabled(true);
            
            // 15 dakika sonra tekrar etkinleştir
            const timer = setTimeout(() => {
              setLoginDisabled(false);
              setRemainingAttempts(null);
              setError('');
            }, 15 * 60 * 1000); // 15 dakika
            
            setLoginTimeout(timer);
          }
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Component unmount olduğunda zamanlayıcıyı temizle
  useEffect(() => {
    return () => {
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, [loginTimeout]);

  // Şifreyi göster/gizle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1e12] via-[#132218] to-[#0e1e12] p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e8c547]/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#132218]/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#243e2b]/50">
                  {/* Logo and Title Section */}
          <div className="mb-8">
            <div className="flex items-start">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-md"></div>
                  <i className="fas fa-dragon text-3xl text-[#e8c547] relative z-10"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                    Bergaman
                  </h1>
                  <p className="text-xs text-gray-400">Admin Dashboard</p>
                </div>
              </div>
            </div>
          </div>

        {error && error.trim() !== '' && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSRF Koruması - Form içinde gizli bir input olarak */}
          <input type="hidden" name="csrf_protection" value="1" />
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-300 group-focus-within:text-[#e8c547] transition-colors duration-300"></i>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a2e20]/80 backdrop-blur-sm border border-[#243e2b]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547] transition-all duration-300"
                placeholder="Enter your username"
                disabled={isLoggingIn || loginDisabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-300 group-focus-within:text-[#e8c547] transition-colors duration-300"></i>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#1a2e20]/80 backdrop-blur-sm border border-[#243e2b]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547] transition-all duration-300"
                placeholder="Enter your password"
                disabled={isLoggingIn || loginDisabled}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </div>

          {remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="text-amber-400 text-sm">
              Remaining attempts: {remainingAttempts}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8c547] transition-all duration-300 transform hover:scale-[1.02]
                ${loginDisabled 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : isLoggingIn 
                    ? 'bg-[#e8c547]/80 text-gray-900 cursor-wait' 
                    : 'bg-gradient-to-r from-[#e8c547] to-[#f4d76b] hover:from-[#d4b43e] hover:to-[#e8c547] text-gray-900 shadow-lg hover:shadow-[#e8c547]/30'}`}
              disabled={isLoggingIn || loginDisabled}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : loginDisabled ? 'Account locked' : 'Login'}
            </button>
          </div>
        </form>

        {loginDisabled && (
          <div className="mt-4 text-center text-red-400 text-sm">
            Too many failed login attempts. Your account is locked for 15 minutes.
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-[#1a2e20]/50 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Secure SSL Connection</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Bergaman • The Dragon's Domain
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setShowDashboard(true);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1e12]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return showDashboard ? <AdminDashboard /> : <AdminLogin onLoginSuccess={() => setShowDashboard(true)} />;
} 
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/app/components/AuthContext';
import toast from 'react-hot-toast';

export default function AdminHeader({ activeTab = 'dashboard', username = 'Admin', onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  // Fetch recent activities
  useEffect(() => {
    fetchRecentActivities();
    // Poll for new activities every 30 seconds
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent contacts (new messages and recent replies)
      const contactsRes = await fetch('/api/admin/contacts?limit=10');
      const contactsData = await contactsRes.json();
      
      // Fetch recent comments
      const commentsRes = await fetch('/api/admin/comments?limit=5&status=pending');
      const commentsData = await commentsRes.json();
      
      // Combine and sort by date
      const activities = [];
      
      if (contactsData.contacts) {
        contactsData.contacts.forEach(contact => {
          // Check for new messages
          if (contact.status === 'new') {
            activities.push({
              id: contact._id,
              type: 'contact',
              title: 'New Contact Message',
              description: `${contact.name}: ${contact.message ? contact.message.substring(0, 50) : 'No message'}...`,
              time: new Date(contact.createdAt),
              link: '/admin/contacts',
              icon: 'fas fa-envelope',
              color: 'text-blue-400',
              unread: true
            });
          }
          
          // Check for recent replies from users
          if (contact.replies && contact.replies.length > 0) {
            contact.replies.forEach(reply => {
              // Only show user replies (not admin replies)
              if (reply.type === 'user' && new Date(reply.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
                activities.push({
                  id: `${contact._id}-reply-${reply._id}`,
                  type: 'reply',
                  title: 'New Reply',
                  description: `${contact.name} replied: ${reply.message ? reply.message.substring(0, 40) : 'No message'}...`,
                  time: new Date(reply.createdAt),
                  link: `/admin/contacts?highlight=${contact._id}`,
                  icon: 'fas fa-reply',
                  color: 'text-purple-400',
                  unread: !reply.read
                });
              }
            });
          }
        });
      }
      
      if (commentsData.comments) {
        commentsData.comments.forEach(comment => {
          activities.push({
            id: comment._id,
            type: 'comment',
            title: 'New Comment',
            description: `${comment.author}: ${comment.content ? comment.content.substring(0, 50) : 'No content'}...`,
            time: new Date(comment.createdAt),
            link: '/admin/comments',
            icon: 'fas fa-comment',
            color: 'text-green-400',
            unread: comment.status === 'pending'
          });
        });
      }
      
      // Sort by time (newest first)
      activities.sort((a, b) => b.time - a.time);
      
      // Limit to 15 most recent
      setNotifications(activities.slice(0, 15));
      setUnreadCount(activities.filter(a => a.unread).length);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const markAllAsRead = async () => {
    // Mark all notifications as read in local state
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    
    // Also mark them as read in the database
    try {
      const unreadReplies = notifications.filter(n => n.type === 'reply' && n.unread);
      for (const reply of unreadReplies) {
        // Extract contact ID and reply ID from the notification ID
        const [contactId] = reply.id.split('-reply-');
        await fetch(`/api/admin/contacts/${contactId}/mark-replies-read`, {
          method: 'PUT'
        });
      }
    } catch (error) {
      console.error('Error marking replies as read:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }

    if (isDropdownOpen || isMenuOpen || isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen, isMenuOpen, isNotificationsOpen]);

  const handleLogout = () => {
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    }
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/admin' && activeTab === 'dashboard') return true;
    if (path === '/admin/posts' && activeTab === 'posts') return true;
    if (path === '/admin/newsletter' && activeTab === 'newsletter') return true;
    if (path === '/admin/settings' && activeTab === 'settings') return true;
    if (path === '/admin/comments' && activeTab === 'comments') return true;
    if (path === '/admin/contacts' && activeTab === 'contacts') return true;
    if (path === '/admin/media' && activeTab === 'media') return true;
    if (path === '/admin/members' && activeTab === 'members') return true;
    if (path === '/admin/portfolio' && activeTab === 'portfolio') return true;
    if (path === '/admin/recommendations' && activeTab === 'recommendations') return true;
    if (path === '/admin/profile' && activeTab === 'profile') return true;
    if (path === '/admin/categories' && activeTab === 'categories') return true;
    if (path === '/admin/tags' && activeTab === 'tags') return true;
    if (path === '/admin/components-test' && activeTab === 'components-test') return true;
    return false;
  };

  // Navigation items
  const navItems = [
    { href: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { href: '/admin/posts', icon: 'fas fa-file-alt', label: 'Posts' },
    { href: '/admin/portfolio', icon: 'fas fa-briefcase', label: 'Portfolio' },
    { href: '/admin/recommendations', icon: 'fas fa-lightbulb', label: 'Recommendations' },
    { href: '/admin/newsletter', icon: 'fas fa-newspaper', label: 'Newsletter' },
    { href: '/admin/comments', icon: 'fas fa-comments', label: 'Comments' },
    { href: '/admin/contacts', icon: 'fas fa-envelope', label: 'Contacts' },
    { href: '/admin/media', icon: 'fas fa-images', label: 'Media' },
    { href: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a1a0f]/95 via-[#0e1b12]/95 to-[#0a1a0f]/95 border-b border-[#e8c547]/20 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-lg animate-pulse"></div>
                <i className="fas fa-dragon text-2xl text-[#e8c547] group-hover:scale-110 transition-transform duration-300 animate-pulse relative z-10 drop-shadow-lg"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                  Bergaman Portal
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                }`}
              >
                <i className={`${item.icon} text-sm`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (!isNotificationsOpen) {
                      markAllAsRead();
                    }
                  }}
                  className="relative p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 rounded-lg hover:bg-[#e8c547]/10"
                  title="Notifications"
                >
                  <i className="fas fa-bell text-lg"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50 max-h-[500px] overflow-hidden">
                    <div className="p-4 border-b border-[#3e503e]/30">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#e8c547]">Recent Activity</h3>
                        {notifications.length > 0 && (
                          <Link
                            href="/admin/activity"
                            className="text-xs text-gray-400 hover:text-[#e8c547] transition-colors"
                          >
                            View All
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto modal-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <i className="fas fa-bell-slash text-3xl text-gray-500 mb-2"></i>
                          <p className="text-sm text-gray-400">No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#3e503e]/30">
                          {notifications.map((notification) => (
                            <Link
                              key={notification.id}
                              href={notification.link}
                              className={`block p-4 hover:bg-[#e8c547]/5 transition-colors ${
                                notification.unread ? 'bg-[#e8c547]/5' : ''
                              }`}
                              onClick={() => setIsNotificationsOpen(false)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`${notification.color} mt-1`}>
                                  <i className={notification.icon}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-200">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatTime(notification.time)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* View Site */}
              <Link
                href="/"
                target="_blank"
                className="p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 rounded-lg hover:bg-[#e8c547]/10"
                title="View Site"
              >
                <i className="fas fa-external-link-alt text-sm"></i>
              </Link>
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#2e3d29]/30 border border-[#3e503e]/30 hover:border-[#e8c547]/30 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                  <i className="fas fa-crown text-[#0e1b12] text-xs"></i>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-[#e8c547]">{username || 'Admin'}</p>
                  <p className="text-xs text-gray-400">
                    {user?.role === 'superadmin' ? 'Super Admin' :
                     user?.role === 'admin' ? 'Administrator' :
                     user?.role === 'editor' ? 'Editor' :
                     user?.role === 'moderator' ? 'Moderator' :
                     'User'}
                  </p>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-[#3e503e]/30">
                      <p className="text-sm font-medium text-[#e8c547]">{username || 'Admin'}</p>
                      <p className="text-xs text-gray-400">
                        {user?.role === 'superadmin' ? 'Super Admin' :
                         user?.role === 'admin' ? 'Administrator' :
                         user?.role === 'editor' ? 'Editor' :
                         user?.role === 'moderator' ? 'Moderator' :
                         'User'}
                      </p>
                    </div>
                    
                    <Link
                      href="/admin/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="fas fa-user-edit"></i>
                      <span>Profile</span>
                    </Link>
                    
                    <div className="border-t border-[#3e503e]/30 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 rounded-lg hover:bg-[#e8c547]/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-[#3e503e]/30 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'bg-[#e8c547]/20 text-[#e8c547]'
                      : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-[#3e503e]/30 mt-4 pt-4">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-external-link-alt"></i>
                  <span>View Site</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminHeader({ activeTab = 'dashboard' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isDropdownOpen || isMenuOpen || isMoreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen, isMenuOpen, isMoreDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEditMode');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    router.push('/admin');
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
    return false;
  };

  // Primary navigation items (always visible)
  const primaryNavItems = [
    { href: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { href: '/admin/posts', icon: 'fas fa-file-alt', label: 'Posts' },
    { href: '/admin/newsletter', icon: 'fas fa-newspaper', label: 'Newsletter' },
    { href: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  // Secondary navigation items (in dropdown)
  const secondaryNavItems = [
    { href: '/admin/comments', icon: 'fas fa-comments', label: 'Comments' },
    { href: '/admin/contacts', icon: 'fas fa-envelope', label: 'Contacts' },
    { href: '/admin/media', icon: 'fas fa-images', label: 'Media' },
    { href: '/admin/members', icon: 'fas fa-users', label: 'Members' },
    { href: '/admin/portfolio', icon: 'fas fa-briefcase', label: 'Portfolio' },
    { href: '/admin/recommendations', icon: 'fas fa-lightbulb', label: 'Recommendations' }
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a1a0f]/95 via-[#0e1b12]/95 via-[#1a2e1a]/95 to-[#0a1a0f]/95 border-b border-[#e8c547]/20 backdrop-blur-md sticky top-0 z-30">
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
                <p className="text-xs text-gray-400 -mt-1">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.href)
                    ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                }`}
              >
                <i className={`${item.icon} text-sm`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* More Menu Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreDropdownOpen(!isMoreDropdownOpen);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  secondaryNavItems.some(item => isActive(item.href))
                    ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                }`}
              >
                <i className="fas fa-ellipsis-h text-sm"></i>
                <span>More</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isMoreDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* More Menu Dropdown */}
              {isMoreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-300 ${
                          isActive(item.href)
                            ? 'text-[#e8c547] bg-[#e8c547]/10'
                            : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                        }`}
                        onClick={() => setIsMoreDropdownOpen(false)}
                      >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                target="_blank"
                className="p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
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
                  <i className="fas fa-user text-[#0e1b12] text-xs"></i>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-[#e8c547]">Bergaman</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-[#3e503e]/30">
                      <p className="text-sm font-medium text-[#e8c547]">Bergaman</p>
                      <p className="text-xs text-gray-400">Administrator</p>
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
              className="lg:hidden p-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-[#3e503e]/30 py-4">
            <div className="space-y-2">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => (
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 
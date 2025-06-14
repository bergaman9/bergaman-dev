"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEditMode');
    router.push('/admin');
  };

  const isActive = (path) => {
    return pathname === path;
  };

  // Primary navigation items (always visible)
  const primaryNavItems = [
    { href: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { href: '/admin/posts', icon: 'fas fa-file-alt', label: 'Posts' },
    { href: '/admin/newsletter', icon: 'fas fa-newspaper', label: 'Newsletter' }
  ];

  // Secondary navigation items (in dropdown)
  const secondaryNavItems = [
    { href: '/admin/comments', icon: 'fas fa-comments', label: 'Comments' },
    { href: '/admin/contacts', icon: 'fas fa-envelope', label: 'Contacts' },
    { href: '/admin/members', icon: 'fas fa-users', label: 'Members' },
    { href: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a1a0f]/95 via-[#0e1b12]/95 via-[#1a2e1a]/95 to-[#0a1a0f]/95 border-b border-[#e8c547]/20 backdrop-blur-md sticky top-0 z-50">
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
          <nav className="hidden lg:flex items-center space-x-1">
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
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  secondaryNavItems.some(item => isActive(item.href))
                    ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                }`}
              >
                <i className="fas fa-ellipsis-h text-sm"></i>
                <span>More</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* More Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50">
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
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
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
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#2e3d29]/30 border border-[#3e503e]/30 hover:border-[#e8c547]/30 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-[#0e1b12] text-xs"></i>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-[#e8c547]">Bergaman</p>
                  <p className="text-xs text-gray-400">Electronics Engineer</p>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-[#3e503e]/30">
                      <p className="text-sm font-medium text-[#e8c547]">Bergaman</p>
                      <p className="text-xs text-gray-400">Electronics Engineer</p>
                    </div>
                    
                    <Link
                      href="/admin/settings"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </Link>
                    
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
          <div className="lg:hidden border-t border-[#3e503e]/30 py-4">
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

      {/* Close dropdowns when clicking outside */}
      {(isDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        ></div>
      )}
    </header>
  );
} 
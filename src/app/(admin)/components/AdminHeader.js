"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEditMode');
    router.push('/admin');
  };

  const isActive = (path) => {
    return pathname === path;
  };

  const navItems = [
    { href: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { href: '/admin/posts', icon: 'fas fa-file-alt', label: 'Posts' },
    { href: '/admin/comments', icon: 'fas fa-comments', label: 'Comments' },
    { href: '/admin/contacts', icon: 'fas fa-envelope', label: 'Contacts' },
    { href: '/admin/members', icon: 'fas fa-users', label: 'Members' },
    { href: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  return (
    <header className="bg-gradient-to-r from-[#0e1b12] via-[#1a2e1a] to-[#0e1b12] border-b border-[#3e503e]/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="relative">
                <i className="fas fa-dragon text-3xl text-[#e8c547] group-hover:scale-110 transition-transform duration-300 animate-pulse"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                  Bergasoft Portal
                </h1>
                <p className="text-sm text-gray-400 -mt-1">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
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
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/"
                target="_blank"
                className="p-3 text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                title="View Site"
              >
                <i className="fas fa-external-link-alt text-sm"></i>
              </Link>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-3 rounded-lg bg-[#2e3d29]/30 border border-[#3e503e]/30 hover:border-[#e8c547]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-[#0e1b12] text-sm"></i>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-[#e8c547]">Bergaman</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl backdrop-blur-md z-50">
                  <div className="py-3">
                    <div className="px-4 py-3 border-b border-[#3e503e]/30">
                      <p className="text-sm font-medium text-[#e8c547]">Bergaman</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    
                    <Link
                      href="/admin/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="fas fa-cog"></i>
                      <span>Settings</span>
                    </Link>
                    
                    <Link
                      href="/admin/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="fas fa-user-edit"></i>
                      <span>Profile</span>
                    </Link>
                    
                    <div className="border-t border-[#3e503e]/30 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300"
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
            <button className="md:hidden p-3 text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
} 
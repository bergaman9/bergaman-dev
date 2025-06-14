"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      
      if (adminAuth === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEditMode');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-slate-300 text-lg">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  // If not authenticated and not on main admin page, redirect to admin
  if (!isAuthenticated && pathname !== '/admin') {
    router.push('/admin');
    return null;
  }

  // If on main admin page, let the page handle authentication
  if (pathname === '/admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {children}
      </div>
    );
  }

  // For other admin pages, show layout only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Admin Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cog text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-slate-400">Content Management System</p>
                </div>
              </Link>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                <Link 
                  href="/admin" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === '/admin' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  Dashboard
                </Link>
                <Link 
                  href="/admin/posts" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/admin/posts') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Blog Posts
                </Link>
                <Link 
                  href="/admin/content" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/admin/content') 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Site Content
                </Link>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* View Site */}
              <Link 
                href="/" 
                target="_blank"
                className="px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <i className="fas fa-external-link-alt"></i>
                <span className="hidden sm:inline">View Site</span>
              </Link>
              
              {/* Edit Mode Toggle */}
              <button
                onClick={() => {
                  const isEditMode = localStorage.getItem('adminEditMode') === 'true';
                  localStorage.setItem('adminEditMode', (!isEditMode).toString());
                  window.open('/', '_blank');
                }}
                className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <i className="fas fa-edit"></i>
                <span className="hidden sm:inline">Live Edit</span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">Bergaman</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                <i className="fas fa-shield-alt mr-2"></i>
                Admin Panel v2.0
              </div>
              <div className="text-sm text-slate-400">
                <i className="fas fa-clock mr-2"></i>
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/admin" 
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/posts" 
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                Posts
              </Link>
              <Link 
                href="https://github.com/bergaman9/bergaman-dev" 
                target="_blank"
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                <i className="fab fa-github mr-1"></i>
                GitHub
              </Link>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              © 2024 Bergaman Admin Panel. Built with Next.js & MongoDB.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
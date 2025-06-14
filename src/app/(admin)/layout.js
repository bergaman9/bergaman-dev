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
    setIsAuthenticated(false);
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1b12] flex items-center justify-center">
        <div className="text-[#e8c547] text-xl">Loading...</div>
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
      <div className="min-h-screen bg-[#0e1b12]">
        {children}
      </div>
    );
  }

  // For other admin pages, show layout only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0e1b12] text-[#d1d5db]">
      {/* Admin Header */}
      <header className="bg-[#2e3d29]/30 backdrop-blur-md border-b border-[#3e503e]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-2xl font-bold gradient-text">
                Admin Panel
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link 
                  href="/admin" 
                  className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                    pathname === '/admin' 
                      ? 'bg-[#e8c547] text-[#0e1b12]' 
                      : 'text-gray-300 hover:text-[#e8c547]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/posts" 
                  className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                    pathname.startsWith('/admin/posts') 
                      ? 'bg-[#e8c547] text-[#0e1b12]' 
                      : 'text-gray-300 hover:text-[#e8c547]'
                  }`}
                >
                  Blog Posts
                </Link>
                <Link 
                  href="/admin/content" 
                  className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                    pathname.startsWith('/admin/content') 
                      ? 'bg-[#e8c547] text-[#0e1b12]' 
                      : 'text-gray-300 hover:text-[#e8c547]'
                  }`}
                >
                  Site Content
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                target="_blank"
                className="text-gray-300 hover:text-[#e8c547] transition-colors duration-300"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                View Site
              </Link>
              <button
                onClick={() => {
                  localStorage.setItem('adminEditMode', 'true');
                  window.open('/', '_blank');
                }}
                className="text-gray-300 hover:text-[#e8c547] transition-colors duration-300"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Mode
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 
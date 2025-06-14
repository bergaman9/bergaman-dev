"use client";

import { useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';

export default function AdminLayout({ children }) {
  useEffect(() => {
    // Hide loading screen after component mounts
    const timer = setTimeout(() => {
      const loading = document.getElementById('admin-loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] via-[#1a2e1a] to-[#0a1a0f] text-[#d1d5db] flex flex-col relative">
      
      {/* Clean Professional Background */}
      <div className="fixed inset-0 z-0">
        {/* Base Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-[#1a2e1a]/40 via-transparent to-[#0e1b12]/40"></div>
        
        {/* Clean Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Subtle Accent Lines */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/10 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/8 to-transparent"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Loading Screen */}
        <div id="admin-loading" className="fixed inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] via-[#1a2e1a] to-[#0a1a0f] flex items-center justify-center z-50 transition-opacity duration-500">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#e8c547]/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-2xl animate-pulse delay-500"></div>
              <i className="fas fa-dragon text-6xl text-[#e8c547] animate-pulse relative z-10 drop-shadow-2xl"></i>
            </div>
            <div className="text-[#d1d5db] text-lg font-medium mb-2">Loading Bergaman - The Dragon's Domain</div>
            <div className="text-[#e8c547] text-sm font-medium mb-6">Admin Portal</div>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-2 border-[#e8c547]/30 border-t-[#e8c547] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Admin Header - Full Width */}
        <AdminHeader />

        {/* Admin Content - Constrained Width */}
        <main className="flex-1 py-8 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[calc(100vh-200px)]">
              {children}
            </div>
          </div>
        </main>

        {/* Admin Footer - Full Width */}
        <AdminFooter />
      </div>
    </div>
  );
} 
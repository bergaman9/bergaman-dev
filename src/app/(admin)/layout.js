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
      
      {/* Professional Dragon Background */}
      <div className="fixed inset-0 z-0">
        {/* Elegant Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-[#1a2e1a]/50 via-transparent to-[#0e1b12]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2e3d29]/20 via-transparent to-[#e8c547]/5"></div>
        
        {/* Subtle Dragon Aura - Corner Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#e8c547]/8 via-[#e8c547]/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-[#2e3d29]/12 via-[#2e3d29]/4 to-transparent rounded-full blur-3xl"></div>
        
        {/* Professional Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.1'%3E%3Cpath d='M0 0h1v1H0V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zm10 0h1v1h-1V0zM0 10h1v1H0v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1zm10 0h1v1h-1v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Diagonal Accent Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/8 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/6 to-transparent"></div>
        <div className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-[#e8c547]/4 to-transparent"></div>
        
        {/* Minimal Floating Elements */}
        <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-[#e8c547]/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-[#e8c547]/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 left-2/3 w-2.5 h-2.5 bg-[#e8c547]/20 rounded-full animate-pulse delay-3000"></div>
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
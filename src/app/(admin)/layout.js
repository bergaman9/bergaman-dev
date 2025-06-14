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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] via-[#1a2e1a] to-[#0a1a0f] text-[#d1d5db] flex flex-col relative overflow-hidden">
      
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Primary Dragon Aura */}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-gradient-radial from-[#e8c547]/8 via-[#e8c547]/4 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-radial from-[#2e3d29]/12 via-[#2e3d29]/6 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Central Power Core */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#e8c547]/5 via-[#e8c547]/2 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Dragon Scale Pattern */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.03'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Mystical Floating Orbs */}
        <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-[#e8c547]/30 rounded-full animate-bounce delay-300 shadow-lg shadow-[#e8c547]/20"></div>
        <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-[#e8c547]/40 rounded-full animate-bounce delay-700 shadow-lg shadow-[#e8c547]/20"></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-[#e8c547]/25 rounded-full animate-bounce delay-1000 shadow-lg shadow-[#e8c547]/20"></div>
        <div className="absolute top-1/6 right-1/3 w-1.5 h-1.5 bg-[#e8c547]/35 rounded-full animate-bounce delay-1300 shadow-lg shadow-[#e8c547]/20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#e8c547]/30 rounded-full animate-bounce delay-1600 shadow-lg shadow-[#e8c547]/20"></div>
        
        {/* Energy Streams */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/10 to-transparent animate-pulse delay-200"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#e8c547]/8 to-transparent animate-pulse delay-800"></div>
        
        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Dragon Breath Effect */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-conic from-[#e8c547]/5 via-transparent to-[#e8c547]/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-conic from-[#2e3d29]/8 via-transparent to-[#2e3d29]/8 rounded-full blur-2xl animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Loading Screen */}
        <div id="admin-loading" className="fixed inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a] flex items-center justify-center z-50 transition-opacity duration-500">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-3xl animate-pulse"></div>
              <i className="fas fa-dragon text-6xl text-[#e8c547] animate-pulse relative z-10"></i>
            </div>
            <div className="text-[#d1d5db] text-lg font-medium">Loading Bergaman Control Panel...</div>
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
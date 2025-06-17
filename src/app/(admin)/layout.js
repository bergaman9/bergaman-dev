"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';

export default function AdminLayout({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.includes('/admin/posts')) {
      setActiveTab('posts');
    } else if (path.includes('/admin/portfolio')) {
      setActiveTab('portfolio');
    } else if (path.includes('/admin/recommendations')) {
      setActiveTab('recommendations');
    } else if (path.includes('/admin/newsletter')) {
      setActiveTab('newsletter');
    } else if (path.includes('/admin/comments')) {
      setActiveTab('comments');
    } else if (path.includes('/admin/contacts')) {
      setActiveTab('contacts');
    } else if (path.includes('/admin/members')) {
      setActiveTab('members');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    } else if (path.includes('/admin/profile')) {
      setActiveTab('profile');
    } else if (path.includes('/admin/media')) {
      setActiveTab('media');
    } else if (path.includes('/admin/categories')) {
      setActiveTab('categories');
    } else if (path.includes('/admin/tags')) {
      setActiveTab('tags');
    } else {
      setActiveTab('dashboard');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0e1b12] text-white relative overflow-hidden">
      {/* Admin Background with Modern Soft Gradient */}
      <div className="fixed inset-0 z-0">
        {/* Base Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a11] via-[#132218] to-[#1a2e1a]"></div>
        
        {/* Soft Flowing Gradients */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMSIgY3g9IjIwJSIgY3k9IjMwJSIgcj0iMzAlIiBmeD0iMjAlIiBmeT0iMzAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzJlM2QyOTtzdG9wLW9wYWNpdHk6MC4yIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZTFiMTI7c3RvcC1vcGFjaXR5OjAiIC8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMiIgY3g9IjcwJSIgY3k9IjcwJSIgcj0iNDAlIiBmeD0iNzAlIiBmeT0iNzAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFlMzMyNDtzdG9wLW9wYWNpdHk6MC4yIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZTFiMTI7c3RvcC1vcGFjaXR5OjAiIC8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJncmFkMyIgY3g9IjQwJSIgY3k9IjYwJSIgcj0iMzUlIiBmeD0iNDAlIiBmeT0iNjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzI1MzgyMDtzdG9wLW9wYWNpdHk6MC4xNSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGUxYjEyO3N0b3Atb3BhY2l0eTowIiAvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkMSkiIC8+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkMikiIC8+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkMykiIC8+Cjwvc3ZnPg==')]"></div>
        </div>
        
        {/* Subtle Organic Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[5%] w-[40%] h-[30%] rounded-full bg-[#e8c547]/5 blur-[100px]"></div>
          <div className="absolute bottom-[15%] right-[10%] w-[35%] h-[40%] rounded-full bg-[#2e3d29]/10 blur-[120px]"></div>
          <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] rounded-full bg-[#e8c547]/5 blur-[80px]"></div>
        </div>
        
        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        ></div>
      </div>
      
      <AdminHeader activeTab={activeTab} />
      
      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </div>
      </main>
      
      <AdminFooter />
    </div>
  );
} 
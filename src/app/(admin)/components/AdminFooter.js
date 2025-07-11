"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAppVersion } from '../../../lib/version';

export default function AdminFooter() {
  const [currentTime, setCurrentTime] = useState('');
  const [appVersion, setAppVersion] = useState('2.5.13');
  const [systemStats, setSystemStats] = useState({
    uptime: '0h 0m',
    memory: '0%',
    cpu: '0%',
    activeUsers: 0,
    todayVisits: 0
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    const updateStats = async () => {
      try {
        // Get process start time from environment or fallback to session start
        const startTime = window.sessionStartTime || Date.now();
        if (!window.sessionStartTime) {
          window.sessionStartTime = startTime;
        }
        
        const uptimeMs = Date.now() - startTime;
        const uptimeMinutes = Math.floor(uptimeMs / 1000 / 60);
        const hours = Math.floor(uptimeMinutes / 60);
        const minutes = uptimeMinutes % 60;
        
        // Get real memory usage if available
        let memoryUsage = 'N/A';
        let cpuUsage = 'N/A';
        
        if (performance && performance.memory) {
          const memUsed = performance.memory.usedJSHeapSize;
          const memTotal = performance.memory.jsHeapSizeLimit;
          memoryUsage = Math.round((memUsed / memTotal) * 100) + '%';
        }
        
        // Get active users from localStorage or session
        const activeUsers = parseInt(localStorage.getItem('activeUsers') || '1');
        
        // Get today's visits from localStorage
        const today = new Date().toDateString();
        const visitData = JSON.parse(localStorage.getItem('visitData') || '{}');
        if (visitData.date !== today) {
          visitData.date = today;
          visitData.count = 1;
        } else {
          visitData.count = (visitData.count || 0) + 1;
        }
        localStorage.setItem('visitData', JSON.stringify(visitData));
        
        setSystemStats({
          uptime: `${hours}h ${minutes}m`,
          memory: memoryUsage,
          cpu: cpuUsage,
          activeUsers: activeUsers,
          todayVisits: visitData.count
        });
        
        // Try to fetch real stats from API if available
        try {
          const response = await fetch('/api/admin/system-stats');
          if (response.ok) {
            const data = await response.json();
            setSystemStats(prevStats => ({
              ...prevStats,
              ...data
            }));
          }
        } catch (error) {
          // Silently fail - use local stats
        }
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    };

    updateTime();
    updateStats();
    setAppVersion(getAppVersion());
    
    const timeInterval = setInterval(updateTime, 1000);
    const statsInterval = setInterval(updateStats, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const quickActions = [
    { href: '/admin/posts/new', icon: 'fas fa-plus', label: 'New Post' },
    { href: '/admin/comments', icon: 'fas fa-comments', label: 'Comments' },
    { href: '/admin/contacts', icon: 'fas fa-envelope', label: 'Contacts' },
    { href: '/admin/content', icon: 'fas fa-cog', label: 'Settings' },
    { href: '/', icon: 'fas fa-external-link-alt', label: 'View Site', external: true }
  ];

  return (
    <footer className="bg-gradient-to-r from-[#0a1a0f]/95 via-[#0e1b12]/95 via-[#1a2e1a]/95 to-[#0a1a0f]/95 border-t border-[#e8c547]/20 backdrop-blur-md mt-auto w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          
          {/* System Status */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#e8c547] mb-2 sm:mb-3 flex items-center">
              <i className="fas fa-server mr-1 sm:mr-2"></i>
              System Status
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server Time:</span>
                <span className="text-green-400 font-mono text-xs">{currentTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-blue-400 font-mono text-xs">{systemStats.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Memory:</span>
                <span className="text-yellow-400 font-mono text-xs">{systemStats.memory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CPU:</span>
                <span className="text-purple-400 font-mono text-xs">{systemStats.cpu}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users:</span>
                <span className="text-orange-400 font-mono text-xs">{systemStats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Today's Visits:</span>
                <span className="text-cyan-400 font-mono text-xs">{systemStats.todayVisits}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#e8c547] mb-2 sm:mb-3 flex items-center">
              <i className="fas fa-bolt mr-1 sm:mr-2"></i>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 sm:gap-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-400 hover:text-[#e8c547] transition-colors duration-300 p-1 sm:p-2 rounded hover:bg-[#2e3d29]/50"
                >
                  <i className={action.icon}></i>
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#e8c547] mb-2 sm:mb-3 flex items-center">
              <i className="fas fa-user-shield mr-1 sm:mr-2"></i>
              Admin Panel
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs text-gray-400">
              <p className="truncate">Bergaman - The Dragon's Domain</p>
              <p>Version {appVersion}</p>
              <p>Admin Control Panel</p>
              <div className="flex items-center space-x-2 pt-1 sm:pt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">System Online</span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#e8c547] mb-2 sm:mb-3 flex items-center">
              <i className="fas fa-code mr-1 sm:mr-2"></i>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-react text-blue-400"></i>
                <span className="text-gray-400 hidden sm:inline">Next.js</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fas fa-database text-green-400"></i>
                <span className="text-gray-400 hidden sm:inline">MongoDB</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-node-js text-green-500"></i>
                <span className="text-gray-400 hidden sm:inline">Node.js</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-js-square text-yellow-400"></i>
                <span className="text-gray-400 hidden sm:inline">JavaScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3e503e]/30 pt-3 sm:pt-4">
          <div className="flex flex-col space-y-2 sm:space-y-3 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 lg:space-x-4 text-xs text-gray-500 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <i className="fas fa-dragon text-[#e8c547]"></i>
                <span>© 2025 Bergaman - The Dragon's Domain</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>All rights reserved</span>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs order-3 lg:order-2">
              <Link 
                href="/admin" 
                className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                Dashboard
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/" 
                target="_blank"
                className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                Public Site
              </Link>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Back to top</span>
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>

            {/* Version Badge */}
            <div className="flex items-center justify-center space-x-2 bg-[#0e1b12]/50 px-2 sm:px-3 py-1 rounded-full order-1 lg:order-3">
              <i className="fas fa-code-branch text-[#e8c547] text-xs"></i>
              <span className="text-xs text-gray-400">{appVersion}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
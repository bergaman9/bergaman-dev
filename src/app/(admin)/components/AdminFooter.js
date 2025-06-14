"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAppVersion } from '../../../lib/version';

export default function AdminFooter() {
  const [currentTime, setCurrentTime] = useState('');
  const [appVersion, setAppVersion] = useState('v2.0.0');
  const [systemStats, setSystemStats] = useState({
    uptime: '0h 0m',
    memory: '0%',
    cpu: '0%'
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

    const updateStats = () => {
      // Simulated system stats (in a real app, these would come from an API)
      setSystemStats({
        uptime: Math.floor(Date.now() / 1000 / 60) + 'm',
        memory: Math.floor(Math.random() * 30 + 40) + '%',
        cpu: Math.floor(Math.random() * 20 + 10) + '%'
      });
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
    { href: '/admin/content', icon: 'fas fa-cog', label: 'Settings' },
    { href: '/', icon: 'fas fa-external-link-alt', label: 'View Site', external: true }
  ];

  return (
    <footer className="bg-gradient-to-r from-[#0a1a0f]/95 via-[#0e1b12]/95 via-[#1a2e1a]/95 to-[#0a1a0f]/95 border-t border-[#e8c547]/20 backdrop-blur-md mt-auto w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          
          {/* System Status */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-[#e8c547] mb-3 flex items-center">
              <i className="fas fa-server mr-2"></i>
              System Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server Time:</span>
                <span className="text-green-400 font-mono">{currentTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-blue-400 font-mono">{systemStats.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Memory:</span>
                <span className="text-yellow-400 font-mono">{systemStats.memory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CPU:</span>
                <span className="text-purple-400 font-mono">{systemStats.cpu}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-[#e8c547] mb-3 flex items-center">
              <i className="fas fa-bolt mr-2"></i>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="flex items-center space-x-2 text-xs text-gray-400 hover:text-[#e8c547] transition-colors duration-300 p-2 rounded hover:bg-[#2e3d29]/50"
                >
                  <i className={action.icon}></i>
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Info */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-[#e8c547] mb-3 flex items-center">
              <i className="fas fa-user-shield mr-2"></i>
              Admin Panel
            </h3>
            <div className="space-y-2 text-xs text-gray-400">
              <p>Bergaman - The Dragon's Domain</p>
              <p>Version {appVersion.replace('v', '')}</p>
              <p>Admin Control Panel</p>
              <div className="flex items-center space-x-2 pt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">System Online</span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-[#e8c547] mb-3 flex items-center">
              <i className="fas fa-code mr-2"></i>
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-react text-blue-400"></i>
                <span className="text-gray-400">Next.js</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fas fa-database text-green-400"></i>
                <span className="text-gray-400">MongoDB</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-node-js text-green-500"></i>
                <span className="text-gray-400">Node.js</span>
              </div>
              <div className="flex items-center space-x-1 bg-[#0e1b12]/50 px-2 py-1 rounded text-xs">
                <i className="fab fa-js-square text-yellow-400"></i>
                <span className="text-gray-400">JavaScript</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3e503e]/30 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <i className="fas fa-dragon text-[#e8c547]"></i>
                <span>© 2025 Bergaman - The Dragon's Domain</span>
              </div>
              <span>•</span>
              <span>All rights reserved</span>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center space-x-4 text-xs">
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
            <div className="flex items-center space-x-2 bg-[#0e1b12]/50 px-3 py-1 rounded-full">
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
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { SITE_CONFIG, SOCIAL_LINKS } from '../../lib/constants';
import { getAppVersion } from '../../lib/version';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [appVersion, setAppVersion] = useState('2.5.13');
  
  useEffect(() => {
    // Set version on client-side to avoid hydration mismatch
    setAppVersion(getAppVersion());
  }, []);

  return (
    <footer className="w-full bg-gradient-to-t from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]/20 border-t border-[#3e503e]/60 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e8c547]/30 rounded-full blur-lg animate-pulse"></div>
                <i className="fas fa-dragon text-3xl text-[#e8c547] relative z-10 drop-shadow-lg animate-pulse"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                  Bergaman
                </h3>
                <p className="text-sm text-gray-400 -mt-1">The Dragon's Domain</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Crafting innovative solutions with dragon's wisdom.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center sm:justify-start space-x-3">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 bg-gradient-to-br from-[#2e3d29] to-[#1a2e1a] border border-[#3e503e]/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50 transition-all duration-300 hover:scale-110"
                  title={social.label}
                >
                  <div className="absolute inset-0 bg-[#e8c547]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <i className={`${social.icon} text-base relative z-10`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#e8c547] mb-4 flex items-center justify-center sm:justify-start">
              <i className="fas fa-link mr-2 text-sm"></i>
              Quick Links
            </h4>
            <div className="space-y-2">
              {[
                { href: '/about', label: 'About', icon: 'fas fa-user' },
                { href: '/portfolio', label: 'Portfolio', icon: 'fas fa-briefcase' },
                { href: '/blog', label: 'Blog', icon: 'fas fa-blog' },
                { href: '/recommendations', label: 'Recommendations', icon: 'fas fa-heart' },
                { href: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="group flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 py-1"
                >
                  <i className={`${link.icon} text-xs group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#e8c547] mb-4 flex items-center justify-center sm:justify-start">
              <i className="fas fa-book mr-2 text-sm"></i>
              Resources
            </h4>
            <div className="space-y-2">
              <Link
                href="/privacy-policy"
                className="group flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 py-1"
              >
                <i className="fas fa-shield-alt text-xs group-hover:scale-110 transition-transform duration-300"></i>
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
              </Link>
              <a
                href="https://github.com/bergaman9/bergaman-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 py-1"
              >
                <i className="fab fa-github text-xs group-hover:scale-110 transition-transform duration-300"></i>
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Source Code</span>
              </a>
              <a
                href={SITE_CONFIG.previousVersions.v1.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 py-1"
                title={SITE_CONFIG.previousVersions.v1.description}
              >
                <i className="fas fa-history text-xs group-hover:scale-110 transition-transform duration-300"></i>
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Portfolio 1.x.x</span>
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#e8c547] mb-4 flex items-center justify-center sm:justify-start">
              <i className="fas fa-code mr-2 text-sm"></i>
              Tech Stack
            </h4>
            
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <i className="fab fa-react text-lg"></i>
                <span className="text-sm">React</span>
              </div>
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors duration-300">
                <i className="fas fa-bolt text-lg"></i>
                <span className="text-sm">Next.js</span>
              </div>
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-300">
                <i className="fas fa-database text-lg"></i>
                <span className="text-sm">MongoDB</span>
              </div>
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-300">
                <i className="fab fa-node-js text-lg"></i>
                <span className="text-sm">Node.js</span>
              </div>
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <i className="fas fa-wind text-lg"></i>
                <span className="text-sm">Tailwind</span>
              </div>
              <div className="group flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-300">
                <i className="fas fa-cloud text-lg"></i>
                <span className="text-sm">Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3e503e]/30 pt-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            
            {/* Copyright & Version */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-copyright"></i>
                  <span>{currentYear} {SITE_CONFIG.name}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-code-branch text-[#e8c547] text-xs"></i>
                  <span className="text-xs">{appVersion}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Made with <i className="fas fa-heart text-red-400 mx-1"></i> and <i className="fas fa-dragon text-[#e8c547] mx-1"></i> by Bergaman
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center sm:justify-end space-x-4">
              {/* MIT License Badge */}
              <a
                href="https://github.com/bergaman9/bergaman-dev/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-[#0e1b12]/50 px-3 py-1.5 rounded-full border border-[#3e503e]/30 text-xs text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/30 transition-all duration-300"
              >
                <i className="fas fa-balance-scale"></i>
                <span>MIT License</span>
              </a>

              {/* Back to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-[#e8c547]/10"
              >
                <span className="text-sm">Back to top</span>
                <i className="fas fa-arrow-up text-xs group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

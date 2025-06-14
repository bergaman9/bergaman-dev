"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { SITE_CONFIG, SOCIAL_LINKS } from '../../lib/constants';
import { getAppVersion } from '../../lib/version';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [appVersion, setAppVersion] = useState('v2.1.1'); // Default fallback - updated to current version
  
  useEffect(() => {
    // Set version on client-side to avoid hydration mismatch
    setAppVersion(getAppVersion());
  }, []);

  return (
    <footer className="w-full bg-gradient-to-t from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]/20 border-t border-[#e8c547]/20 mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e8c547]/30 rounded-full blur-lg animate-pulse"></div>
                <i className="fas fa-dragon text-3xl text-[#e8c547] relative z-10 drop-shadow-lg"></i>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                  Bergaman
                </h3>
                <p className="text-sm text-gray-400 -mt-1">The Dragon's Domain</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md mx-auto sm:mx-0">
              Crafting innovative technology solutions inspired by the strength and wisdom of a dragon. 
              Specializing in AI, full-stack development, and cutting-edge engineering.
            </p>
            
            <div className="flex justify-center sm:justify-start space-x-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 bg-gradient-to-br from-[#2e3d29] to-[#1a2e1a] border border-[#3e503e]/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50 transition-all duration-300 hover:scale-110"
                  title={social.label}
                >
                  <div className="absolute inset-0 bg-[#e8c547]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <i className={`${social.icon} text-lg relative z-10`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-[#e8c547] mb-6 flex items-center justify-center sm:justify-start">
              <i className="fas fa-link mr-2"></i>
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { href: '/about', label: 'About Me', icon: 'fas fa-user' },
                { href: '/portfolio', label: 'Portfolio', icon: 'fas fa-briefcase' },
                { href: '/blog', label: 'Blog', icon: 'fas fa-blog' },
                { href: '/newsletter', label: 'Newsletter', icon: 'fas fa-newspaper' },
                { href: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="group flex items-center justify-center sm:justify-start space-x-3 text-gray-400 hover:text-[#e8c547] transition-all duration-300 py-1"
                >
                  <i className={`${link.icon} text-sm group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tech & Resources */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold text-[#e8c547] mb-6 flex items-center justify-center sm:justify-start">
              <i className="fas fa-code mr-2"></i>
              Tech & Resources
            </h4>
            
            {/* Tech Stack Icons */}
            <div className="flex justify-center sm:justify-start items-center space-x-3 mb-6">
              <div className="group relative">
                <i className="fab fa-react text-2xl text-blue-400 group-hover:scale-125 transition-transform duration-300" title="React"></i>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">React</div>
              </div>
              <div className="group relative">
                <i className="fab fa-js-square text-2xl text-yellow-400 group-hover:scale-125 transition-transform duration-300" title="Next.js"></i>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Next.js</div>
              </div>
              <div className="group relative">
                <i className="fas fa-database text-2xl text-green-400 group-hover:scale-125 transition-transform duration-300" title="MongoDB"></i>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">MongoDB</div>
              </div>
              <div className="group relative">
                <i className="fab fa-node-js text-2xl text-green-500 group-hover:scale-125 transition-transform duration-300" title="Node.js"></i>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Node.js</div>
              </div>
            </div>
            
            {/* Resources */}
            <div className="space-y-3 mt-8">
              <a
                href="https://github.com/bergaman9/bergaman-dev/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start space-x-3 text-gray-400 hover:text-[#4ade80] transition-all duration-300"
              >
                <i className="fas fa-balance-scale text-sm group-hover:scale-110 transition-transform duration-300"></i>
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">MIT License</span>
              </a>
              <a
                href={SITE_CONFIG.previousVersions.v1.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start space-x-3 text-gray-400 hover:text-[#e8c547] transition-all duration-300"
                title={SITE_CONFIG.previousVersions.v1.description}
              >
                <i className="fas fa-history text-sm group-hover:scale-110 transition-transform duration-300"></i>
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Portfolio v1.0</span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-[#0a1a0f]/50 to-[#1a2e1a]/50 border border-[#e8c547]/20 rounded-2xl p-6 sm:p-8 mb-12 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <i className="fas fa-dragon text-2xl text-[#e8c547]"></i>
              <h4 className="text-xl font-bold text-[#e8c547]">Join the Dragon's Domain</h4>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get exclusive insights on AI, blockchain, and full-stack development. Weekly updates, no spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/newsletter"
                className="px-6 py-3 bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] rounded-lg font-medium hover:from-[#d4b445] hover:to-[#c4a435] transition-all duration-300 flex items-center space-x-2 group"
              >
                <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform duration-300"></i>
                <span>Subscribe Now</span>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-check text-[#4ade80]"></i>
                  <span>Weekly Updates</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-shield-alt text-[#4ade80]"></i>
                  <span>No Spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3e503e]/30 pt-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <i className="fas fa-copyright"></i>
                <span>{currentYear} {SITE_CONFIG.name}. All rights reserved.</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Crafted with <i className="fas fa-heart text-red-400 mx-1"></i> and <i className="fas fa-dragon text-[#e8c547] mx-1"></i> by Bergaman
              </p>
            </div>

            {/* Version & Back to Top */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 order-1 lg:order-2">
              {/* Version Badge */}
              <div className="flex items-center space-x-2 bg-[#0e1b12]/50 px-4 py-2 rounded-full border border-[#3e503e]/30">
                <i className="fas fa-code-branch text-[#e8c547] text-sm"></i>
                <span className="text-sm text-gray-400">Version {appVersion}</span>
                <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></div>
              </div>

              {/* Back to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center space-x-2 text-gray-400 hover:text-[#e8c547] transition-all duration-300 px-4 py-2 rounded-lg hover:bg-[#e8c547]/10"
              >
                <span className="text-sm">Back to top</span>
                <i className="fas fa-arrow-up group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

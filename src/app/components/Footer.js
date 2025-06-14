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
    <footer className="w-full bg-gradient-to-t from-[#0e1b12] to-[#2e3d29]/20 border-t border-[#3e503e]/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Brand Section */}
          <div className="text-center sm:text-left lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold gradient-text mb-3">
              <i className="fas fa-dragon mr-2"></i>
              Bergaman
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs mx-auto sm:mx-0">
              The Dragon's Domain - Crafting technology inspired by the strength and wisdom of a dragon.
            </p>
            <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-3">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2e3d29]/50 border border-[#3e503e]/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50 hover:bg-[#2e3d29]/80 transition-all duration-300"
                  title={social.label}
                >
                  <i className={`${social.icon} text-xs sm:text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-[#e8c547] mb-3 sm:mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2">
              <Link href="/about" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                About Me
              </Link>
              <Link href="/portfolio" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                Portfolio
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                Blog
              </Link>
              <Link href="/suggestions" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                Suggestions
              </Link>
              <Link href="/newsletter" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                Newsletter
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300 py-1 text-sm sm:text-base">
                Contact
              </Link>
            </div>
          </div>

          {/* Tech & Legal */}
          <div className="text-center sm:text-left lg:text-right lg:col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-[#e8c547] mb-3 sm:mb-4">Tech Stack</h4>
            <div className="flex justify-center sm:justify-start lg:justify-end items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <i className="fab fa-react text-blue-400 text-lg sm:text-xl" title="React"></i>
              <i className="fab fa-js-square text-yellow-400 text-lg sm:text-xl" title="Next.js"></i>
              <i className="fas fa-database text-green-400 text-lg sm:text-xl" title="MongoDB"></i>
              <i className="fab fa-node-js text-green-500 text-lg sm:text-xl" title="Node.js"></i>
            </div>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <a
                href="https://github.com/bergaman9/bergaman-dev/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                <i className="fas fa-balance-scale mr-1"></i>
                MIT License
              </a>
              <a
                href={SITE_CONFIG.previousVersions.v1.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                title={SITE_CONFIG.previousVersions.v1.description}
              >
                <i className="fas fa-history mr-1"></i>
                Portfolio v1.0
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3e503e]/30 pt-4 sm:pt-6">
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-xs sm:text-sm text-center lg:text-left order-2 lg:order-1">
              <i className="fas fa-copyright mr-1"></i>
              {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </div>

            {/* Version */}
            <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500 order-1 lg:order-2">
              <i className="fas fa-code-branch mr-1 text-[#e8c547]"></i>
              <span>Version {appVersion}</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center justify-center space-x-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 group order-3 lg:order-3"
            >
              <span className="text-xs sm:text-sm">Back to top</span>
              <i className="fas fa-arrow-up group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

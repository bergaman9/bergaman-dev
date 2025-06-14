"use client";

import Link from "next/link";
import { SITE_CONFIG, SOCIAL_LINKS } from '../../lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#2e3d29]/30 backdrop-blur-md border-t border-[#3e503e]/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        
        {/* Main Footer Content */}
        <div className="text-center mb-6">
          <p className="text-gray-300 mb-4 max-w-md mx-auto">
            Crafting technology inspired by the strength and wisdom of a dragon.
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            {SOCIAL_LINKS.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#0e1b12]/50 border border-[#3e503e]/50 rounded-lg text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50 transition-all duration-300 hover:scale-110"
                title={social.label}
              >
                <i className={`${social.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3e503e]/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm flex items-center">
              <i className="fas fa-copyright mr-2"></i>
              {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </div>

            {/* Tech Stack */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Built with</span>
              <div className="flex items-center space-x-2">
                <i className="fab fa-react text-blue-400" title="React"></i>
                <span className="text-gray-500">•</span>
                <i className="fab fa-js-square text-yellow-400" title="Next.js"></i>
                <span className="text-gray-500">•</span>
                <i className="fas fa-palette text-purple-400" title="Tailwind CSS"></i>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 group"
            >
              <span className="text-sm">Back to top</span>
              <i className="fas fa-arrow-up group-hover:scale-110 transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

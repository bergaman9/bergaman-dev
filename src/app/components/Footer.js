"use client";

import Link from "next/link";
import { SITE_CONFIG, SOCIAL_LINKS } from '../../lib/constants';
import { getAppVersion } from '../../lib/version';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appVersion = getAppVersion();

  return (
    <footer className="w-full bg-gradient-to-t from-[#0e1b12] to-[#2e3d29]/20 border-t border-[#3e503e]/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold gradient-text mb-3">
              <i className="fas fa-dragon mr-2"></i>
              Bergaman
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The Dragon's Domain - Crafting technology inspired by the strength and wisdom of a dragon.
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#2e3d29]/50 border border-[#3e503e]/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#e8c547] hover:border-[#e8c547]/50 hover:bg-[#2e3d29]/80 transition-all duration-300"
                  title={social.label}
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-[#e8c547] mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                About Me
              </Link>
              <Link href="/portfolio" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                Portfolio
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                Blog
              </Link>
              <Link href="/suggestions" className="block text-gray-400 hover:text-[#e8c547] transition-colors duration-300">
                Suggestions
              </Link>
            </div>
          </div>

          {/* Tech & Legal */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-[#e8c547] mb-4">Tech Stack</h4>
            <div className="flex justify-center md:justify-end items-center space-x-3 mb-4">
              <i className="fab fa-react text-blue-400 text-xl" title="React"></i>
              <i className="fab fa-js-square text-yellow-400 text-xl" title="Next.js"></i>
              <i className="fas fa-database text-green-400 text-xl" title="MongoDB"></i>
              <i className="fab fa-node-js text-green-500 text-xl" title="Node.js"></i>
            </div>
            <div className="space-y-2 text-sm">
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
        <div className="border-t border-[#3e503e]/30 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <i className="fas fa-copyright mr-1"></i>
              {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </div>

            {/* Version */}
            <div className="flex items-center text-sm text-gray-500">
              <i className="fas fa-code-branch mr-1 text-[#e8c547]"></i>
              <span>Version {appVersion}</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#e8c547] transition-colors duration-300 group"
            >
              <span className="text-sm">Back to top</span>
              <i className="fas fa-arrow-up group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

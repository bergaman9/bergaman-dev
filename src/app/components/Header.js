"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { getAppVersion } from '@/lib/version';

// Header component for the application
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [version, setVersion] = useState('');

  // Auto-close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isAdminDropdownOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isAdminDropdownOpen, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setVersion(getAppVersion());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsAdminDropdownOpen(false);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const baseClasses = "transition-colors duration-300 hover:scale-105 transform flex items-center space-x-2";
    const activeClasses = "text-[#e8c547] font-semibold";
    const inactiveClasses = "text-[#d1d5db] hover:text-[#e8c547]";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (path) => {
    const baseClasses = "transition-colors duration-300 flex items-center space-x-2";
    const activeClasses = "text-[#e8c547] font-semibold";
    const inactiveClasses = "text-[#d1d5db] hover:text-[#e8c547]";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  // Navigation links
  const publicNavLinks = [
    { href: '/', icon: 'fas fa-home', label: 'Home' },
    { href: '/about', icon: 'fas fa-user', label: 'About' },
    { href: '/portfolio', icon: 'fas fa-briefcase', label: 'Portfolio' },
    { href: '/blog', icon: 'fas fa-blog', label: 'Blog' },
    { href: '/recommendations', icon: 'fas fa-heart', label: 'Recs' },
    { href: '/contact', icon: 'fas fa-envelope', label: 'Contact' }
  ];

  const adminNavLinks = [];

  return (
    <header className="sticky top-0 z-50 bg-[#0e1b12]/80 backdrop-blur-md border-b border-[#3e503e]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-[#e8c547]"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Bergaman</span>
              <span className="text-xs text-[#e8c547] ml-2">{version}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              {publicNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-[#e8c547] bg-[#e8c547]/10'
                        : 'text-gray-300 hover:bg-[#3e503e]/20 hover:text-[#e8c547]'
                    }`}
                  >
                    <i className={`${link.icon} mr-1`}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname?.startsWith('/admin')
                        ? 'text-[#e8c547] bg-[#e8c547]/10'
                        : 'text-gray-300 hover:bg-[#3e503e]/20 hover:text-[#e8c547]'
                    }`}
                  >
                    <i className="fas fa-lock mr-1"></i>
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#3e503e]/30 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0e1b12]/95 backdrop-blur-md fixed inset-0 z-40 flex flex-col overflow-auto pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'text-[#e8c547] bg-[#e8c547]/10'
                    : 'text-gray-300 hover:bg-[#3e503e]/20 hover:text-[#e8c547]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={`${link.icon} mr-2`}></i>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname?.startsWith('/admin')
                    ? 'text-[#e8c547] bg-[#e8c547]/10'
                    : 'text-gray-300 hover:bg-[#3e503e]/20 hover:text-[#e8c547]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-lock mr-2"></i>
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

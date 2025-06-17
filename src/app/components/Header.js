"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#2e3d29]/30 via-[#2e3d29]/20 to-[#2e3d29]/10 backdrop-blur-md border-b border-[#3e503e]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative z-10 text-2xl font-bold hover:scale-105 transition-transform duration-300 flex items-center space-x-2 group">
            <i className="fas fa-dragon text-[#e8c547] group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm"></i>
            <span className="bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent font-bold">Bergaman</span>
          </Link>

          {/* Right Side - Navigation and Admin */}
          <div className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* Public Navigation Links */}
              {publicNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className={getLinkClasses(link.href)}>
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Admin Section - Only show if authenticated */}
              {isAuthenticated && (
                <>
                  {adminNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={getLinkClasses(link.href)}>
                      <i className={link.icon}></i>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* Admin Status (Desktop) - Only show if authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#e8c547]/20 to-[#d4b445]/20 border border-[#e8c547]/30 hover:border-[#e8c547]/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                      <i className="fas fa-crown text-[#0e1b12] text-xs"></i>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-[#e8c547]">{user?.name || 'Bergaman'}</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isAdminDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Admin Dropdown */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a2e1a]/95 backdrop-blur-md border border-[#3e503e]/30 rounded-lg shadow-xl z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-[#3e503e]/30">
                          <p className="text-sm font-medium text-[#e8c547]">{user?.name || 'Bergaman'}</p>
                          <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                        
                        <Link
                          href="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <i className="fas fa-tachometer-alt"></i>
                          <span>Control Panel</span>
                        </Link>
                        
                        <Link
                          href="/admin/posts"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <i className="fas fa-edit"></i>
                          <span>Manage Posts</span>
                        </Link>
                        
                        <Link
                          href="/admin/portfolio"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <i className="fas fa-briefcase"></i>
                          <span>Portfolio</span>
                        </Link>
                        
                        <Link
                          href="/admin/recommendations"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <i className="fas fa-heart"></i>
                          <span>Recommendations</span>
                        </Link>
                        
                        <Link
                          href="/admin/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 transition-colors duration-300"
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <i className="fas fa-cog"></i>
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-[#3e503e]/30 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-300"
                          >
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-[#3e503e] pt-4">
            <div className="flex flex-col space-y-4">
              {/* Public Links */}
              {publicNavLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={getMobileLinkClasses(link.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Admin Links (if authenticated) */}
              {isAuthenticated && (
                <>
                  {adminNavLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={getMobileLinkClasses(link.href)}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className={link.icon}></i>
                      <span>{link.label}</span>
                    </Link>
                  ))}

                  {/* Admin Section */}
                  <div className="border-t border-[#3e503e] pt-4 mt-4">
                    <div className="flex items-center space-x-3 mb-4 px-2 py-2 bg-gradient-to-r from-[#e8c547]/10 to-[#d4b445]/10 rounded-lg border border-[#e8c547]/20">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                        <i className="fas fa-crown text-[#0e1b12] text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e8c547]">{user?.name || 'Bergaman'}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                      </div>
                    </div>
                    
                    <Link 
                      href="/admin" 
                      className="flex items-center space-x-3 text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 mb-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                      <span>Control Panel</span>
                    </Link>
                    
                    <Link 
                      href="/admin/posts" 
                      className="flex items-center space-x-3 text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 mb-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-edit"></i>
                      <span>Manage Posts</span>
                    </Link>
                    
                    <Link 
                      href="/admin/portfolio" 
                      className="flex items-center space-x-3 text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 mb-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-briefcase"></i>
                      <span>Portfolio</span>
                    </Link>
                    
                    <Link 
                      href="/admin/recommendations" 
                      className="flex items-center space-x-3 text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300 mb-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-heart"></i>
                      <span>Recommendations</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
              
              {/* Mobile Social Links */}
              <div className="flex space-x-6 pt-4 border-t border-[#3e503e]">
                <a
                  href="https://github.com/bergaman9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/omerguler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="mailto:contact@bergaman.dev"
                  className="text-[#d1d5db] hover:text-[#e8c547] transition-colors duration-300"
                  aria-label="Email"
                >
                  <i className="fas fa-envelope text-xl"></i>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

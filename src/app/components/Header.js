"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Button from "./Button";

export default function Header({ showHomeLink = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      const adminUser = localStorage.getItem('adminUser');
      
      if (adminAuth === 'true' && adminUser) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(adminUser));
        } catch {
          setUser({ username: 'Admin' });
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const handleStorageChange = (e) => {
      if (e.key === 'adminAuth' || e.key === 'adminUser') {
        checkAuth();
      }
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminAuthChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminAuthChange', handleAuthChange);
    };
  }, []);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    setIsAdminDropdownOpen(false);
    setIsMenuOpen(false);
    window.dispatchEvent(new CustomEvent('adminAuthChange'));
    window.location.href = '/';
  };

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Navigation links
  const navigationItems = [
    ...(showHomeLink ? [{ href: "/", label: "Home", icon: "fas fa-home" }] : []),
    { href: "/about", label: "About", icon: "fas fa-user" },
    { href: "/portfolio", label: "Portfolio", icon: "fas fa-briefcase" },
    { href: "/recommendations", label: "Recs", icon: "fas fa-heart" },
    { href: "/blog", label: "Blog", icon: "fas fa-blog" },
    { href: "/contact", label: "Contact", icon: "fas fa-envelope" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]/20 backdrop-blur-md border-b border-[#3e503e]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo with Dragon Icon */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-lg animate-pulse"></div>
              <i className="fas fa-dragon text-2xl text-[#e8c547] group-hover:scale-110 transition-transform duration-300 animate-pulse relative z-10 drop-shadow-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent group-hover:from-[#f4d76b] group-hover:to-[#e8c547] transition-all duration-300">
                Bergaman
              </h1>
              <p className="text-xs text-gray-400 -mt-1 hidden sm:block">The Dragon's Domain</p>
            </div>
          </Link>

          {/* Right Side - Navigation and Admin */}
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    isActive(item.href)
                      ? 'text-[#e8c547] bg-[#e8c547]/10 font-semibold'
                      : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Admin Status (Desktop) - Only show if authenticated */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#e8c547]/20 to-[#d4b445]/20 border border-[#e8c547]/30 hover:border-[#e8c547]/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                      <i className="fas fa-crown text-[#0e1b12] text-xs"></i>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-[#e8c547]">{user?.username || 'Admin'}</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isAdminDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Admin Dropdown */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#0e1b12] to-[#1a2e1a] backdrop-blur-md border border-[#3e503e]/30 rounded-lg shadow-xl z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-[#3e503e]/30">
                          <p className="text-sm font-medium text-[#e8c547]">{user?.username || 'Admin'}</p>
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
              className="md:hidden text-[#e8c547] hover:text-[#f4d76b] transition-colors duration-300 p-2 rounded-lg hover:bg-[#e8c547]/10"
              aria-label="Toggle navigation menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            ref={mobileMenuRef} 
            className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#0e1b12] to-[#1a2e1a] backdrop-blur-md border-b border-[#3e503e]/30 shadow-xl"
          >
            <div className="px-4 py-4">
              <div className="flex flex-col space-y-2">
                {/* Public Links */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-[#e8c547] bg-[#e8c547]/10 font-semibold'
                        : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`${item.icon} text-sm`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* Admin Section (if authenticated) */}
                {isAuthenticated && (
                  <div className="border-t border-[#3e503e]/30 pt-4 mt-4">
                    <div className="flex items-center space-x-3 mb-4 px-2 py-2 bg-gradient-to-r from-[#e8c547]/10 to-[#d4b445]/10 rounded-lg border border-[#e8c547]/20">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                        <i className="fas fa-crown text-[#0e1b12] text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e8c547]">{user?.username || 'Admin'}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                      </div>
                    </div>
                    
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                      <span>Control Panel</span>
                    </Link>
                    
                    <Link
                      href="/admin/posts"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-edit"></i>
                      <span>Manage Posts</span>
                    </Link>
                    
                    <Link
                      href="/admin/portfolio"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-briefcase"></i>
                      <span>Portfolio</span>
                    </Link>
                    
                    <Link
                      href="/admin/recommendations"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fas fa-heart"></i>
                      <span>Recommendations</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 mt-2"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                {/* Mobile Social Links */}
                <div className="flex justify-center space-x-6 pt-4 mt-4 border-t border-[#3e503e]/30">
                  <a
                    href="https://github.com/bergaman9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/omerguler/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a
                    href="mailto:contact@bergaman.dev"
                    className="text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
                    aria-label="Email"
                  >
                    <i className="fas fa-envelope text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

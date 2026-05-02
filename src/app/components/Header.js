"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ACTIVE_MINI_APPS, getMiniAppByPathname, getMiniAppTheme } from "@/lib/miniApps";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const activeMiniApp = getMiniAppByPathname(pathname);

  // Check authentication status
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await response.json();
        if (!cancelled && response.ok && data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user || { username: data.username || 'Admin', role: 'admin' });
          return;
        }
      } catch {
        // Treat network/auth failures as logged out in the public header.
      }

      if (!cancelled) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('adminAuthChange', handleAuthChange);

    return () => {
      cancelled = true;
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

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'DELETE',
      credentials: 'include',
    }).catch(() => {});
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
    { href: "/", label: "Home", icon: "fas fa-home" },
    { href: "/about", label: "About", icon: "fas fa-user" },
    { href: "/portfolio", label: "Portfolio", icon: "fas fa-briefcase" },
    { href: "/picks", label: "Picks", icon: "fas fa-heart" },
    { href: "/blog", label: "Blog", icon: "fas fa-blog" },
    { href: "/contact", label: "Contact", icon: "fas fa-envelope" }
  ];

  if (activeMiniApp) {
    const miniTheme = getMiniAppTheme(activeMiniApp);

    return (
      <header className="mini-app-chrome mini-app-header fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-xl" style={miniTheme.cssVars}>
        <div className="mini-app-header-inner page-content">
          <div className="flex items-center justify-between gap-4">
            <Link href="/portfolio" className="group flex min-w-0 items-center gap-3">
              <span className="mini-app-icon-box relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border">
                <i className={`${activeMiniApp.icon} mini-app-accent text-lg`}></i>
              </span>
              <span className="min-w-0">
                <span className="mini-app-muted block text-xs font-semibold uppercase tracking-[0.18em]">Mini App</span>
                <span className="mini-app-accent block truncate text-xl font-bold">{activeMiniApp.title}</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              {ACTIVE_MINI_APPS.map((app) => (
                <Link
                  key={app.id}
                  href={app.href}
                  className={`mini-app-nav-item flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${pathname === app.href ? 'mini-app-nav-item-active' : ''}`}
                >
                  <i className={`${app.icon} text-xs`}></i>
                  <span>{app.shortTitle}</span>
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/portfolio"
                className="mini-app-nav-item hidden rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 sm:inline-flex"
              >
                <i className="fas fa-arrow-left mr-2 text-xs"></i>
                Portfolio
              </Link>
              {isAuthenticated && (
                <Link
                  href="/admin"
                  className="mini-app-nav-item mini-app-nav-item-active hidden rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 lg:inline-flex"
                >
                  <i className="fas fa-crown mr-2 text-xs"></i>
                  Admin
                </Link>
              )}
              <button
                onClick={toggleMenu}
                className="mini-app-accent rounded-lg p-2 transition-colors duration-300 hover:bg-white/10 lg:hidden"
                aria-label="Toggle mini app navigation"
                aria-expanded={isMenuOpen}
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav
              ref={mobileMenuRef}
              className="mini-app-chrome absolute left-0 right-0 top-full border-b px-4 py-4 shadow-xl backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {ACTIVE_MINI_APPS.map((app) => (
                  <Link
                    key={app.id}
                    href={app.href}
                    className={`mini-app-nav-item flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${pathname === app.href ? 'mini-app-nav-item-active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={app.icon}></i>
                    <span className="font-medium">{app.title}</span>
                  </Link>
                ))}
                <Link
                  href="/portfolio"
                  className="mini-app-nav-item mt-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span className="font-medium">Back to Portfolio</span>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a1a0f] via-[#0e1b12] to-[#1a2e1a]/20 backdrop-blur-md border-b border-[#3e503e]/60">
      <div className="page-content py-4">
        <div className="flex items-center justify-between">
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

          {/* Desktop Navigation - Center when authenticated, right when not */}
          <nav className={`hidden lg:flex flex-1 min-w-0 items-center gap-1 pl-4 ${isAuthenticated ? 'justify-center' : 'justify-end'}`}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 xl:px-4 ${isActive(item.href)
                    ? 'text-[#e8c547] bg-[#e8c547]/10 font-semibold'
                    : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
                  }`}
              >
                <i className={`${item.icon} text-sm`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side - Admin and Mobile Menu */}
          <div className="flex shrink-0 items-center space-x-4">
            {/* Admin Status (Desktop) - Only show if authenticated */}
            {isAuthenticated && (
              <div className="hidden lg:block">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#e8c547]/20 to-[#d4b445]/20 border border-[#e8c547]/30 hover:border-[#e8c547]/50 transition-all duration-300"
                    aria-expanded={isAdminDropdownOpen}
                    aria-haspopup="menu"
                    aria-label="Open admin menu"
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
                            aria-label="Logout from admin session"
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
              className="lg:hidden text-[#e8c547] hover:text-[#f4d76b] transition-colors duration-300 p-2 rounded-lg hover:bg-[#e8c547]/10"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            ref={mobileMenuRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#0e1b12] to-[#1a2e1a] backdrop-blur-md border-b border-[#3e503e]/30 shadow-xl"
          >
            <div className="px-4 py-4">
              <div className="flex flex-col space-y-2">
                {/* Public Links */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.href)
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
                      aria-label="Logout from admin session"
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

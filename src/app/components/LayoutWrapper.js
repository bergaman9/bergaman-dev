"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getMiniAppByPathname, getMiniAppTheme } from '@/lib/miniApps';

function LayoutContent({ children }) {
  const pathname = usePathname();
  const activeMiniApp = getMiniAppByPathname(pathname);
  const miniTheme = activeMiniApp ? getMiniAppTheme(activeMiniApp) : null;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Don't render header/footer on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  // Show home link when not on home page
  return (
    <>
      {!isAdminPage && <a href="#main-content" className="skip-link">Skip to main content</a>}
      {!isAdminPage && <Header />}
      {/* Add padding-top to account for fixed header */}
      <main
        id="main-content"
        tabIndex={-1}
        className={!isAdminPage ? (activeMiniApp ? "mini-app-shell pt-[var(--mini-header-height)]" : "pt-[var(--site-header-height)]") : ""}
        style={miniTheme?.cssVars}
      >
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default function LayoutWrapper({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}

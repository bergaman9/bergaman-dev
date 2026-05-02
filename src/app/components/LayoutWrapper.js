"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Head from 'next/head';
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
      {!isAdminPage && <Header />}
      {/* Add padding-top to account for fixed header */}
      <main
        className={!isAdminPage ? (activeMiniApp ? "mini-app-shell pt-[72px]" : "pt-20") : ""}
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

"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import AuthProvider, { useAuth } from './AuthContext';

function LayoutContent({ children }) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Don't render header/footer on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Show home link when not on home page
  const showHomeLink = pathname !== '/';

  return (
    <>
      {!isAdminPage && <Header showHomeLink={showHomeLink} />}
      <main>{children}</main>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
} 
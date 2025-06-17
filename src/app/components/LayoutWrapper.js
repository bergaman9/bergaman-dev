"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { AuthProvider, useAuth } from './AuthContext';

function LayoutContent({ children }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const isAdminRoute = pathname?.startsWith('/admin');

  // For admin routes, hide header/footer for security reasons
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#0e1b12]">
        {children}
      </div>
    );
  }

  // For normal routes, always render with header and footer
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </AuthProvider>
  );
} 
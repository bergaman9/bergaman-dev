"use client";

import { useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import { useRouter, usePathname } from 'next/navigation';
import AuthProvider, { AuthContext } from '../components/AuthContext';
import { useContext } from 'react';
import { SkeletonBox, SkeletonText } from '../components/Skeleton';

// Inner component that uses AuthContext
function AdminLayoutInner({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, loading, logout: authLogout } = useContext(AuthContext);

  // Check if we're on the main admin page
  const isMainAdminPage = pathname === '/admin';

  useEffect(() => {
    if (!loading && !isAuthenticated && !isMainAdminPage) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isMainAdminPage, loading, router]);

  // Logout function
  const handleLogout = async () => {
    try {
      if (authLogout) {
        await authLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1a0f]">
        <div className="w-full max-w-md rounded-lg border border-[#3e503e]/30 bg-[#2e3d29]/20 p-8" aria-busy="true">
          <SkeletonBox className="mx-auto mb-6 h-12 w-12" rounded="rounded-full" />
          <SkeletonText lines={3} />
        </div>
      </div>
    );
  }

  // Show header/footer only if authenticated
  const showHeaderFooter = isAuthenticated;

  // If not authenticated and on admin pages (not login), show nothing
  if (!isAuthenticated && !isMainAdminPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1a0f]">
        <div className="text-center">
          <i className="fas fa-lock text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#0a1a0f]">
      {showHeaderFooter && <AdminHeader activeTab={pathname.split('/')[2] || 'dashboard'} username={user?.username || 'Admin'} onLogout={handleLogout} />}

      <main className="flex-grow">
        {/* For login page, don't wrap content */}
        {isMainAdminPage && !isAuthenticated ? (
          children
        ) : (
          // For other admin pages, use the wrapper
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[#0e1b12]/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#3e503e]/20 overflow-hidden">
              <div className="admin-content-wrapper p-6">
                {children}
              </div>
            </div>
          </div>
        )}
      </main>

      {showHeaderFooter && <AdminFooter />}
    </div>
  );
}

// Main layout component that provides AuthContext
export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
      {/* Global admin styles */}
      <style jsx global>{`
        .admin-content {
          width: 100%;
          max-width: 100%;
        }

        .admin-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .admin-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #f0f0f0;
        }

        .admin-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #e0e0e0;
        }

        .admin-content table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-bottom: 1rem;
        }

        .admin-content th {
          background-color: rgba(30, 50, 30, 0.3);
          color: #e8c547;
          font-weight: 500;
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(62, 80, 62, 0.3);
        }

        .admin-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(62, 80, 62, 0.2);
          color: #d0d0d0;
          font-size: 0.875rem;
        }

        .admin-content tbody tr:hover {
          background-color: rgba(30, 50, 30, 0.2);
        }

        .admin-content tbody tr:last-child td {
          border-bottom: none;
        }

        .admin-content .table-container {
          overflow-x: auto;
          border-radius: 0.5rem;
          border: 1px solid rgba(62, 80, 62, 0.3);
          background-color: rgba(10, 26, 15, 0.3);
          margin-bottom: 1.5rem;
        }
      `}</style>
    </AuthProvider>
  );
}

"use client";

import { useState, useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import { useRouter, usePathname } from 'next/navigation';
import AuthProvider from '../components/AuthContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  
  // Check if we're on the main admin page
  const isMainAdminPage = pathname === '/admin';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Cookie'leri dahil et
        });
        
        const data = await res.json();
        
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          setUsername(data.username);
          // Store auth status in localStorage for header
          localStorage.setItem('adminAuth', 'true');
          localStorage.setItem('adminUser', JSON.stringify({ username: data.username }));
          window.dispatchEvent(new CustomEvent('adminAuthChange'));
        } else {
          // Eğer ana admin sayfasında değilsek ve kimlik doğrulama başarısızsa, ana admin sayfasına yönlendir
          if (!isMainAdminPage) {
            router.push('/admin');
          }
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Hata durumunda ana admin sayfasına yönlendir
        if (!isMainAdminPage) {
          router.push('/admin');
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isMainAdminPage]);

  // Logout fonksiyonu
  const handleLogout = async () => {
    try {
      // Cookie'yi temizle
      document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear localStorage
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      window.dispatchEvent(new CustomEvent('adminAuthChange'));
      
      // Kimlik doğrulama durumunu güncelle
      setIsAuthenticated(false);
      
      // Ana admin sayfasına yönlendir
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1a0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8c547]"></div>
      </div>
    );
  }

  // Only show header/footer if authenticated
  // On main admin page, don't show header/footer if not authenticated (login screen)
  const showHeaderFooter = isAuthenticated;

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] to-[#0a1a0f]">
        {showHeaderFooter && <AdminHeader activeTab={pathname.split('/')[2] || 'dashboard'} username={username} onLogout={handleLogout} />}
      
      <main className="flex-grow">
        {(isAuthenticated || isMainAdminPage) ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-[#0e1b12]/80 backdrop-blur-sm rounded-xl shadow-xl border border-[#3e503e]/20 overflow-hidden">
              <div className="admin-content-wrapper p-6">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4">
            {children}
          </div>
        )}
      </main>
      
      {showHeaderFooter && <AdminFooter />}
      </div>
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
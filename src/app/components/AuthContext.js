"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SECURITY } from '@/lib/constants';
import { useRouter } from 'next/navigation';

// Auth Context
export const AuthContext = createContext();

// Auth Provider
export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(null);
  const router = useRouter();

  // Admin etkinliklerini logla - moved up before being used
  const logActivity = async (action, description, metadata = {}) => {
    try {
      const res = await fetch('/api/admin/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          action,
          description,
          metadata
        }),
        credentials: 'include'
      });
      
      return res.ok;
    } catch (error) {
      console.error('Log activity error:', error);
      return false;
    }
  };
  
  // Giriş işlemi - now logActivity is defined before this uses it
  const login = async (username, password) => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setUser(data.user || { username, role: 'admin' });
        
        // Admin etkinliğini logla
        await logActivity('login', `User ${username} logged in successfully`);
        
        return { success: true };
      } else {
        // Başarısız giriş denemesini logla
        await logActivity('failed_login', `Failed login attempt for user ${username}`, { ip: data.ip || 'unknown' });
        
        return { 
          success: false, 
          error: data.message || 'Giriş başarısız', 
          remainingAttempts: data.remainingAttempts 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  // Session kontrolü
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user || { username: data.username || 'Admin', role: data.role || 'admin' });
        
        // CSRF token oluştur
        const newCsrfToken = `${data.username}-${Date.now()}`;
        setCsrfToken(newCsrfToken);
        
        // Session süresini hesapla (JWT'nin exp değerinden)
        const tokenParts = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${SECURITY.SESSION.COOKIE_NAME}=`))
          ?.split('=')[1];
          
        if (tokenParts) {
          try {
            // JWT'nin payload kısmını decode et (imza kontrolü yapmadan)
            const payload = JSON.parse(atob(tokenParts.split('.')[1]));
            const expiryTime = payload.exp * 1000; // saniyeden milisaniyeye çevir
            setSessionExpiry(expiryTime);
            
            // Session yenileme zamanlayıcısını ayarla
            // Session'ın son 5 dakikasında yenile
            const timeUntilRefresh = Math.max(0, expiryTime - Date.now() - SECURITY.SESSION.REFRESH_BEFORE);
            
            if (refreshTimer) clearTimeout(refreshTimer);
            
            const timer = setTimeout(() => {
              refreshSession();
            }, timeUntilRefresh);
            
            setRefreshTimer(timer);
          } catch (e) {
            console.error('JWT decode error:', e);
          }
        }
        
        // Admin etkinliğini logla
        await logActivity('login', `User ${data.username} logged in successfully`);
        
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCsrfToken(null);
        router.push('/admin'); // Çıkış yapınca login sayfasına yönlendir
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setCsrfToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshTimer, router]);

  // Session yenileme
  const refreshSession = useCallback(async () => {
    try {
      // Mevcut session'ı kontrol et
      const authStatus = await checkAuth();
      
      // Eğer oturum hala açıksa, yeni bir login isteği gönder
      if (authStatus && user) {
        // Kullanıcı bilgileri ile yeni bir oturum aç
        // Bu, yeni bir JWT token oluşturacak
        await login(user.username, ''); // Şifre olmadan özel bir yenileme endpoint'i kullanılabilir
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, [checkAuth, user, login]);

  // Çıkış işlemi
  const logout = async () => {
    try {
      // Önce çıkış işlemini logla
      if (isAuthenticated && user) {
        await logActivity('logout', `User ${user.username} logged out`);
      }
      
      const res = await fetch('/api/admin/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (res.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setCsrfToken(null);
        setSessionExpiry(null);
        router.push('/admin'); // Çıkış yapınca login sayfasına yönlendir
        return true;
      } else {
        console.error('Logout failed');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // API istekleri için güvenli fetch wrapper
  const secureFetch = async (url, options = {}) => {
    // Varsayılan ayarlar
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    
    // CSRF token ekle (sadece mutasyon işlemleri için)
    const method = options.method || 'GET';
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase()) && csrfToken) {
      defaultOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Ayarları birleştir
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    };
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // 401 hatası durumunda oturumu kontrol et
      if (response.status === 401) {
        await checkAuth();
        
        // Eğer hala oturum açıksa, isteği tekrar dene
        if (isAuthenticated) {
          return fetch(url, {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
              'X-CSRF-Token': csrfToken // Güncel CSRF token
            }
          });
        }
      }
      
      return response;
    } catch (error) {
      console.error('Secure fetch error:', error);
      throw error;
    }
  };

  // Sayfa yüklendiğinde auth durumunu kontrol et
  useEffect(() => {
    checkAuth();
    
    // Component unmount olduğunda zamanlayıcıyı temizle
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [checkAuth, refreshTimer]);

  // Kullanıcı bilgilerini güncelle
  const updateUser = async (userData) => {
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(prev => ({ ...prev, ...userData }));
        
        // Profil güncelleme işlemini logla
        await logActivity('profile_update', `User ${user.username} updated their profile`);
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Güncelleme başarısız' };
      }
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  // Şifre değiştir
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Şifre değiştirme işlemini logla
        await logActivity('password_change', `User ${user.username} changed their password`);
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Şifre değiştirme başarısız' };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Bir hata oluştu' };
    }
  };

  // Auth context değerleri
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
    secureFetch,
    csrfToken,
    sessionExpiry,
    updateUser,
    changePassword,
    logActivity
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
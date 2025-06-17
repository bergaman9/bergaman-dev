"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SECURITY } from '@/lib/constants';

// Auth Context
export const AuthContext = createContext();

// Auth Provider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [refreshTimer, setRefreshTimer] = useState(null);

  // Session kontrolü
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser({
            username: data.username,
            role: data.role
          });
          
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
          
          return true;
        }
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setCsrfToken(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setCsrfToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshTimer]);

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
  }, [checkAuth, user]);

  // Giriş işlemi
  const login = async (username, password) => {
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        // Giriş başarılı, auth durumunu güncelle
        await checkAuth();
        return { success: true };
      } else {
        // Giriş başarısız
        setLoading(false);
        return { 
          success: false, 
          error: data.error,
          remainingAttempts: data.remainingAttempts
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Çıkış işlemi
  const logout = async () => {
    setLoading(true);
    
    try {
      // Sunucudan çıkış yap
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include'
      });
      
      // Zamanlayıcıyı temizle
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      
      // Yerel durumu temizle
      setIsAuthenticated(false);
      setUser(null);
      setCsrfToken(null);
      setSessionExpiry(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
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
    sessionExpiry
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
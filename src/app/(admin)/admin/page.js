"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../components/AuthContext';
import PageHeader from '../../components/PageHeader';
import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
import Alert from '../../components/Alert';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [loginTimeout, setLoginTimeout] = useState(null);
  
  const router = useRouter();
  const { isAuthenticated, loading, login, checkAuth } = useContext(AuthContext);

  // Admin zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/admin/profile');
    }
  }, [isAuthenticated, loading, router]);

  // Form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginDisabled) {
      return;
    }
    
    // Form doğrulama
    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }

    try {
      setIsLoggingIn(true);
      setError('');
      
      // Giriş işlemini başlat
      const result = await login(username, password);
      
      if (result.success) {
        // Başarılı giriş
        setError('');
        setUsername('');
        setPassword('');
        
        // Auth durumunu kontrol et ve yönlendir
        const authCheck = await checkAuth();
        if (authCheck) {
          router.push('/admin/profile');
        }
      } else {
        // Başarısız giriş
        setError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        
        // Kalan deneme sayısını göster
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
          
          // Son deneme hakkı kaldıysa uyarı ver
          if (result.remainingAttempts === 1) {
            setError('Dikkat! Son giriş hakkınız. Başarısız olursa hesabınız 15 dakika kilitlenecek.');
          }
          
          // Hesap kilitlenmişse giriş butonunu devre dışı bırak
          if (result.remainingAttempts === 0) {
            setLoginDisabled(true);
            
            // 15 dakika sonra tekrar etkinleştir
            const timer = setTimeout(() => {
              setLoginDisabled(false);
              setRemainingAttempts(null);
              setError('');
            }, 15 * 60 * 1000); // 15 dakika
            
            setLoginTimeout(timer);
          }
        }
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Component unmount olduğunda zamanlayıcıyı temizle
  useEffect(() => {
    return () => {
      if (loginTimeout) {
        clearTimeout(loginTimeout);
      }
    };
  }, [loginTimeout]);

  // Şifreyi göster/gizle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e1e12]">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1e12] p-4">
      <div className="bg-[#132218] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#243e2b]/30">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/images/bergaman-logo.png" alt="Bergaman Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-[#e8c547]">Bergaman Portal</h1>
          <p className="text-gray-400 mt-2">Admin Dashboard</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSRF Koruması - Form içinde gizli bir input olarak */}
          <input type="hidden" name="csrf_protection" value="1" />
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-[#1a2e20] border border-[#243e2b] text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547]"
                placeholder="Enter your username"
                disabled={isLoggingIn || loginDisabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded bg-[#1a2e20] border border-[#243e2b] text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547]"
                placeholder="Enter your password"
                disabled={isLoggingIn || loginDisabled}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="text-amber-400 text-sm">
              Kalan giriş hakkı: {remainingAttempts}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8c547] 
                ${loginDisabled 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : isLoggingIn 
                    ? 'bg-[#e8c547]/80 text-gray-900 cursor-wait' 
                    : 'bg-[#e8c547] hover:bg-[#d4b43e] text-gray-900'}`}
              disabled={isLoggingIn || loginDisabled}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Giriş yapılıyor...</span>
                </div>
              ) : loginDisabled ? 'Hesap kilitlendi' : 'Login'}
            </button>
          </div>
        </form>

        {loginDisabled && (
          <div className="mt-4 text-center text-red-400 text-sm">
            Çok fazla başarısız giriş denemesi. Hesabınız 15 dakika kilitlendi.
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Güvenli bir bağlantı üzerinden giriş yapıyorsunuz</p>
          <p className="mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            SSL korumalı
          </p>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 Bergaman Portal
        </div>
      </div>
    </div>
  );
} 
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
    
      // Form validation
  if (!username || !password) {
    setError('Please enter username and password.');
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
        // Failed login
        setError(result.error || 'Login failed. Please check your credentials.');
        
        // Show remaining attempts
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
          
          // Warn if last attempt
          if (result.remainingAttempts === 1) {
            setError('Warning! Last login attempt. If failed, your account will be locked for 15 minutes.');
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
      setError('An error occurred. Please try again later.');
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
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1e12] via-[#132218] to-[#0e1e12] p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c547' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Animated Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e8c547]/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#132218]/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#243e2b]/50">
                  {/* Logo and Title Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#e8c547]/30 rounded-full blur-lg animate-pulse"></div>
                <i className="fas fa-dragon text-4xl text-[#e8c547] relative z-10 drop-shadow-lg"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
                  Bergaman
                </h1>
                <p className="text-sm text-gray-400 -mt-1">Admin Dashboard</p>
              </div>
            </div>
          </div>

        {error && error.trim() !== '' && <Alert type="error" message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSRF Koruması - Form içinde gizli bir input olarak */}
          <input type="hidden" name="csrf_protection" value="1" />
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400 group-focus-within:text-[#e8c547] transition-colors duration-300"></i>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a2e20]/80 backdrop-blur-sm border border-[#243e2b]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547] transition-all duration-300"
                placeholder="Enter your username"
                disabled={isLoggingIn || loginDisabled}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400 group-focus-within:text-[#e8c547] transition-colors duration-300"></i>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#1a2e20]/80 backdrop-blur-sm border border-[#243e2b]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e8c547]/50 focus:border-[#e8c547] transition-all duration-300"
                placeholder="Enter your password"
                disabled={isLoggingIn || loginDisabled}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#e8c547] transition-colors duration-300"
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </div>

          {remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="text-amber-400 text-sm">
              Remaining attempts: {remainingAttempts}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8c547] transition-all duration-300 transform hover:scale-[1.02]
                ${loginDisabled 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : isLoggingIn 
                    ? 'bg-[#e8c547]/80 text-gray-900 cursor-wait' 
                    : 'bg-gradient-to-r from-[#e8c547] to-[#f4d76b] hover:from-[#d4b43e] hover:to-[#e8c547] text-gray-900 shadow-lg hover:shadow-[#e8c547]/30'}`}
              disabled={isLoggingIn || loginDisabled}
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : loginDisabled ? 'Account locked' : 'Login'}
            </button>
          </div>
        </form>

        {loginDisabled && (
          <div className="mt-4 text-center text-red-400 text-sm">
            Too many failed login attempts. Your account is locked for 15 minutes.
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-[#1a2e20]/50 px-4 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Secure SSL Connection</span>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Bergaman • The Dragon's Domain
          </p>
        </div>
      </div>
      </div>
    </div>
  );
} 
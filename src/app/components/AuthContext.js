"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authStatus = localStorage.getItem('adminAuthenticated');
      const userData = localStorage.getItem('adminUserData');
      
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Set default user data if not found
          const defaultUser = {
            username: 'bergaman',
            role: 'Administrator',
            name: 'Bergaman'
          };
          setUser(defaultUser);
          localStorage.setItem('adminUserData', JSON.stringify(defaultUser));
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = {
          username: username,
          role: 'Administrator',
          name: 'Bergaman'
        };
        
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminUserData', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUserData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
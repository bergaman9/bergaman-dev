import { useState, useEffect } from 'react';

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      // Check if admin is authenticated
      const adminAuth = localStorage.getItem('adminAuth');
      const editMode = localStorage.getItem('adminEditMode');
      
      const authStatus = adminAuth === 'true';
      const editStatus = editMode === 'true' && authStatus;
      
      setIsAuthenticated(authStatus);
      setIsAdminMode(editStatus);
    };

    // Initial check
    checkAdminStatus();

    // Listen for storage changes (when admin panel sets edit mode)
    const handleStorageChange = (e) => {
      if (e.key === 'adminEditMode' || e.key === 'adminAuth') {
        checkAdminStatus();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleAdminModeChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminModeChange', handleAdminModeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminModeChange', handleAdminModeChange);
    };
  }, []);

  const toggleEditMode = () => {
    if (isAuthenticated) {
      const newMode = !isAdminMode;
      setIsAdminMode(newMode);
      localStorage.setItem('adminEditMode', newMode.toString());
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('adminModeChange'));
    }
  };

  const exitEditMode = () => {
    setIsAdminMode(false);
    localStorage.removeItem('adminEditMode');
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('adminModeChange'));
  };

  return {
    isAdminMode,
    isAuthenticated,
    toggleEditMode,
    exitEditMode
  };
} 
import { useState, useEffect } from 'react';

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAdminStatus = async () => {
      let authStatus = false;

      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await response.json();
        authStatus = response.ok && data.authenticated;
      } catch {
        authStatus = false;
      }

      if (cancelled) return;

      const editMode = sessionStorage.getItem('adminEditMode');
      setIsAuthenticated(authStatus);
      setIsAdminMode(editMode === 'true' && authStatus);
    };

    // Initial check
    checkAdminStatus();

    // Listen for storage changes (when admin panel sets edit mode)
    const handleStorageChange = (e) => {
      if (e.key === 'adminEditMode') {
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
      cancelled = true;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminModeChange', handleAdminModeChange);
    };
  }, []);

  const toggleEditMode = () => {
    if (isAuthenticated) {
      const newMode = !isAdminMode;
      setIsAdminMode(newMode);
      sessionStorage.setItem('adminEditMode', newMode.toString());

      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('adminModeChange'));
    }
  };

  const exitEditMode = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem('adminEditMode');

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

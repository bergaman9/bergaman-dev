import { useState, useEffect } from 'react';

export function useAdminMode() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    const editMode = localStorage.getItem('adminEditMode');
    
    setIsAuthenticated(adminAuth === 'true');
    setIsAdminMode(editMode === 'true' && adminAuth === 'true');
  }, []);

  const toggleEditMode = () => {
    if (isAuthenticated) {
      const newMode = !isAdminMode;
      setIsAdminMode(newMode);
      localStorage.setItem('adminEditMode', newMode.toString());
    }
  };

  const exitEditMode = () => {
    setIsAdminMode(false);
    localStorage.removeItem('adminEditMode');
  };

  return {
    isAdminMode,
    isAuthenticated,
    toggleEditMode,
    exitEditMode
  };
} 
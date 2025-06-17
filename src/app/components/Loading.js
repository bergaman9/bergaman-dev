"use client";

import { useState, useEffect } from 'react';

export default function Loading({
  size = "md",
  variant = "default",
  fullScreen = false,
  text = "Loading...",
  showText = true,
  className = "",
  delay = 300,
  overlay = false,
  overlayColor = "dark",
  children,
  isLoading = true
}) {
  const [showLoader, setShowLoader] = useState(false);
  
  useEffect(() => {
    // Only show loader after a delay to prevent flashing for quick loads
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, delay]);
  
  // If not loading or delay hasn't passed, render children or nothing
  if (!isLoading) return children || null;
  if (!showLoader) return children || null;
  
  // Size classes
  const sizeClasses = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
    "2xl": "h-20 w-20 border-4"
  };
  
  // Variant classes
  const variantClasses = {
    default: "border-t-[#e8c547] border-r-[#e8c547]/40 border-b-[#e8c547]/20 border-l-[#e8c547]/10",
    primary: "border-t-[#e8c547] border-r-[#e8c547]/40 border-b-[#e8c547]/20 border-l-[#e8c547]/10",
    secondary: "border-t-white border-r-white/40 border-b-white/20 border-l-white/10",
    success: "border-t-green-500 border-r-green-500/40 border-b-green-500/20 border-l-green-500/10",
    danger: "border-t-red-500 border-r-red-500/40 border-b-red-500/20 border-l-red-500/10",
    warning: "border-t-yellow-500 border-r-yellow-500/40 border-b-yellow-500/20 border-l-yellow-500/10",
    info: "border-t-blue-500 border-r-blue-500/40 border-b-blue-500/20 border-l-blue-500/10",
    light: "border-t-gray-200 border-r-gray-200/40 border-b-gray-200/20 border-l-gray-200/10",
    dark: "border-t-gray-700 border-r-gray-700/40 border-b-gray-700/20 border-l-gray-700/10",
    white: "border-t-white border-r-white/40 border-b-white/20 border-l-white/10"
  };
  
  // Text size classes based on spinner size
  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl"
  };
  
  // Overlay color classes
  const overlayColorClasses = {
    dark: "bg-black/70",
    light: "bg-white/70",
    primary: "bg-[#0e1b12]/80",
    transparent: "bg-transparent"
  };
  
  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e1b12]/80 backdrop-blur-sm">
        <div className={`rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}></div>
        {showText && <p className={`mt-4 font-medium text-white ${textSizeClasses[size]}`}>{text}</p>}
      </div>
    );
  }
  
  // Overlay loader (container relative, loader absolute)
  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center ${overlayColorClasses[overlayColor]} backdrop-blur-sm rounded-lg`}>
          <div className={`rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}></div>
          {showText && <p className={`mt-2 font-medium text-white ${textSizeClasses[size]}`}>{text}</p>}
        </div>
      </div>
    );
  }
  
  // Inline loader
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}></div>
      {showText && <p className={`mt-2 font-medium text-gray-300 ${textSizeClasses[size]}`}>{text}</p>}
    </div>
  );
} 
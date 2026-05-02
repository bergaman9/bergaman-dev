"use client";

import { useState, useEffect } from 'react';
import { SkeletonBox, SkeletonText } from './Skeleton';

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

  // Overlay color classes
  const overlayColorClasses = {
    dark: "bg-black/70",
    light: "bg-white/70",
    primary: "bg-[#0e1b12]/80",
    transparent: "bg-transparent"
  };

  const sizeClasses = {
    xs: "h-12 w-32",
    sm: "h-16 w-40",
    md: "h-24 w-56",
    lg: "h-32 w-72",
    xl: "h-40 w-80",
    "2xl": "h-48 w-96"
  };

  const skeleton = (
    <div className={`w-full max-w-md ${className}`} aria-label={text} data-loading-variant={variant}>
      <SkeletonBox className={`${sizeClasses[size] || sizeClasses.md} mx-auto`} />
      {showText && <SkeletonText lines={2} className="mt-4" widths={["w-2/3 mx-auto", "w-1/2 mx-auto"]} />}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0e1b12]/80 backdrop-blur-sm">
        {skeleton}
      </div>
    );
  }

  // Overlay loader (container relative, loader absolute)
  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center ${overlayColorClasses[overlayColor]} backdrop-blur-sm rounded-lg`}>
          {skeleton}
        </div>
      </div>
    );
  }

  // Inline loader
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {skeleton}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from 'react';

export default function Tooltip({
  children,
  content,
  position = 'top',
  variant = 'default',
  delay = 300,
  offset = 8,
  className = '',
  maxWidth = '200px',
  disabled = false,
  showArrow = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  // Clean up timeout on unmount - must be before any early returns
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content || disabled) {
    return children;
  }

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Tooltip variant styles
  const variantStyles = {
    default: "bg-[#2e3d29]/95 text-white border border-[#3e503e]/50",
    dark: "bg-[#0e1b12]/95 text-white border border-[#3e503e]/50",
    light: "bg-white/95 text-gray-900 border border-gray-200 shadow-lg",
    primary: "bg-[#e8c547]/95 text-[#0e1b12] border border-[#e8c547]",
    success: "bg-green-600/95 text-white border border-green-500",
    danger: "bg-red-600/95 text-white border border-red-500",
    warning: "bg-yellow-600/95 text-white border border-yellow-500",
    info: "bg-blue-600/95 text-white border border-blue-500",
    glass: "bg-black/80 backdrop-blur-md text-white border border-white/20"
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  // Arrow styles
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
  };

  // Arrow colors based on variant
  const arrowColors = {
    default: 'border-[#2e3d29]',
    dark: 'border-[#0e1b12]',
    light: 'border-white',
    primary: 'border-[#e8c547]',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600',
    info: 'border-blue-600',
    glass: 'border-black'
  };

  // Arrow with border - create double arrow effect
  const renderArrow = () => {
    const borderColors = {
      default: '#3e503e',
      dark: '#3e503e',
      light: '#d1d5db',
      primary: '#e8c547',
      success: '#22c55e',
      danger: '#ef4444',
      warning: '#eab308',
      info: '#3b82f6',
      glass: '#ffffff'
    };

    const fillColors = {
      default: '#2e3d29',
      dark: '#0e1b12',
      light: '#ffffff',
      primary: '#e8c547',
      success: '#16a34a',
      danger: '#dc2626',
      warning: '#ca8a04',
      info: '#2563eb',
      glass: '#000000'
    };

    if (position === 'top') {
      return (
        <>
          {/* Border arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-current"
               style={{ borderTopColor: borderColors[variant] }}>
          </div>
          {/* Fill arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-1px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-current"
               style={{ borderTopColor: fillColors[variant] }}>
          </div>
        </>
      );
    } else if (position === 'bottom') {
      return (
        <>
          {/* Border arrow */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-current"
               style={{ borderBottomColor: borderColors[variant] }}>
          </div>
          {/* Fill arrow */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[1px] w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-current"
               style={{ borderBottomColor: fillColors[variant] }}>
          </div>
        </>
      );
    } else if (position === 'left') {
      return (
        <>
          {/* Border arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[5px] border-t-transparent border-b-transparent border-l-current"
               style={{ borderLeftColor: borderColors[variant] }}>
          </div>
          {/* Fill arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 translate-x-[-1px] w-0 h-0 border-t-[4px] border-b-[4px] border-l-[4px] border-t-transparent border-b-transparent border-l-current"
               style={{ borderLeftColor: fillColors[variant] }}>
          </div>
        </>
      );
    } else if (position === 'right') {
      return (
        <>
          {/* Border arrow */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent border-r-current"
               style={{ borderRightColor: borderColors[variant] }}>
          </div>
          {/* Fill arrow */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 translate-x-[1px] w-0 h-0 border-t-[4px] border-b-[4px] border-r-[4px] border-t-transparent border-b-transparent border-r-current"
               style={{ borderRightColor: fillColors[variant] }}>
          </div>
        </>
      );
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm rounded-lg backdrop-blur-md whitespace-nowrap
            ${variantStyles[variant]}
            ${positionClasses[position]}
            ${isVisible ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-200
            ${className}
          `}
          style={{
            maxWidth: maxWidth,
            pointerEvents: 'none'
          }}
        >
          {content}
          
          {showArrow && renderArrow()}
        </div>
      )}
    </div>
  );
} 
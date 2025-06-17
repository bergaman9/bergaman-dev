"use client";

import { useState, useRef, useEffect } from 'react';

export default function Tooltip({
  children,
  content,
  position = 'top',
  variant = 'default',
  delay = 300,
  arrow = true,
  maxWidth = 250,
  className = '',
  childrenClassName = '',
  disabled = false,
  interactive = false,
  trigger = 'hover',
  showOnClick = false,
  hideOnClick = true,
  hideOnEsc = true,
  offset = 8
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const childrenRef = useRef(null);
  const timerRef = useRef(null);
  
  // Handle position calculation
  const calculatePosition = () => {
    if (!childrenRef.current || !tooltipRef.current) return;
    
    const childRect = childrenRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    let top, left;
    
    switch (position) {
      case 'top':
        top = childRect.top + scrollY - tooltipRect.height - offset;
        left = childRect.left + scrollX + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = childRect.bottom + scrollY + offset;
        left = childRect.left + scrollX + (childRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = childRect.top + scrollY + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.left + scrollX - tooltipRect.width - offset;
        break;
      case 'right':
        top = childRect.top + scrollY + (childRect.height / 2) - (tooltipRect.height / 2);
        left = childRect.right + scrollX + offset;
        break;
      default:
        top = childRect.top + scrollY - tooltipRect.height - offset;
        left = childRect.left + scrollX + (childRect.width / 2) - (tooltipRect.width / 2);
    }
    
    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight + scrollY - 10) {
      top = childRect.top + scrollY - tooltipRect.height - offset;
    }
    
    setTooltipPosition({ top, left });
  };
  
  // Show tooltip
  const showTooltip = () => {
    if (disabled) return;
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Position is calculated after tooltip is rendered
      setTimeout(calculatePosition, 0);
    }, delay);
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };
  
  // Handle click events
  const handleClick = (e) => {
    if (disabled) return;
    
    if (showOnClick && !isVisible) {
      showTooltip();
    } else if (hideOnClick && isVisible) {
      hideTooltip();
    }
    
    // If interactive, prevent clicks on tooltip from closing it
    if (interactive && tooltipRef.current?.contains(e.target)) {
      e.stopPropagation();
    }
  };
  
  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (hideOnEsc && e.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };
    
    if (isVisible && hideOnEsc) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible, hideOnEsc]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  // Tooltip variant styles
  const variantClasses = {
    default: 'bg-[#1a2e1a]/95 text-white border border-[#3e503e]/50',
    dark: 'bg-[#0e1b12]/95 text-white border border-[#3e503e]/50',
    light: 'bg-white/95 text-gray-800 border border-gray-200',
    primary: 'bg-[#e8c547]/10 text-[#e8c547] border border-[#e8c547]/30',
    success: 'bg-green-900/90 text-green-100 border border-green-600/30',
    danger: 'bg-red-900/90 text-red-100 border border-red-600/30',
    warning: 'bg-yellow-900/90 text-yellow-100 border border-yellow-600/30',
    info: 'bg-blue-900/90 text-blue-100 border border-blue-600/30',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
  };
  
  // Arrow position classes
  const arrowPositionClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-current border-x-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-current border-x-transparent border-t-transparent',
    left: 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-current border-y-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-current border-y-transparent border-l-transparent'
  };
  
  return (
    <div
      className={`inline-block ${childrenClassName}`}
      ref={childrenRef}
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={handleClick}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 py-2 px-3 rounded-lg shadow-lg text-sm ${variantClasses[variant]} ${className}`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth: maxWidth ? `${maxWidth}px` : 'none'
          }}
          onMouseEnter={interactive && trigger === 'hover' ? showTooltip : undefined}
          onMouseLeave={interactive && trigger === 'hover' ? hideTooltip : undefined}
          onClick={e => interactive ? e.stopPropagation() : null}
        >
          {content}
          
          {arrow && (
            <div
              className={`absolute w-0 h-0 border-solid border-4 ${arrowPositionClasses[position]} text-${variant === 'default' ? '[#1a2e1a]/95' : variant}`}
            />
          )}
        </div>
      )}
    </div>
  );
} 
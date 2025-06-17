"use client";

import { useEffect, useRef, useState } from 'react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = "",
  size = "md",
  variant = "default",
  position = "center",
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  preventScroll = true,
  footer = null,
  footerAlign = "end",
  header = null,
  hideHeader = false,
  hideFooter = false,
  animation = "fade",
  fullScreen = false,
  scrollable = true,
  backdropOpacity = 80,
  zIndex = 999,
  onBackdropClick,
  rounded = "lg",
  loading = false,
  icon = null,
  iconColor = "primary",
  titleAlign = "left"
}) {
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Save scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const currentScroll = window.scrollY;
      setScrollPosition(currentScroll);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      // Header'ı gizlemek yerine arka planda göster
      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.style.zIndex = '10'; // Modal'dan daha düşük bir z-index değeri ver
      }

      // Don't prevent scrolling entirely, just lock the body in place
      if (preventScroll) {
        // Save the current scroll position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScroll}px`;
        document.body.style.width = '100%';
      }

      return () => clearTimeout(timer);
    } else {
      // Header'ın z-index değerini geri al
      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.style.zIndex = ''; // Varsayılan değere döndür
      }

      // Restore scroll position when modal closes
      if (preventScroll) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [isOpen, preventScroll, scrollPosition]);
  
  // Ensure modal is visible in viewport when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Give the modal time to render before checking position
      const timer = setTimeout(() => {
        const modalRect = modalRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If modal is outside viewport or partially outside, center it
        if (modalRect.top < 0 || modalRect.bottom > viewportHeight) {
          modalRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen && closeOnEsc) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle outside click
  const handleBackdropClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      if (onBackdropClick) {
        onBackdropClick(e);
      } else {
        onClose();
      }
    }
  };
  
  if (!isOpen) return null;
  
  // Size classes
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    "3xl": "max-w-7xl",
    full: "max-w-full mx-4"
  };
  
  // Variant classes
  const variantClasses = {
    default: "bg-[#2e3d29]/90 backdrop-blur-md border border-[#3e503e]/50 text-white",
    dark: "bg-[#0e1b12]/95 backdrop-blur-md border border-[#3e503e]/50 text-white",
    light: "bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
    primary: "bg-[#e8c547]/10 backdrop-blur-md border border-[#e8c547]/30 text-white",
    success: "bg-green-900/20 backdrop-blur-md border border-green-600/30 text-white",
    danger: "bg-red-900/20 backdrop-blur-md border border-red-600/30 text-white",
    warning: "bg-yellow-900/20 backdrop-blur-md border border-yellow-600/30 text-white",
    info: "bg-blue-900/20 backdrop-blur-md border border-blue-600/30 text-white",
    transparent: "bg-transparent",
    modern: "bg-gradient-to-br from-[#2e3d29]/80 to-[#1a2e1a]/90 backdrop-blur-md border border-white/10 text-white shadow-xl",
    elegant: "bg-[#0e1b12]/85 backdrop-blur-lg border-l-4 border-[#e8c547] border-t border-r border-b border-[#3e503e]/30 text-white",
    minimal: "bg-[#2e3d29]/70 backdrop-blur-lg text-white shadow-lg",
    frosted: "bg-white/15 backdrop-blur-xl border border-white/20 text-white shadow-lg",
    glow: "bg-[#2e3d29]/70 backdrop-blur-md border border-[#e8c547]/20 text-white shadow-[0_0_15px_rgba(232,197,71,0.3)]"
  };
  
  // Position classes
  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-10",
    bottom: "items-end justify-center pb-10",
    left: "items-center justify-start pl-10",
    right: "items-center justify-end pr-10",
    "top-left": "items-start justify-start pt-10 pl-10",
    "top-right": "items-start justify-end pt-10 pr-10",
    "bottom-left": "items-end justify-start pb-10 pl-10",
    "bottom-right": "items-end justify-end pb-10 pr-10"
  };
  
  // Use the actual position from props
  const actualPosition = position;
  
  // Animation classes
  const animationClasses = {
    fade: isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100",
    slide: isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0",
    zoom: isAnimating ? "opacity-0 scale-50" : "opacity-100 scale-100",
    none: ""
  };
  
  // Rounded classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  };
  
  // Icon color classes
  const iconColorClasses = {
    primary: "text-[#e8c547]",
    secondary: "text-white",
    success: "text-green-500",
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
    dark: "text-gray-900",
    light: "text-gray-100"
  };
  
  // Title alignment classes
  const titleAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };
  
  // Footer alignment classes
  const footerAlignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };
  
  return (
    <div 
      className={`fixed inset-0 flex ${positionClasses[actualPosition]} p-4 bg-black/${backdropOpacity} backdrop-blur-sm transition-opacity duration-300`}
      onClick={handleBackdropClick}
      style={{ zIndex }}
    >
      <div 
        ref={modalRef}
        className={`
          ${variantClasses[variant]} 
          ${!fullScreen ? sizeClasses[size] : 'w-full h-full m-0'} 
          ${roundedClasses[fullScreen ? 'none' : rounded]} 
          ${animationClasses[animation]}
          ${fullScreen ? 'fixed inset-0' : 'w-full'}
          shadow-xl transform transition-all duration-300 ${className}
        `}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e8c547]"></div>
          </div>
        )}
        
        {/* Modal header */}
        {!hideHeader && (header || title) && (
          <div className={`px-6 py-4 border-b border-[#3e503e]/30 ${titleAlign ? titleAlignClasses[titleAlign] : ''}`}>
            {header || (
              <div className="flex items-center">
                {icon && (
                  <div className={`mr-3 ${iconColorClasses[iconColor]}`}>
                    <i className={icon}></i>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-[#e8c547]">{title}</h3>
                  {subtitle && <p className="mt-1 text-sm text-gray-300">{subtitle}</p>}
                </div>
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                aria-label="Close"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            )}
          </div>
        )}
        
        {/* Modal body */}
        <div className={`px-6 py-4 ${scrollable ? 'overflow-y-auto' : ''} ${fullScreen ? 'flex-grow' : ''}`} style={{ maxHeight: fullScreen ? 'none' : 'calc(80vh - 160px)' }}>
          {children}
        </div>
        
        {/* Modal footer */}
        {!hideFooter && (footer || (
          <div className={`px-6 py-4 border-t border-[#3e503e]/30 flex ${footerAlignClasses[footerAlign]} gap-3`}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="modalForm">
              Save
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 
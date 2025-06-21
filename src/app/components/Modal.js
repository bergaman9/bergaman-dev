"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  animation = "slide",
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
  const [isAnimating, setIsAnimating] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Mount/unmount effect
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle modal open/close effects
  useEffect(() => {
    if (isOpen) {
      // Start with animation state
      setIsAnimating(true);
      
      // Small delay to ensure the component is mounted before starting animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 10);

      // Prevent body scroll - better approach
      if (preventScroll) {
        // Store current scroll position
        const scrollY = window.scrollY;
        
        // Apply overflow hidden to body with padding to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Store scroll position as data attribute for restoration
        document.body.setAttribute('data-scroll-y', scrollY);
      }

      return () => clearTimeout(timer);
    } else {
      // When closing, immediately set animating to true
      setIsAnimating(true);
      
      // Restore body scroll
      if (preventScroll) {
        // Remove overflow and padding
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Restore scroll position if it was stored
        const scrollY = document.body.getAttribute('data-scroll-y');
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
          document.body.removeAttribute('data-scroll-y');
        }
      }
    }
  }, [isOpen, preventScroll]);
  
  // Ensure modal is centered and visible
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Scroll to top of modal container
      const modalWrapper = modalRef.current.parentElement;
      if (modalWrapper) {
        modalWrapper.scrollTop = 0;
      }
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
    // Only close if the click was directly on the backdrop, not on any child elements
    if (e.target === e.currentTarget && closeOnOutsideClick) {
      if (onBackdropClick) {
        onBackdropClick(e);
      } else {
        onClose();
      }
    }
  };
  
  if (!isOpen || !mounted) return null;
  
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
  
  // Position classes (not used when wrapper is present)
  const positionClasses = {
    center: "",
    top: "",
    bottom: "",
    left: "",
    right: "",
    "top-left": "",
    "top-right": "",
    "bottom-left": "",
    "bottom-right": ""
  };
  
  // Use the actual position from props
  const actualPosition = position;
  
  // Animation classes
  const animationClasses = {
    fade: isAnimating ? "opacity-0" : "opacity-100",
    slide: isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0",
    zoom: isAnimating ? "opacity-0 scale-75" : "opacity-100 scale-100",
    slideUp: isAnimating ? "translate-y-full" : "translate-y-0",
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
  
  return createPortal(
    <div 
      className={`fixed inset-0 z-[99999] bg-black/${backdropOpacity} backdrop-blur-sm transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 overflow-y-auto" onClick={handleBackdropClick}>
        <div className="flex min-h-full items-center justify-center p-4" onClick={handleBackdropClick}>
          <div 
            ref={modalRef}
            className={`
              ${variantClasses[variant]} 
              ${!fullScreen ? sizeClasses[size] : 'w-full h-full m-0'} 
              ${roundedClasses[fullScreen ? 'none' : rounded]} 
              ${animationClasses[animation]}
              ${fullScreen ? 'fixed inset-0' : 'relative'}
              shadow-xl transform transition-all duration-200 ease-out ${className}
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
        <div className={`px-6 py-4 ${scrollable ? 'overflow-y-auto modal-scrollbar' : ''} ${fullScreen ? 'flex-grow' : ''}`} style={{ maxHeight: fullScreen ? 'none' : 'calc(80vh - 8rem)' }}>
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
      </div>
    </div>,
    document.body
  );
} 
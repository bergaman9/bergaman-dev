"use client";

import { useState } from 'react';

export default function Alert({
  title,
  children,
  variant = "info",
  icon,
  dismissible = false,
  onDismiss,
  className = "",
  rounded = "lg",
  size = "md",
  border = true,
  action
}) {
  const [dismissed, setDismissed] = useState(false);
  
  // Handle dismiss click
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  // If dismissed, don't render anything
  if (dismissed) return null;
  
  // Variant styles
  const variants = {
    info: {
      bg: "bg-blue-900/20 backdrop-blur-sm",
      border: "border-blue-600/30",
      text: "text-blue-400",
      icon: "fas fa-info-circle"
    },
    success: {
      bg: "bg-green-900/20 backdrop-blur-sm",
      border: "border-green-600/30",
      text: "text-green-400",
      icon: "fas fa-check-circle"
    },
    warning: {
      bg: "bg-yellow-900/20 backdrop-blur-sm",
      border: "border-yellow-600/30",
      text: "text-yellow-400",
      icon: "fas fa-exclamation-triangle"
    },
    error: {
      bg: "bg-red-900/20 backdrop-blur-sm",
      border: "border-red-600/30",
      text: "text-red-400",
      icon: "fas fa-exclamation-circle"
    },
    primary: {
      bg: "bg-[#e8c547]/10 backdrop-blur-sm",
      border: "border-[#e8c547]/30",
      text: "text-[#e8c547]",
      icon: "fas fa-star"
    },
    neutral: {
      bg: "bg-[#2e3d29]/20 backdrop-blur-sm",
      border: "border-[#3e503e]/30",
      text: "text-gray-300",
      icon: "fas fa-bell"
    },
    dark: {
      bg: "bg-[#0e1b12]/80 backdrop-blur-sm",
      border: "border-[#3e503e]/50",
      text: "text-gray-300",
      icon: "fas fa-info-circle"
    },
    light: {
      bg: "bg-white/10 backdrop-blur-sm",
      border: "border-white/20",
      text: "text-white",
      icon: "fas fa-info-circle"
    }
  };
  
  // Size styles
  const sizes = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
    xl: "p-5"
  };
  
  // Rounded styles
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };
  
  // Get the current variant
  const currentVariant = variants[variant] || variants.info;
  
  // Determine icon to use
  const alertIcon = icon || currentVariant.icon;
  
  // Combined classes
  const alertClasses = `
    ${currentVariant.bg}
    ${border ? `border ${currentVariant.border}` : ''}
    ${roundedStyles[rounded]}
    ${sizes[size]}
    ${className}
  `;
  
  return (
    <div className={alertClasses}>
      <div className="flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 mt-0.5 ${currentVariant.text}`}>
          <i className={alertIcon}></i>
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-grow">
          {title && <h3 className={`text-sm font-medium ${currentVariant.text}`}>{title}</h3>}
          <div className={`text-sm ${title ? 'mt-1' : ''} text-gray-300`}>
            {children}
          </div>
          
          {/* Action Button */}
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
        
        {/* Dismiss Button */}
        {dismissible && (
          <div className="ml-auto pl-3 flex-shrink-0">
            <button
              type="button"
              className={`inline-flex rounded-md p-1 ${currentVariant.text} hover:bg-[#2e3d29]/30 focus:outline-none`}
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
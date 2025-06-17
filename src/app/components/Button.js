"use client";

import Link from 'next/link';
import React from 'react';

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  loading = false,
  ...props
}) {
  // Variant styles
  const variants = {
    primary: "bg-[#e8c547] hover:bg-[#f4d76b] text-[#0e1b12] font-medium",
    secondary: "bg-transparent border border-[#e8c547] text-[#e8c547] hover:bg-[#e8c547]/10",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-[#0e1b12]",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    dark: "bg-[#1a241a] hover:bg-[#2e3d29] text-white border border-[#3e503e]",
    light: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    link: "bg-transparent text-[#e8c547] hover:text-[#f4d76b] hover:underline p-0",
    ghost: "bg-transparent hover:bg-[#e8c547]/10 text-[#e8c547]",
    outline: "bg-transparent border border-current text-[#e8c547] hover:bg-[#e8c547]/10"
  };

  // Size styles
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-2.5 text-lg",
    xl: "px-6 py-3 text-xl"
  };

  // Disabled and loading states
  const stateClasses = (disabled || loading) 
    ? 'opacity-70 cursor-not-allowed' 
    : 'transition-colors duration-200';

  // Full width
  const widthClass = fullWidth ? 'w-full' : '';

  // Link variant padding
  const paddingClass = variant === 'link' ? '' : sizes[size] || sizes.md;

  // Combined classes
  const buttonClasses = `
    ${variants[variant] || variants.primary}
    ${paddingClass}
    ${stateClasses}
    ${widthClass}
    rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e8c547]/50
    ${className}
  `;

  // Icon rendering
  const renderIcon = () => {
    if (!icon) return null;
    
    // If icon is a string (Font Awesome class), render it as an <i> element
    if (typeof icon === 'string') {
      return <i className={`${icon} ${iconPosition === "left" ? "mr-2" : "ml-2"}`}></i>;
    }
    
    // Otherwise, render the icon as is (JSX element)
    return <span className={iconPosition === "left" ? "mr-2" : "ml-2"}>{icon}</span>;
  };

  // Loading content
  const buttonContent = loading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{children}</span>
    </div>
  ) : (
    <>
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </>
  );

  // Render as link if href is provided
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses}
        {...props}
      >
        {buttonContent}
      </Link>
    );
  }

  // Render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading ? true : undefined}
      {...props}
    >
      {buttonContent}
    </button>
  );
} 
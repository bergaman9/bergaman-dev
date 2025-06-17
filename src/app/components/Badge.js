"use client";

import Link from 'next/link';

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  icon,
  iconPosition = "left",
  href,
  onClick,
  className = "",
  dismissible = false,
  onDismiss,
  outline = false,
  dot = false,
  count,
  max = 99,
  pulse = false,
  ...props
}) {
  // Variant styles
  const variants = {
    primary: {
      base: "bg-[#e8c547] text-[#0e1b12]",
      outline: "bg-transparent text-[#e8c547] border border-[#e8c547]",
      hover: "hover:bg-[#f4d76b]"
    },
    secondary: {
      base: "bg-[#2e3d29] text-white",
      outline: "bg-transparent text-[#2e3d29] border border-[#2e3d29]",
      hover: "hover:bg-[#3e503e]"
    },
    success: {
      base: "bg-green-600 text-white",
      outline: "bg-transparent text-green-500 border border-green-500",
      hover: "hover:bg-green-700"
    },
    danger: {
      base: "bg-red-600 text-white",
      outline: "bg-transparent text-red-500 border border-red-500",
      hover: "hover:bg-red-700"
    },
    warning: {
      base: "bg-yellow-500 text-[#0e1b12]",
      outline: "bg-transparent text-yellow-500 border border-yellow-500",
      hover: "hover:bg-yellow-600"
    },
    info: {
      base: "bg-blue-600 text-white",
      outline: "bg-transparent text-blue-500 border border-blue-500",
      hover: "hover:bg-blue-700"
    },
    dark: {
      base: "bg-[#0e1b12] text-white border border-[#3e503e]/50",
      outline: "bg-transparent text-gray-300 border border-[#3e503e]",
      hover: "hover:bg-[#1a241a]"
    },
    light: {
      base: "bg-gray-200 text-gray-800",
      outline: "bg-transparent text-gray-300 border border-gray-300",
      hover: "hover:bg-gray-300"
    },
    glass: {
      base: "bg-white/10 backdrop-blur-sm text-white border border-white/20",
      outline: "bg-transparent text-white border border-white/30",
      hover: "hover:bg-white/20"
    }
  };
  
  // Size styles
  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
    xl: "px-4 py-2 text-lg"
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
  
  // Get current variant
  const currentVariant = variants[variant] || variants.primary;
  
  // Determine style based on outline prop
  const variantStyle = outline ? currentVariant.outline : currentVariant.base;
  
  // Format count with max limit
  const formattedCount = count !== undefined ? (count > max ? `${max}+` : count) : null;
  
  // Base badge styles
  const baseStyles = "inline-flex items-center justify-center font-medium";
  
  // Combined classes
  const badgeClasses = `
    ${baseStyles}
    ${variantStyle}
    ${sizes[size]}
    ${roundedStyles[rounded]}
    ${href || onClick ? `cursor-pointer ${currentVariant.hover}` : ''}
    ${dismissible ? 'pr-6' : ''}
    ${className}
  `;
  
  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = typeof icon === 'string' 
      ? <i className={`${icon} ${iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5'}`}></i> 
      : <span className={iconPosition === 'left' ? 'mr-1.5' : 'ml-1.5'}>{icon}</span>;
    
    return iconElement;
  };
  
  // Handle dismiss click
  const handleDismiss = (e) => {
    e.stopPropagation();
    if (onDismiss) onDismiss();
  };
  
  // Badge content
  const badgeContent = (
    <>
      {dot && (
        <span className={`w-2 h-2 rounded-full inline-block mr-1.5 bg-current ${pulse ? 'animate-pulse' : ''}`}></span>
      )}
      
      {iconPosition === 'left' && renderIcon()}
      
      {formattedCount !== null ? formattedCount : children}
      
      {iconPosition === 'right' && renderIcon()}
      
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-current opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Dismiss"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      )}
    </>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className={badgeClasses} {...props}>
        {badgeContent}
      </Link>
    );
  }
  
  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button type="button" className={badgeClasses} onClick={onClick} {...props}>
        {badgeContent}
      </button>
    );
  }
  
  // Render as span by default
  return (
    <span className={badgeClasses} {...props}>
      {badgeContent}
    </span>
  );
} 
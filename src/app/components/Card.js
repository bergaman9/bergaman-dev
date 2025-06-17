"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Card({
  children,
  className = "",
  variant = "default",
  elevation = "md",
  hover = true,
  href,
  imageSrc,
  imageAlt,
  imagePosition = "top",
  imageHeight = "h-48",
  imageOverlay = false,
  title,
  titleSize = "lg",
  subtitle,
  description,
  category,
  date,
  readTime,
  tags = [],
  status,
  footer,
  header,
  onClick,
  badge,
  badgeColor = "primary",
  icon,
  iconPosition = "left",
  loading = false,
  rounded = "lg",
  fullWidth = false
}) {
  // Base card styles
  const baseClasses = `overflow-hidden transition-all duration-300 ${fullWidth ? 'w-full' : ''}`;
  
  // Rounded styles
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  };
  
  // Variant styles
  const variantClasses = {
    default: "bg-[#2e3d29]/20 backdrop-blur-md border border-[#3e503e]/30",
    outline: "bg-transparent backdrop-blur-md border border-[#3e503e]/50",
    solid: "bg-[#0e1b12] border border-[#3e503e]/30",
    glass: "bg-[#2e3d29]/5 backdrop-blur-xl border border-white/10 shadow-lg",
    dark: "bg-[#0e1b12] border border-[#3e503e]/50",
    light: "bg-[#e8e8e8] text-[#0e1b12] border border-[#3e503e]/10",
    primary: "bg-[#e8c547]/10 border border-[#e8c547]/30 text-[#e8c547]",
    success: "bg-green-900/10 border border-green-600/30 text-green-500",
    danger: "bg-red-900/10 border border-red-600/30 text-red-500",
    warning: "bg-yellow-900/10 border border-yellow-600/30 text-yellow-500",
    info: "bg-blue-900/10 border border-blue-600/30 text-blue-500",
    transparent: "bg-transparent"
  };
  
  // Elevation styles
  const elevationClasses = {
    none: "",
    xs: "shadow-sm",
    sm: "shadow",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  };
  
  // Hover styles
  const hoverClasses = hover ? "hover:border-[#e8c547]/50 hover:translate-y-[-2px]" : "";
  
  // Title size styles
  const titleSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  };
  
  // Badge color styles
  const badgeColors = {
    primary: "bg-[#e8c547] text-[#0e1b12]",
    secondary: "bg-[#2e3d29] text-white",
    success: "bg-green-600 text-white",
    danger: "bg-red-600 text-white",
    warning: "bg-yellow-500 text-[#0e1b12]",
    info: "bg-blue-600 text-white",
    dark: "bg-[#0e1b12] text-white",
    light: "bg-gray-200 text-gray-800"
  };
  
  // Loading state
  if (loading) {
    return (
      <div className={`${baseClasses} ${roundedClasses[rounded]} ${variantClasses[variant]} ${elevationClasses[elevation]} ${className} animate-pulse`}>
        <div className={`${imageHeight} bg-[#2e3d29]/50`}></div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-[#2e3d29]/50 rounded w-3/4"></div>
          <div className="h-4 bg-[#2e3d29]/40 rounded w-full"></div>
          <div className="h-4 bg-[#2e3d29]/40 rounded w-5/6"></div>
          <div className="h-4 bg-[#2e3d29]/40 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  // Combine classes
  const cardClasses = `${baseClasses} ${roundedClasses[rounded]} ${variantClasses[variant]} ${elevationClasses[elevation]} ${hoverClasses} ${className}`;
  
  // Image component with position handling
  const imageComponent = imageSrc && (
    <div className={`relative ${imageHeight} bg-gradient-to-br from-[#2e3d29] to-[#0e1b12] flex items-center justify-center overflow-hidden`}>
      <Image
        src={imageSrc}
        alt={imageAlt || title || "Card image"}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Overlay for better text visibility */}
      {imageOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12] to-transparent opacity-70"></div>
      )}
      
      {category && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#e8c547] text-[#0e1b12] px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
      )}
      
      {status && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold">
            {status}
          </span>
        </div>
      )}
      
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 ${badgeColors[badgeColor]} rounded-full text-xs font-medium`}>
            {badge}
          </span>
        </div>
      )}
      
      {date && !readTime && (
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-3 py-1 bg-[#0e1b12]/80 text-gray-300 rounded-full text-xs">
            {typeof date === 'string' ? date : new Date(date).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
  
  // Card content
  const cardContent = (
    <>
      {/* Header section */}
      {header && <div className="p-3 border-b border-[#3e503e]/30">{header}</div>}
      
      {/* Image positioning */}
      {imagePosition === 'top' && imageComponent}
      
      <div className="p-4">
        {/* Icon and title row */}
        {(title || icon) && (
          <div className="flex items-center gap-2 mb-2">
            {icon && iconPosition === 'left' && <span className="text-[#e8c547]">{icon}</span>}
            {title && <h3 className={`font-bold gradient-text ${titleSizes[titleSize]}`}>{title}</h3>}
            {icon && iconPosition === 'right' && <span className="text-[#e8c547] ml-auto">{icon}</span>}
          </div>
        )}
        
        {/* Subtitle */}
        {subtitle && <p className="text-sm text-gray-400 mb-2">{subtitle}</p>}
        
        {/* Description */}
        {description && <p className="text-gray-300 mb-3 text-sm leading-relaxed line-clamp-3">{description}</p>}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded-full text-xs text-[#e8c547]">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Date and read time */}
        {(date && readTime) && (
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>
              <i className="fas fa-calendar mr-1"></i>
              {typeof date === 'string' ? date : new Date(date).toLocaleDateString()}
            </span>
            <span>
              <i className="fas fa-clock mr-1"></i>
              {readTime}
            </span>
          </div>
        )}
        
        {/* Children content */}
        {children}
      </div>
      
      {/* Image at bottom if specified */}
      {imagePosition === 'bottom' && imageComponent}
      
      {/* Footer section */}
      {footer && <div className="p-3 border-t border-[#3e503e]/30">{footer}</div>}
    </>
  );

  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className={`${cardClasses} group`}>
        {cardContent}
      </Link>
    );
  }

  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button onClick={onClick} className={`${cardClasses} w-full text-left`}>
        {cardContent}
      </button>
    );
  }

  // Default render as div
  return <div className={cardClasses}>{cardContent}</div>;
} 
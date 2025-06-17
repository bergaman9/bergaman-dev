"use client";

import { useRouter } from 'next/navigation';
import Button from './Button';

export default function PageHeader({
  title,
  subtitle,
  icon,
  variant = "default",
  divider = true,
  actions = [],
  backButton = false,
  backButtonText = "Back",
  onBackClick,
  className = "",
  stats = [],
  filter = null,
  maxWidth = "max-w-7xl",
  centered = false
}) {
  const router = useRouter();
  
  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };
  
  // Variant styles
  const variants = {
    default: "mb-6",
    compact: "mb-4",
    large: "mb-8"
  };
  
  // Render icon based on type (string or JSX element)
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <i className={`${icon} ${variant === 'large' ? 'text-2xl' : 'text-xl'}`}></i>;
    }
    
    return icon;
  };
  
  return (
    <div className={`${variants[variant] || variants.default} ${maxWidth} ${centered ? 'mx-auto' : ''} ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          {backButton && (
            <button
              onClick={handleBackClick}
              className="mr-3 text-gray-400 hover:text-[#e8c547] transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              {backButtonText}
            </button>
          )}
          
          <div className="flex items-center">
            {icon && (
              <div className="mr-3 text-[#e8c547]">
                {renderIcon()}
              </div>
            )}
            
            <div>
              <h1 className={`font-bold text-white ${variant === 'large' ? 'text-3xl' : variant === 'compact' ? 'text-xl' : 'text-2xl'}`}>
                {title}
              </h1>
              
              {subtitle && variant !== 'compact' && (
                <p className="text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
        
        {(actions.length > 0 || filter) && (
          <div className="flex flex-wrap gap-2 justify-start sm:justify-end items-center">
            {filter && (
              <div className="mr-2">{filter}</div>
            )}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
                href={action.href}
                icon={action.icon}
                iconPosition={action.iconPosition || 'left'}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Stats row */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1a2e1a]/30 backdrop-blur-sm rounded-lg p-3 border border-[#3e503e]/50">
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xl font-semibold text-[#e8c547]">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
      
      {divider && (
        <div className="h-px bg-gradient-to-r from-transparent via-[#3e503e]/50 to-transparent mt-4"></div>
      )}
    </div>
  );
} 
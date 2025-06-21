"use client";

import { useState, useEffect } from 'react';

export default function Checkbox({
  checked = false,
  onChange,
  label,
  name,
  id,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  labelClassName = '',
  icon,
  description,
  required = false,
  indeterminate = false,
  error = false,
  errorMessage = '',
  ...props
}) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked, e);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  // Label size classes
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Variant classes
  const variantClasses = {
    primary: `
      text-[#e8c547] 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-[#e8c547]/50 
      focus:ring-[#e8c547]/20 
      focus:border-[#e8c547]
      checked:bg-[#e8c547] 
      checked:border-[#e8c547]
      checked:hover:bg-[#d4b445]
      checked:hover:border-[#d4b445]
    `,
    secondary: `
      text-gray-300 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-gray-400 
      focus:ring-gray-400/20 
      focus:border-gray-400
      checked:bg-gray-600 
      checked:border-gray-600
      checked:hover:bg-gray-700
      checked:hover:border-gray-700
    `,
    success: `
      text-green-500 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-green-500/50 
      focus:ring-green-500/20 
      focus:border-green-500
      checked:bg-green-500 
      checked:border-green-500
      checked:hover:bg-green-600
      checked:hover:border-green-600
    `,
    danger: `
      text-red-500 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-red-500/50 
      focus:ring-red-500/20 
      focus:border-red-500
      checked:bg-red-500 
      checked:border-red-500
      checked:hover:bg-red-600
      checked:hover:border-red-600
    `,
    warning: `
      text-yellow-500 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-yellow-500/50 
      focus:ring-yellow-500/20 
      focus:border-yellow-500
      checked:bg-yellow-500 
      checked:border-yellow-500
      checked:hover:bg-yellow-600
      checked:hover:border-yellow-600
    `,
    info: `
      text-blue-500 
      bg-[#0e1b12] 
      border-[#3e503e] 
      hover:border-blue-500/50 
      focus:ring-blue-500/20 
      focus:border-blue-500
      checked:bg-blue-500 
      checked:border-blue-500
      checked:hover:bg-blue-600
      checked:hover:border-blue-600
    `
  };

  // Error state classes
  const errorClasses = error
    ? 'border-red-500 hover:border-red-600 focus:ring-red-500/20 focus:border-red-500'
    : '';

  // Disabled state classes
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <div className={`relative ${className}`}>
      <label 
        className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group`}
        htmlFor={id || name}
      >
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id || name}
            name={name}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            ref={(input) => {
              if (input) {
                input.indeterminate = indeterminate;
              }
            }}
            className={`
              appearance-none 
              ${sizeClasses[size]} 
              ${variantClasses[variant]}
              ${errorClasses}
              ${disabledClasses}
              border-2 
              rounded 
              transition-all 
              duration-200 
              focus:ring-2 
              focus:ring-offset-2 
              focus:ring-offset-[#0e1b12]
              focus:outline-none
              peer
            `}
            {...props}
          />
          
          {/* Checkmark Icon */}
          <svg
            className={`
              absolute 
              ${sizeClasses[size]} 
              pointer-events-none 
              hidden 
              peer-checked:block 
              text-[#0e1b12]
              ${size === 'sm' ? 'p-0.5' : size === 'md' ? 'p-0.5' : size === 'lg' ? 'p-1' : 'p-1'}
            `}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Indeterminate Icon */}
          {indeterminate && (
            <svg
              className={`
                absolute 
                ${sizeClasses[size]} 
                pointer-events-none 
                text-[#0e1b12]
                ${size === 'sm' ? 'p-0.5' : size === 'md' ? 'p-0.5' : size === 'lg' ? 'p-1' : 'p-1'}
              `}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Label and Description */}
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <div className={`
                ${labelSizeClasses[size]} 
                font-medium 
                text-gray-200 
                group-hover:text-white 
                transition-colors 
                duration-200
                ${disabled ? 'opacity-50' : ''}
                flex items-center gap-2
                ${labelClassName}
              `}>
                {icon && <i className={icon}></i>}
                <span>{label}</span>
                {required && <span className="text-red-500">*</span>}
              </div>
            )}
            {description && (
              <p className={`
                ${size === 'sm' ? 'text-xs' : 'text-sm'} 
                text-gray-400 
                mt-1
                ${disabled ? 'opacity-50' : ''}
              `}>
                {description}
              </p>
            )}
          </div>
        )}
      </label>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <i className="fas fa-exclamation-circle text-xs"></i>
          {errorMessage}
        </p>
      )}
    </div>
  );
} 
"use client";

import { useState } from 'react';

export default function Input({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  hint,
  className = "",
  variant = "default",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  prefix,
  suffix,
  rounded = "lg",
  min,
  max,
  step,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Variant styles
  const variants = {
    default: "bg-[#2e3d29]/30 border border-[#3e503e] text-white focus:border-[#e8c547]",
    filled: "bg-[#2e3d29]/50 border border-transparent text-white focus:bg-[#2e3d29]/70",
    outlined: "bg-transparent border border-[#3e503e] text-white focus:border-[#e8c547]",
    underlined: "bg-transparent border-t-0 border-l-0 border-r-0 border-b border-[#3e503e] rounded-none text-white focus:border-[#e8c547]",
    ghost: "bg-transparent border border-transparent text-white focus:bg-[#2e3d29]/30",
    primary: "bg-[#e8c547]/10 border border-[#e8c547]/30 text-white focus:border-[#e8c547]",
    error: "bg-[#2e3d29]/30 border border-red-500 text-white focus:border-red-500"
  };
  
  // Size styles
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-2.5 text-lg",
    xl: "px-5 py-3 text-xl"
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
  
  // Base input styles
  const baseStyles = "block transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Error state overrides variant
  const currentVariant = error ? "error" : variant;
  
  // Combined classes for the input
  const inputClasses = `
    ${baseStyles} 
    ${variants[currentVariant] || variants.default} 
    ${sizes[size] || sizes.md} 
    ${roundedStyles[rounded]} 
    ${fullWidth ? 'w-full' : ''} 
    ${(icon && iconPosition === "left") ? 'pl-10' : ''} 
    ${(icon && iconPosition === "right") ? 'pr-10' : ''} 
    ${prefix ? 'pl-10' : ''} 
    ${suffix ? 'pr-10' : ''} 
    ${className}
  `;
  
  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Determine actual input type (for password visibility toggle)
  const actualType = type === 'password' && passwordVisible ? 'text' : type;
  
  // Handle focus events
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium mb-2 ${error ? 'text-red-500' : 'text-gray-300'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {prefix}
          </div>
        )}
        
        {/* Left Icon */}
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {typeof icon === 'string' ? <i className={icon}></i> : icon}
          </div>
        )}
        
        {/* Input Element */}
        <input
          type={actualType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClasses}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onKeyPress={onKeyPress}
          {...props}
        />
        
        {/* Right Icon */}
        {icon && iconPosition === "right" && !type === 'password' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {typeof icon === 'string' ? <i className={icon}></i> : icon}
          </div>
        )}
        
        {/* Password Visibility Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </button>
        )}
        
        {/* Suffix */}
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {suffix}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
      
      {/* Hint Text */}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-400">
          <i className="fas fa-info-circle mr-1"></i>
          {hint}
        </p>
      )}
    </div>
  );
} 
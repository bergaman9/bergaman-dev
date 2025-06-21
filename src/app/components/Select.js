"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
  required = false,
  label,
  error,
  fullWidth = false,
  icon,
  name,
  id,
  usePortal = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const [shouldUsePortal, setShouldUsePortal] = useState(usePortal);
  const selectRef = useRef(null);
  const buttonRef = useRef(null);
  const selectedOption = options.find(option => option.value === value);

  // Mount effect for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position when using portal
  useEffect(() => {
    if (isOpen && shouldUsePortal && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen, shouldUsePortal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Auto-detect if we're inside a modal
  useEffect(() => {
    if (selectRef.current) {
      const modalParent = selectRef.current.closest('[role="dialog"], .modal-container, .image-selector-modal');
      if (modalParent && !usePortal) {
        // We're inside a modal, enable portal automatically
        setShouldUsePortal(true);
      }
    }
  }, [usePortal]);

  // Variants
  const variants = {
    default: "bg-[#0e1b12] border border-[#3e503e] text-white focus:border-[#e8c547]",
    primary: "bg-[#e8c547]/10 border border-[#e8c547]/30 text-[#e8c547] focus:border-[#e8c547]",
    secondary: "bg-[#2e3d29]/30 border border-[#3e503e]/30 text-gray-300 focus:border-[#3e503e]",
    dark: "bg-[#0e1b12]/90 border border-[#3e503e]/50 text-gray-200 focus:border-[#3e503e]",
    light: "bg-white/10 backdrop-blur-md border border-white/20 text-white focus:border-white/30",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white focus:border-white/20",
    minimal: "bg-transparent border border-[#3e503e]/30 text-gray-300 focus:border-[#e8c547]/50",
    success: "bg-green-900/20 border border-green-600/30 text-green-400 focus:border-green-500/50",
    danger: "bg-red-900/20 border border-red-600/30 text-red-400 focus:border-red-500/50",
    warning: "bg-yellow-900/20 border border-yellow-600/30 text-yellow-400 focus:border-yellow-500/50",
    info: "bg-blue-900/20 border border-blue-600/30 text-blue-400 focus:border-blue-500/50",
  };

  // Sizes
  const sizes = {
    sm: "px-2 py-1 text-xs h-8",
    md: "px-3 py-3 text-sm h-12",
    lg: "px-4 py-4 text-base h-14",
  };

  // Handle option selection
  const handleSelect = (option) => {
    // Create a synthetic event like object to match native select behavior
    const syntheticEvent = {
      target: {
        value: option.value,
        name: name,
        id: id
      }
    };
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  // Render dropdown content
  const renderDropdown = () => {
    if (!isOpen || !mounted) return null;

    const dropdown = (
      <div 
        className="bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg shadow-xl max-h-60 overflow-y-auto modal-scrollbar z-[100000]"
        style={shouldUsePortal ? {
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
        } : {}}
      >
        <ul role="listbox" className="py-1">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`px-3 py-2 cursor-pointer transition-colors duration-200 ${
                value === option.value 
                  ? 'bg-[#e8c547]/10 text-[#e8c547]' 
                  : 'text-gray-300 hover:bg-[#2e3d29]/30 hover:text-white'
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-center">
                {option.icon && <i className={`${option.icon} mr-2`}></i>}
                {option.label}
              </div>
            </li>
          ))}
          {options.length === 0 && (
            <li className="px-3 py-2 text-gray-500 italic">No options available</li>
          )}
        </ul>
      </div>
    );

    // Use portal if enabled
    if (shouldUsePortal && typeof window !== 'undefined') {
      return createPortal(dropdown, document.body);
    }

    return dropdown;
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex items-center justify-between w-full ${variants[variant]} ${sizes[size]} rounded-lg transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-opacity-50'} focus:outline-none focus:ring-2 focus:ring-[#e8c547]/20 appearance-none`}
        disabled={disabled}
        id={id}
        name={name}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <i className={`${icon} mr-2 text-opacity-70`}></i>}
          <span className={!selectedOption ? 'text-gray-500' : ''}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </div>
      </button>
      
      {/* Render dropdown - either in place or via portal */}
      {!shouldUsePortal && isOpen && (
        <div className="absolute z-[100000] w-full mt-1">
          {renderDropdown()}
        </div>
      )}
      
      {/* Portal rendered dropdown */}
      {shouldUsePortal && renderDropdown()}
      
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
} 
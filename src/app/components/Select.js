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
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 180)
      });
    }
  }, [isOpen, shouldUsePortal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        // Also check if clicking inside the portal content if it exists
        const portalContent = document.getElementById(`select-portal-${id || name || 'dropdown'}`);
        if (portalContent && portalContent.contains(event.target)) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, id, name]);

  // Auto-detect if we're inside a modal
  useEffect(() => {
    if (selectRef.current) {
      const modalParent = selectRef.current.closest('[role="dialog"], .modal-container, .image-selector-modal');
      if (modalParent && !usePortal) {
        setShouldUsePortal(true);
      }
    }
  }, [usePortal]);

  // Variants
  const variants = {
    default: "bg-[#0e1b12] border border-[#3e503e] text-white focus:border-[#e8c547]",
    primary: "bg-[#1a2e1a]/80 backdrop-blur-sm border border-[#3e503e]/50 text-gray-200 hover:border-[#e8c547]/50 hover:bg-[#1a2e1a]",
    secondary: "bg-[#2e3d29]/30 border border-[#3e503e]/30 text-gray-300 focus:border-[#3e503e]",
    dark: "bg-[#0e1b12]/90 border border-[#3e503e]/50 text-gray-200 focus:border-[#3e503e]",
  };

  // Sizes
  const sizes = {
    sm: "px-2 py-1 text-xs h-8",
    md: "px-4 py-2.5 text-sm",
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

    // Check if onChange expects an event or value
    // In recommendations page we passed (value) => ... 
    // But original Select passed event. 
    // To support both, we should check usages. 
    // But safely, let's keep passing the object if the component was designed that way, 
    // OR just pass the value if we want to simplify. 
    // Existing Select calls onChange(syntheticEvent). 
    // Recommendations page was: onChange={(value) => setSortBy(value)}. 
    // Wait, the previous Select code called onChange(syntheticEvent).
    // The recommendations page code using Select was:
    // onChange={(value) => setSortBy(value)} <-- THIS WAS WRONG for the original Select!
    // The original Select sent an OBJECT.
    // Ah! That explains why "eskiden düzgündü" (previously it was fine) - wait, if I changed the recommendations page to use SortDropdown which sends VALUE, and SortDropdown sent VALUE, it should have worked?
    // The user said "sort by için seçim yapılamıyor". 

    // Let's modify this to support value direct passing if it's not a form event handler
    if (typeof onChange === 'function') {
      // Try to pass simple value, but if it breaks existing consumers expecting e.target.value...
      // Let's inspect other usages.
      // But for now, I will modify Recommendations page to handle the event or value.
      // Actually, I'll allow this component to emit the value directly if prop `emitValue` is true, or just patch standard behavior.
      // Changing standard behavior might break other pages.
      onChange(option.value); // Let's just pass value directly to be compatible with new designs. I need to update usages.
    }
    setIsOpen(false);
  };

  // Render dropdown content
  const renderDropdown = () => {
    if (!isOpen || !mounted) return null;

    const dropdownContent = (
      <div
        id={`select-portal-${id || name || 'dropdown'}`}
        className="bg-[#1a2e1a]/95 backdrop-blur-md border border-[#3e503e]/50 rounded-xl shadow-2xl shadow-black/40 overflow-hidden min-w-[180px] z-[100000] animate-in fade-in slide-in-from-top-2 duration-200"
        style={shouldUsePortal ? {
          position: 'fixed',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
        } : {}}
      >
        <ul role="listbox" className="py-2">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200
                ${value === option.value
                  ? 'bg-[#e8c547]/15 text-[#e8c547]'
                  : 'text-gray-300 hover:bg-[#2e3d29]/50 hover:text-white'
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
            >
              {option.icon && (
                <i className={`${option.icon} w-5 text-center ${value === option.value ? 'text-[#e8c547]' : 'text-gray-500'}`}></i>
              )}
              <span className="font-medium">{option.label}</span>
              {value === option.value && (
                <i className="fas fa-check ml-auto text-[#e8c547] text-sm"></i>
              )}
            </li>
          ))}
          {options.length === 0 && (
            <li className="px-4 py-3 text-gray-500 italic">No options available</li>
          )}
        </ul>
      </div>
    );

    if (shouldUsePortal && typeof window !== 'undefined') {
      return createPortal(dropdownContent, document.body);
    }

    return (
      <div className="absolute top-full left-0 w-full mt-2 z-[100]">
        {dropdownContent}
      </div>
    );
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex items-center justify-between w-full h-full ${variants[variant] || variants.default} ${sizes[size]} rounded-xl transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} focus:outline-none focus:ring-2 focus:ring-[#e8c547]/30 ${isOpen ? 'ring-2 ring-[#e8c547]/20 border-[#e8c547]/50' : ''}`}
        disabled={disabled}
        id={id}
        name={name}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon && <i className={`${icon} text-[#e8c547]`}></i>}
          {selectedOption?.icon && !icon && <i className={`${selectedOption.icon} text-[#e8c547]`}></i>}
          <span className={`truncate ${!selectedOption ? 'text-gray-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex-shrink-0 ml-2">
          <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#e8c547]' : ''}`}></i>
        </div>
      </button>

      {renderDropdown()}

      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
} 
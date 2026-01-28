"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function SortDropdown({
    options = [],
    value,
    onChange,
    label = "Sort by:",
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(option => option.value === value) || options[0];

    // Mount effect for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate dropdown position
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: Math.max(rect.width, 180)
            });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside - fixed to check both container and portal dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            const clickedInsideContainer = containerRef.current?.contains(event.target);
            const clickedInsideDropdown = dropdownRef.current?.contains(event.target);

            if (!clickedInsideContainer && !clickedInsideDropdown) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            // Use setTimeout to avoid immediate trigger from the opening click
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    const renderDropdown = () => {
        if (!isOpen || !mounted) return null;

        const dropdown = (
            <div
                ref={dropdownRef}
                className="fixed z-[100000]"
                style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`,
                    minWidth: `${dropdownPosition.width}px`,
                }}
            >
                <div className="bg-[#1a2e1a] border border-[#3e503e]/50 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
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
                                onClick={() => handleSelect(option)}
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
                    </ul>
                </div>
            </div>
        );

        if (typeof window !== 'undefined') {
            return createPortal(dropdown, document.body);
        }
        return null;
    };

    return (
        <div ref={containerRef} className={`flex items-center gap-3 ${className}`}>
            {label && (
                <span className="text-sm text-gray-400 font-medium">{label}</span>
            )}

            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
          relative flex items-center gap-3 px-4 py-2.5 
          bg-[#1a2e1a]/80 backdrop-blur-sm
          border border-[#3e503e]/50 
          rounded-xl
          transition-all duration-300
          hover:border-[#e8c547]/50 hover:bg-[#1a2e1a]
          focus:outline-none focus:ring-2 focus:ring-[#e8c547]/30 focus:border-[#e8c547]/50
          ${isOpen ? 'border-[#e8c547]/50 bg-[#1a2e1a] ring-2 ring-[#e8c547]/20' : ''}
        `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedOption?.icon && (
                    <i className={`${selectedOption.icon} text-[#e8c547]`}></i>
                )}
                <span className="text-gray-200 font-medium">{selectedOption?.label}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#e8c547]' : ''}`}></i>
            </button>

            {renderDropdown()}
        </div>
    );
}

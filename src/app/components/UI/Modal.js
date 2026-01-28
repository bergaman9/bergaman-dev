'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            setMounted(false);
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    // Use portal to render at document root level (fixing z-index issues with header/footer)
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            {/* Backdrop click handler */}
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className={`relative bg-[#0f0f0f] border border-white/10 w-full sm:rounded-2xl shadow-2xl animate-slideUp flex flex-col max-h-[90vh] ${className}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] rounded-t-2xl flex-shrink-0">
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0 min-h-0">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

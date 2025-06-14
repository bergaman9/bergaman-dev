"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageModal({ src, alt, isOpen, onClose, allImages = [], currentIndex = 0 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (allImages.length > 1) {
            setCurrentImageIndex((prev) => 
              prev === 0 ? allImages.length - 1 : prev - 1
            );
          }
          break;
        case 'ArrowRight':
          if (allImages.length > 1) {
            setCurrentImageIndex((prev) => 
              prev === allImages.length - 1 ? 0 : prev + 1
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allImages.length, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : { src, alt };

  const handlePrevious = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (allImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-[#2e3d29]/80 backdrop-blur-sm border border-[#3e503e]/50 rounded-full text-white hover:bg-[#e8c547] hover:text-[#0e1b12] transition-all duration-300 flex items-center justify-center group"
        aria-label="Close modal"
      >
        <i className="fas fa-times text-xl group-hover:scale-110 transition-transform duration-300"></i>
      </button>

      {/* Navigation Buttons */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#2e3d29]/80 backdrop-blur-sm border border-[#3e503e]/50 rounded-full text-white hover:bg-[#e8c547] hover:text-[#0e1b12] transition-all duration-300 flex items-center justify-center group"
            aria-label="Previous image"
          >
            <i className="fas fa-chevron-left text-xl group-hover:scale-110 transition-transform duration-300"></i>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#2e3d29]/80 backdrop-blur-sm border border-[#3e503e]/50 rounded-full text-white hover:bg-[#e8c547] hover:text-[#0e1b12] transition-all duration-300 flex items-center justify-center group"
            aria-label="Next image"
          >
            <i className="fas fa-chevron-right text-xl group-hover:scale-110 transition-transform duration-300"></i>
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#e8c547] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={currentImage.src}
            alt={currentImage.alt || 'Image'}
            fill
            className="object-contain"
            sizes="90vw"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>

      {/* Image Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2e3d29]/80 backdrop-blur-sm border border-[#3e503e]/50 rounded-lg px-4 py-2 text-center">
        <p className="text-white text-sm font-medium mb-1">
          {currentImage.alt || 'Image'}
        </p>
        {allImages.length > 1 && (
          <p className="text-gray-300 text-xs">
            {currentImageIndex + 1} of {allImages.length}
          </p>
        )}
      </div>

      {/* Gallery Thumbnails */}
      {allImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                index === currentImageIndex
                  ? 'border-[#e8c547] scale-110'
                  : 'border-[#3e503e] hover:border-[#e8c547]/50'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Close modal"
      />
    </div>
  );
} 
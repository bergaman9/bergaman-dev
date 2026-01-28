"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SafeImage = ({
  src,
  fallbackSrc = '/images/portfolio/default.svg',
  alt = '',
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onError,
  objectFit = 'cover',
  showLoader = false,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(showLoader);
  const [hasAttemptedFallback, setHasAttemptedFallback] = useState(false);

  // Reset when src changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
    setIsLoading(showLoader);
    setHasAttemptedFallback(false);
  }, [src, showLoader]);

  const handleError = (e) => {
    console.warn(`Image load error for: ${imgSrc}`);
    console.warn('Error details:', e);

    if (!hasAttemptedFallback && imgSrc !== fallbackSrc) {
      console.log(`Switching to fallback image: ${fallbackSrc}`);
      setError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
      setHasAttemptedFallback(true);

      // Call custom onError handler if provided
      if (onError) {
        onError(e);
      }
    } else {
      console.error(`Failed to load both primary and fallback images. Primary: ${src}, Fallback: ${fallbackSrc}`);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${imgSrc}`);
    setIsLoading(false);
    setError(false);
  };

  // Determine the source to use
  const getImageSource = () => {
    // If no src provided, use fallback
    if (!src || src.trim() === '') {
      console.log('No source provided, using fallback:', fallbackSrc);
      return fallbackSrc;
    }

    // If error occurred and we have a fallback, use fallback
    if (error && fallbackSrc && imgSrc !== fallbackSrc) {
      return fallbackSrc;
    }

    // Otherwise use the current imgSrc
    return imgSrc;
  };

  const validSrc = getImageSource();

  // For fill mode, don't set width and height
  const isFill = rest.fill;

  return (
    <div
      className={`relative overflow-hidden ${isFill ? 'w-full h-full' : ''} ${className}`}
      style={!isFill ? { width, height } : {}}
    >
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20 rounded z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e8c547]"></div>
        </div>
      )}

      {/* Show debug info in development */}


      <Image
        src={validSrc}
        alt={alt}
        width={!isFill ? width : undefined}
        height={!isFill ? height : undefined}
        className={`${isLoading && showLoader ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={() => {
          if (showLoader) setIsLoading(true);
        }}
        unoptimized={validSrc.startsWith('http') || validSrc.startsWith('/uploads')}
        style={{ objectFit }}
        {...rest}
      />
    </div>
  );
};

export default SafeImage; 
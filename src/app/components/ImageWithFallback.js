"use client";

import { useEffect } from 'react';

export default function ImageWithFallback() {
  useEffect(() => {
    // Add error handling to all images on the page
    const handleImageError = (e) => {
      const img = e.target;
      
      // Check if it's an img element or Next.js Image component
      if (img.tagName === 'IMG' && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        
        // Get the appropriate fallback based on the original src
        let fallbackSrc = '/images/portfolio/default.svg';
        
        if (img.src.includes('/games/')) {
          fallbackSrc = '/images/portfolio/game-placeholder.svg';
        } else if (img.src.includes('/movies/')) {
          fallbackSrc = '/images/portfolio/default.svg';
        } else if (img.src.includes('/books/')) {
          fallbackSrc = '/images/portfolio/default.svg';
        } else if (img.src.includes('/posts/')) {
          fallbackSrc = '/images/portfolio/default.svg';
        } else if (img.src.includes('/uploads/')) {
          fallbackSrc = '/images/portfolio/default.svg';
        }
        
        // Update the src
        img.src = fallbackSrc;
        
        // Add error class for styling
        img.classList.add('image-error');
      }
    };

    // Add event listeners to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', handleImageError);
      
      // Check if image is already broken
      if (img.complete && img.naturalHeight === 0) {
        handleImageError({ target: img });
      }
    });

    // Observer for dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IMG') {
            node.addEventListener('error', handleImageError);
          } else if (node.querySelectorAll) {
            const imgs = node.querySelectorAll('img');
            imgs.forEach(img => {
              img.addEventListener('error', handleImageError);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      images.forEach(img => {
        img.removeEventListener('error', handleImageError);
      });
      observer.disconnect();
    };
  }, []);

  return null;
} 
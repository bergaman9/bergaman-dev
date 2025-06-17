"use client";

import Image from 'next/image';
import Modal from './Modal';

const ImageModal = ({ src, alt, onClose }) => {
  // Don't render anything if src is null, undefined, or empty string
  if (!src) return null;
  
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={alt || 'Image Preview'}
    >
      <div className="flex items-center justify-center">
        <Image 
          src={src} 
          alt={alt || 'Preview'} 
          width={1200} 
          height={800} 
          className="rounded-lg w-full h-auto max-h-[70vh] object-contain" 
        />
      </div>
    </Modal>
  );
};

export default ImageModal; 
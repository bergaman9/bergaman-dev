"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageUpload({ onImageUpload, currentImage = null, className = "" }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const imageUrl = result.url;
        setPreviewUrl(imageUrl);
        if (onImageUpload) {
          // Ensure the URL is properly formatted
          onImageUpload(imageUrl);
        }
      } else {
        alert(result.error || 'Upload failed');
        setPreviewUrl(currentImage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      setPreviewUrl(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (onImageUpload) {
      onImageUpload(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl ? (
        // Image Preview
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#3e503e]">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Image load error:', previewUrl);
                e.target.src = '/images/portfolio/default.svg';
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                  <p>Uploading...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={uploading}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
              title="Change Image"
            >
              <i className="fas fa-edit text-sm"></i>
            </button>
            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
              title="Remove Image"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      ) : (
        // Upload Area
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? 'border-[#e8c547] bg-[#e8c547]/10'
              : 'border-[#3e503e] hover:border-[#e8c547]/50 hover:bg-[#e8c547]/5'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-3xl text-[#e8c547] mb-4"></i>
              <p className="text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="text-center">
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
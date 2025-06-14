"use client";

import { useEffect, useRef } from 'react';

const BlogImageGenerator = ({ title, category, width = 400, height = 250, className = "" }) => {
  const canvasRef = useRef(null);

  // Category color mapping
  const categoryColors = {
    'technology': {
      primary: '#e8c547',
      secondary: '#d4b445',
      accent: '#f4d03f',
      bg: 'rgba(232, 197, 71, 0.1)'
    },
    'ai': {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      bg: 'rgba(139, 92, 246, 0.1)'
    },
    'web-development': {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#67e8f9',
      bg: 'rgba(6, 182, 212, 0.1)'
    },
    'tutorial': {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#6ee7b7',
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    'programming': {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    'default': {
      primary: '#e8c547',
      secondary: '#d4b445',
      accent: '#f4d03f',
      bg: 'rgba(232, 197, 71, 0.1)'
    }
  };

  // Category icons
  const categoryIcons = {
    'technology': '⚡',
    'ai': '🤖',
    'web-development': '🌐',
    'tutorial': '📚',
    'programming': '💻',
    'default': '📝'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !title) return;

    const ctx = canvas.getContext('2d');
    
    // Ensure category is defined and use default if not
    const safeCategory = category || 'default';
    const colors = categoryColors[safeCategory] || categoryColors.default;
    const icon = categoryIcons[safeCategory] || categoryIcons.default;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.primary);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle pattern overlay
    ctx.fillStyle = colors.bg;
    for (let x = 0; x < width; x += 40) {
      for (let y = 0; y < height; y += 40) {
        ctx.fillRect(x, y, 20, 20);
      }
    }

    // Add circuit pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // Draw diagonal lines
    for (let i = -height; i < width; i += 60) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Add some circuit nodes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add dark overlay for text readability
    const textOverlay = ctx.createLinearGradient(0, height * 0.6, 0, height);
    textOverlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
    textOverlay.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = textOverlay;
    ctx.fillRect(0, 0, width, height);

    // Add category icon
    ctx.font = `${Math.min(width, height) * 0.15}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(icon, width / 2, height * 0.35);

    // Add title text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.min(width * 0.04, 18)}px Arial`;
    ctx.textAlign = 'center';
    
    // Word wrap for title
    const words = (title || 'Untitled').split(' ');
    const maxWidth = width * 0.85;
    let line = '';
    let y = height * 0.65;
    const lineHeight = Math.min(width * 0.05, 22);

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Add category badge
    ctx.fillStyle = colors.accent;
    ctx.font = `${Math.min(width * 0.025, 12)}px Arial`;
    ctx.textAlign = 'center';
    const categoryText = (safeCategory || 'default').toUpperCase().replace('-', ' ');
    const badgeWidth = ctx.measureText(categoryText).width + 20;
    const badgeHeight = 20;
    const badgeX = width / 2 - badgeWidth / 2;
    const badgeY = height * 0.85;
    
    // Badge background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
    
    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.fillText(categoryText, width / 2, badgeY + 14);

  }, [title, category, width, height]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-lg"
        style={{ maxWidth: width, maxHeight: height }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none" />
    </div>
  );
};

export default BlogImageGenerator; 
"use client";

import { useEffect, useRef } from 'react';

const BlogImageGenerator = ({ title, category, width = 400, height = 250, className = "" }) => {
  const canvasRef = useRef(null);

  // Category color mapping
  const categoryColors = {
    'technology': ['#e8c547', '#d4b445'],
    'ai': ['#8b5cf6', '#7c3aed'],
    'web-development': ['#06b6d4', '#0891b2'],
    'tutorial': ['#10b981', '#059669'],
    'programming': ['#f59e0b', '#d97706'],
    'default': ['#e8c547', '#d4b445']
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
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const colors = categoryColors[category] || categoryColors.default;
    const icon = categoryIcons[category] || categoryIcons.default;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add circuit pattern overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw grid pattern
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Add some circuit nodes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add category icon
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(icon, width / 2, height / 2 - 20);

    // Add title text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#0e1b12';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap for title
    const words = title.split(' ');
    const maxWidth = width - 40;
    let line = '';
    let y = height / 2 + 30;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[n] + ' ';
        y += 20;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Add category badge
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'rgba(14, 27, 18, 0.8)';
    ctx.fillRect(10, 10, 80, 25);
    ctx.fillStyle = colors[0];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.toUpperCase(), 50, 22.5);

  }, [title, category, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg ${className}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
};

export default BlogImageGenerator; 
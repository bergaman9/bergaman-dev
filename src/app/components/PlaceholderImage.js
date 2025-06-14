"use client";

import { useEffect, useRef } from 'react';

export default function PlaceholderImage({ 
  width = 400, 
  height = 300, 
  text = "Project Image", 
  category = "default",
  className = "" 
}) {
  const canvasRef = useRef(null);

  const categoryColors = {
    'web-development': {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA'
    },
    'bot-development': {
      primary: '#8B5CF6',
      secondary: '#6D28D9',
      accent: '#A78BFA'
    },
    'ai-ml': {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FCD34D'
    },
    'iot-embedded': {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#6EE7B7'
    },
    'full-stack-web': {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA'
    },
    'default': {
      primary: '#e8c547',
      secondary: '#d4b445',
      accent: '#f0d058'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const colors = categoryColors[category] || categoryColors.default;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add circuit pattern overlay
    ctx.strokeStyle = colors.accent + '20';
    ctx.lineWidth = 1;
    
    // Draw grid pattern
    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Add some circuit elements
    ctx.strokeStyle = colors.accent + '40';
    ctx.lineWidth = 2;
    
    // Draw some random circuit paths
    for (let i = 0; i < 5; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = Math.random() * width;
      const endY = Math.random() * height;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Add small circles at endpoints
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add category icon (using simple shapes instead of emoji)
    ctx.fillStyle = colors.accent;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 3;
    
    // Draw a simple tech icon based on category
    const centerX = width / 2;
    const centerY = height / 2 - 20;
    
    if (category.includes('web') || category.includes('development')) {
      // Draw a simple monitor/screen icon
      ctx.strokeRect(centerX - 20, centerY - 15, 40, 25);
      ctx.fillRect(centerX - 2, centerY + 12, 4, 8);
      ctx.fillRect(centerX - 10, centerY + 18, 20, 3);
    } else if (category.includes('bot')) {
      // Draw a simple robot head
      ctx.strokeRect(centerX - 15, centerY - 15, 30, 25);
      ctx.fillRect(centerX - 8, centerY - 8, 4, 4);
      ctx.fillRect(centerX + 4, centerY - 8, 4, 4);
      ctx.strokeRect(centerX - 10, centerY + 2, 20, 6);
    } else if (category.includes('ai') || category.includes('ml')) {
      // Draw a simple brain/neural network
      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
      ctx.stroke();
      // Add some internal lines
      ctx.beginPath();
      ctx.moveTo(centerX - 10, centerY - 5);
      ctx.lineTo(centerX + 10, centerY + 5);
      ctx.moveTo(centerX - 10, centerY + 5);
      ctx.lineTo(centerX + 10, centerY - 5);
      ctx.stroke();
    } else if (category.includes('iot') || category.includes('embedded')) {
      // Draw a simple chip/circuit
      ctx.strokeRect(centerX - 12, centerY - 12, 24, 24);
      // Add pins
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(centerX - 15, centerY - 6 + i * 6, 3, 2);
        ctx.fillRect(centerX + 12, centerY - 6 + i * 6, 3, 2);
      }
    } else {
      // Default: simple code brackets
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('{ }', centerX, centerY);
    }

    // Add text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Split text into multiple lines if needed
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > width - 40 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = 20;
    const startY = height / 2 + 30 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight);
    });

  }, [width, height, text, category]);

  return (
    <canvas 
      ref={canvasRef}
      className={`rounded-lg ${className}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
} 
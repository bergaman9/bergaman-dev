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
    
    // Get the actual display size
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Set canvas size to match display size for crisp rendering
    canvas.width = displayWidth * window.devicePixelRatio;
    canvas.height = displayHeight * window.devicePixelRatio;
    
    // Scale the context to match device pixel ratio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Use display dimensions for drawing
    const drawWidth = displayWidth;
    const drawHeight = displayHeight;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, drawWidth, drawHeight);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(1, colors.secondary);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, drawWidth, drawHeight);

    // Add circuit pattern overlay
    ctx.strokeStyle = colors.accent + '20';
    ctx.lineWidth = 1;
    
    // Draw grid pattern
    const gridSize = Math.max(20, Math.min(drawWidth, drawHeight) / 15);
    for (let x = 0; x <= drawWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, drawHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y <= drawHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(drawWidth, y);
      ctx.stroke();
    }

    // Add some circuit elements
    ctx.strokeStyle = colors.accent + '40';
    ctx.lineWidth = 2;
    
    // Draw some random circuit paths
    const numPaths = Math.max(3, Math.floor((drawWidth * drawHeight) / 10000));
    for (let i = 0; i < numPaths; i++) {
      const startX = Math.random() * drawWidth;
      const startY = Math.random() * drawHeight;
      const endX = Math.random() * drawWidth;
      const endY = Math.random() * drawHeight;
      
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

    // Add category icon
    ctx.fillStyle = colors.accent;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 3;
    
    // Draw a simple tech icon based on category
    const centerX = drawWidth / 2;
    const centerY = drawHeight / 2 - drawHeight * 0.1;
    const iconSize = Math.min(drawWidth, drawHeight) * 0.15;
    
    if (category.includes('web') || category.includes('development')) {
      // Draw a simple monitor/screen icon
      ctx.strokeRect(centerX - iconSize, centerY - iconSize * 0.6, iconSize * 2, iconSize * 1.2);
      ctx.fillRect(centerX - iconSize * 0.1, centerY + iconSize * 0.7, iconSize * 0.2, iconSize * 0.4);
      ctx.fillRect(centerX - iconSize * 0.5, centerY + iconSize * 1.0, iconSize, iconSize * 0.15);
    } else if (category.includes('bot')) {
      // Draw a simple robot head
      ctx.strokeRect(centerX - iconSize * 0.75, centerY - iconSize * 0.75, iconSize * 1.5, iconSize * 1.25);
      ctx.fillRect(centerX - iconSize * 0.4, centerY - iconSize * 0.4, iconSize * 0.2, iconSize * 0.2);
      ctx.fillRect(centerX + iconSize * 0.2, centerY - iconSize * 0.4, iconSize * 0.2, iconSize * 0.2);
      ctx.strokeRect(centerX - iconSize * 0.5, centerY + iconSize * 0.1, iconSize, iconSize * 0.3);
    } else if (category.includes('ai') || category.includes('ml')) {
      // Draw a simple brain/neural network
      ctx.beginPath();
      ctx.arc(centerX, centerY, iconSize * 0.9, 0, 2 * Math.PI);
      ctx.stroke();
      // Add some internal lines
      ctx.beginPath();
      ctx.moveTo(centerX - iconSize * 0.5, centerY - iconSize * 0.25);
      ctx.lineTo(centerX + iconSize * 0.5, centerY + iconSize * 0.25);
      ctx.moveTo(centerX - iconSize * 0.5, centerY + iconSize * 0.25);
      ctx.lineTo(centerX + iconSize * 0.5, centerY - iconSize * 0.25);
      ctx.stroke();
    } else if (category.includes('iot') || category.includes('embedded')) {
      // Draw a simple chip/circuit
      ctx.strokeRect(centerX - iconSize * 0.6, centerY - iconSize * 0.6, iconSize * 1.2, iconSize * 1.2);
      // Add pins
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(centerX - iconSize * 0.75, centerY - iconSize * 0.3 + i * iconSize * 0.3, iconSize * 0.15, iconSize * 0.1);
        ctx.fillRect(centerX + iconSize * 0.6, centerY - iconSize * 0.3 + i * iconSize * 0.3, iconSize * 0.15, iconSize * 0.1);
      }
    } else {
      // Default: simple code brackets
      const fontSize = Math.max(16, iconSize * 0.8);
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('{ }', centerX, centerY);
    }

    // Add text
    const fontSize = Math.max(12, Math.min(drawWidth, drawHeight) / 20);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if needed
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = drawWidth - 40;
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Draw text lines
    const lineHeight = fontSize * 1.2;
    const textStartY = drawHeight / 2 + drawHeight * 0.2;
    
    lines.forEach((line, index) => {
      const y = textStartY + (index - (lines.length - 1) / 2) * lineHeight;
      ctx.fillText(line, centerX, y);
    });

  }, [width, height, text, category]);

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
} 
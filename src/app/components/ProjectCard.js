"use client";

import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

export default function ProjectCard({ project }) {
  // Get placeholder image based on category
  const getPlaceholderImage = (category) => {
    const placeholders = {
      Web: '/images/portfolio/web-placeholder.svg',
      Mobile: '/images/portfolio/mobile-placeholder.svg',
      AI: '/images/portfolio/ai-placeholder.svg',
      Desktop: '/images/portfolio/desktop-placeholder.svg',
      Game: '/images/portfolio/game-placeholder.svg',
      Bot: '/images/portfolio/bot-placeholder.svg',
      IoT: '/images/portfolio/iot-placeholder.svg',
      'Graphic Design': '/images/portfolio/design-placeholder.svg',
      Brand: '/images/portfolio/brand-placeholder.svg',
      Other: '/images/portfolio/default.svg'
    };
    
    return placeholders[category] || '/images/portfolio/default.svg';
  };

  // Format date if available
  const formattedDate = project.createdAt 
    ? new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;

  return (
    <div className="bg-[#2e3d29]/20 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-[#2e3d29] to-[#0e1b12] flex items-center justify-center overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={getPlaceholderImage(project.category)}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold">
            {project.status || 'Active'}
          </span>
        </div>
        {project.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-[#0e1b12]/80 text-gray-300 rounded-full text-xs flex items-center gap-1">
              <i className={`fas ${
                project.category === 'Web' ? 'fa-globe' : 
                project.category === 'Mobile' ? 'fa-mobile-alt' :
                project.category === 'Desktop' ? 'fa-desktop' :
                project.category === 'Game' ? 'fa-gamepad' :
                project.category === 'AI' ? 'fa-brain' :
                project.category === 'IoT' ? 'fa-microchip' :
                project.category === 'Graphic Design' ? 'fa-palette' :
                project.category === 'Brand' ? 'fa-copyright' :
                project.category === 'Bot' ? 'fa-robot' :
                'fa-folder'
              }`}></i>
              <span>{project.category}</span>
            </span>
          </div>
        )}
        {project.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-[#e8c547]/80 text-[#0e1b12] rounded-full text-xs font-bold flex items-center gap-1">
              <i className="fas fa-star"></i>
              <span>Featured</span>
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold gradient-text mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed flex-grow">{project.description}</p>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-[#e8c547]">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 bg-[#0e1b12] border border-[#3e503e] rounded text-xs text-gray-400">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* Date */}
        {formattedDate && (
          <div className="text-xs text-gray-400 mb-3">
            <i className="far fa-calendar-alt mr-1"></i> {formattedDate}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {project.githubUrl && (
            <Button href={project.githubUrl} variant="secondary" size="sm" newTab>
              <i className="fab fa-github mr-1"></i>GitHub
            </Button>
          )}
          {project.demoUrl ? (
            <Button href={project.demoUrl} size="sm" newTab>
              <i className="fas fa-external-link-alt mr-1"></i>Demo
            </Button>
          ) : (
            <Button as="span" size="sm" className="bg-gray-600 text-gray-300 cursor-not-allowed">
              <i className="fas fa-external-link-alt mr-1"></i>Demo N/A
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 
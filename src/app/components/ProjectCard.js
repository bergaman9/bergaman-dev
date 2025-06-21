"use client";

import Link from 'next/link';
import Button from './Button';
import Tooltip from './Tooltip';
import SafeImage from './SafeImage';

export default function ProjectCard({ project, isAdmin = false, onEdit, onDelete }) {
  const placeholderImages = {
    'Web Development': '/images/portfolio/web-placeholder.svg',
    'Mobile App': '/images/portfolio/mobile-placeholder.svg',
    'AI/ML': '/images/portfolio/ai-placeholder.svg',
    'Design': '/images/portfolio/design-placeholder.svg',
    'Desktop App': '/images/portfolio/desktop-placeholder.svg',
    'Game Development': '/images/portfolio/game-placeholder.svg',
    'IoT': '/images/portfolio/iot-placeholder.svg',
    'Bot Development': '/images/portfolio/bot-placeholder.svg',
    'Branding': '/images/portfolio/brand-placeholder.svg',
    'default': '/images/portfolio/default.svg'
  };

  const getPlaceholderImage = (category) => {
    return placeholderImages[category] || placeholderImages.default;
  };

  const categoryIcons = {
    'Web Development': 'fas fa-globe',
    'Mobile App': 'fas fa-mobile-alt',
    'AI/ML': 'fas fa-brain',
    'Design': 'fas fa-palette',
    'Desktop App': 'fas fa-desktop',
    'Game Development': 'fas fa-gamepad',
    'IoT': 'fas fa-microchip',
    'Bot Development': 'fas fa-robot',
    'Branding': 'fas fa-trademark',
    'default': 'fas fa-folder'
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || categoryIcons.default;
  };

  const statusColors = {
    active: 'bg-green-500/80',
    completed: 'bg-[#e8c547]/80',
    in_progress: 'bg-yellow-500/80',
    planned: 'bg-gray-500/80'
  };

  const statusLabels = {
    active: 'Active',
    completed: 'Completed',
    in_progress: 'In Progress',
    planned: 'Planned'
  };

  // Format date if available
  const formattedDate = project.createdAt 
    ? new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : null;
    
  // Get extra technologies for tooltip
  const displayedTechs = project.technologies?.slice(0, 3) || [];
  const extraTechs = project.technologies?.slice(3) || [];
  const extraTechsString = extraTechs.join(', ');

  // Debug log for image path
  console.log('Project image path:', project.image, 'for project:', project.title);

  return (
    <div className="bg-[#0e1b12]/95 border border-[#2e3d29]/30 rounded-xl hover:border-[#e8c547]/30 transition-all duration-300 group h-full flex flex-col min-h-[400px]">
      {/* Image Container with fixed height */}
      <div className="relative h-48 overflow-hidden bg-[#0a1a0f] rounded-t-xl flex-shrink-0">
        <SafeImage
          src={project.image}
          fallbackSrc={getPlaceholderImage(project.category)}
          alt={project.title || 'Project image'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          showLoader={true}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12]/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm border border-white/20 ${statusColors[project.status] || statusColors.planned}`}>
            <i className={`mr-1 text-xs ${
              project.status === 'active' ? 'fas fa-circle' :
              project.status === 'completed' ? 'fas fa-check-circle' :
              project.status === 'in_progress' ? 'fas fa-clock' :
              'fas fa-pause-circle'
            }`}></i>
            {statusLabels[project.status] || 'Planned'}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e8c547]/90 text-black backdrop-blur-sm border border-[#e8c547]/50">
              <i className="fas fa-star mr-1 text-xs"></i>
              Featured
            </span>
          </div>
        )}

        {/* Category Icon */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="w-10 h-10 bg-[#0e1b12]/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#e8c547]/30">
            <i className={`${getCategoryIcon(project.category)} text-[#e8c547] text-sm`}></i>
          </div>
        </div>
      </div>

      {/* Content with flex layout for equal height cards */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[#e8c547] mb-1 line-clamp-2 leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center text-xs text-gray-400">
            <i className={`${getCategoryIcon(project.category)} mr-1`}></i>
            <span>{project.category}</span>
            {formattedDate && (
              <>
                <span className="mx-2">•</span>
                <i className="fas fa-calendar mr-1"></i>
                <span>{formattedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Description with flex-grow to push content to bottom */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-grow leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#2e3d29]/40 text-gray-300 border border-[#3e503e]/30 hover:bg-[#3e503e]/40 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <Tooltip content={`Additional technologies: ${project.technologies.slice(4).join(', ')}`} position="top" variant="dark">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#e8c547]/20 text-[#e8c547] cursor-help hover:bg-[#e8c547]/30 transition-colors border border-[#e8c547]/30">
                  +{project.technologies.length - 4}
                </span>
              </Tooltip>
            )}
          </div>
        )}

        {/* Links and Actions - Always at bottom */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#3e503e]/30">
          <div className="flex items-center space-x-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                title="View Live Demo"
              >
                <i className="fas fa-external-link-alt text-sm"></i>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                title="View Source Code"
              >
                <i className="fab fa-github text-sm"></i>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                title="View Demo"
              >
                <i className="fas fa-play-circle text-sm"></i>
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && !project.demoUrl && (
              <span className="text-gray-500 text-xs italic">
                No preview available
              </span>
            )}
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(project)}
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#e8c547] hover:bg-[#e8c547]/10 rounded-lg transition-all duration-300"
                title="Edit Project"
              >
                <i className="fas fa-edit text-sm"></i>
              </button>
              <button
                onClick={() => onDelete(project._id)}
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                title="Delete Project"
              >
                <i className="fas fa-trash text-sm"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
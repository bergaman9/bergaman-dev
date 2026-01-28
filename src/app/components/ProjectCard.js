"use client";

import Tooltip from './Tooltip';
import SafeImage from './SafeImage';

export default function ProjectCard({ project, isAdmin = false, onEdit, onDelete }) {
  // Temporary Overrides (Hotfix)
  const displayProject = { ...project };

  if (displayProject.title?.includes('Contro Bot')) {
    displayProject.liveUrl = 'https://www.contro.space';
  }

  if (displayProject.title?.includes('Ligroup')) {
    displayProject.status = 'completed';
    displayProject.liveUrl = null; // Mark inactive
  }

  // Smart Link Configuration
  const getLinkConfig = (url) => {
    if (!url) return null;

    // Contro Space specific
    if (url.includes('contro.space')) return {
      label: 'Dashboard',
      icon: 'fas fa-columns',
      color: 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20'
    };

    if (url.includes('github.com')) return {
      label: 'Source',
      icon: 'fab fa-github',
      color: 'bg-white/10 hover:bg-white/20 text-white'
    };

    if (url.includes('youtube.com') || url.includes('youtu.be')) return {
      label: 'Watch',
      icon: 'fab fa-youtube',
      color: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
    };

    if (url.includes('figma.com')) return {
      label: 'Design',
      icon: 'fab fa-figma',
      color: 'bg-purple-600 hover:bg-purple-500 text-white'
    };

    // Default
    return {
      label: 'Visit',
      icon: 'fas fa-external-link-alt',
      color: 'bg-[#e8c547] hover:bg-[#ffe066] text-black font-semibold shadow-lg shadow-[#e8c547]/20'
    };
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Web Development': 'from-blue-900/40 to-cyan-900/40',
      'Mobile App': 'from-purple-900/40 to-pink-900/40',
      'AI/ML': 'from-green-900/40 to-emerald-900/40',
      'Design': 'from-yellow-900/40 to-orange-900/40',
      'Desktop App': 'from-orange-900/40 to-red-900/40',
      'Game Development': 'from-pink-900/40 to-rose-900/40',
      'IoT': 'from-teal-900/40 to-cyan-900/40',
      'Bot Development': 'from-indigo-900/40 to-purple-900/40',
      'Branding': 'from-red-900/40 to-pink-900/40',
      'default': 'from-gray-900/40 to-slate-900/40'
    };
    return gradients[category] || gradients.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
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
    return icons[category] || icons.default;
  };

  const formattedDate = displayProject.createdAt
    ? new Date(displayProject.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  // Pre-calculate link configs
  const mainAction = displayProject.liveUrl ? { url: displayProject.liveUrl, ...getLinkConfig(displayProject.liveUrl) } :
    displayProject.demoUrl ? { url: displayProject.demoUrl, ...getLinkConfig(displayProject.demoUrl) } : null;

  const secondaryAction = displayProject.githubUrl ? { url: displayProject.githubUrl, ...getLinkConfig(displayProject.githubUrl) } : null;

  return (
    <div className="group h-full flex flex-col relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#e8c547]/10">

      {/* Dynamic Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${getCategoryGradient(displayProject.category)} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>

      {/* Glass Container */}
      <div className="relative h-full flex flex-col bg-[#0e1b12]/70 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-sm group-hover:border-[#e8c547]/30 transition-all duration-300">

        {/* Image Section */}
        <div className="relative h-56 overflow-hidden bg-[#050a07]">
          {displayProject.image ? (
            <SafeImage
              src={displayProject.image}
              alt={displayProject.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(displayProject.category)} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
              <i className={`${getCategoryIcon(displayProject.category)} text-6xl text-white/10 group-hover:text-white/20 transition-colors duration-300`}></i>
            </div>
          )}



          {/* Featured Ribbon - Icon Only */}
          {displayProject.featured && (
            <div className="absolute top-4 left-4 z-10">
              <Tooltip content="Featured Project" position="right">
                <div className="bg-black/60 backdrop-blur-md border border-[#e8c547]/30 text-[#e8c547] w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-black/20">
                  <i className="fas fa-star text-xs"></i>
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Category & Date */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <i className={`${getCategoryIcon(displayProject.category)} text-[#e8c547]`}></i>
              {displayProject.category}
            </span>
            {formattedDate && <span>{formattedDate}</span>}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e8c547] transition-colors line-clamp-1">
            {displayProject.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 flex-grow">
            {displayProject.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {displayProject.technologies?.slice(0, 3).map((tech, i) => (
              <span key={i} className="px-2 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded border border-white/5">
                {tech}
              </span>
            ))}
            {displayProject.technologies?.length > 3 && (
              <Tooltip
                content={displayProject.technologies.slice(3).join(', ')}
                position="top"
              >
                <span className="cursor-help px-2 py-1 text-xs font-medium text-gray-400 bg-transparent rounded border border-white/10 hover:border-white/30 hover:text-white transition-colors">
                  +{displayProject.technologies.length - 3}
                </span>
              </Tooltip>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-auto">
            {mainAction ? (
              <a
                href={mainAction.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 ${mainAction.color}`}
              >
                <i className={mainAction.icon}></i>
                <span className="font-semibold text-sm">{mainAction.label}</span>
              </a>
            ) : (
              <div className="flex-1 py-2.5 text-center text-sm text-gray-500 bg-white/5 rounded-xl border border-white/5 cursor-not-allowed">
                Coming Soon
              </div>
            )}

            {secondaryAction && (
              <a
                href={secondaryAction.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${secondaryAction.color} border border-white/5`}
              >
                <i className={`${secondaryAction.icon} text-lg`}></i>
              </a>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 ml-auto pl-2 border-l border-white/10">
                <button onClick={() => onEdit(displayProject)} className="text-gray-400 hover:text-[#e8c547]">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={() => onDelete(displayProject._id)} className="text-gray-400 hover:text-red-400">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
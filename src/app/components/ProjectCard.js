"use client";

import Tooltip from './Tooltip';
import SafeImage from './SafeImage';
import { getSafeHttpUrl, hostnameMatches, parseSafeHttpUrl } from '@/lib/urlSecurity';
import { usePreferences } from './PreferencesProvider';

export default function ProjectCard({ project, isAdmin = false, onEdit, onDelete, compact = false }) {
  const { locale } = usePreferences();
  // Temporary Overrides (Hotfix)
  const translatedProject = locale === 'tr' ? (project?.translations?.tr || project?.translation?.tr || {}) : {};
  const displayProject = { ...project, ...translatedProject };
  if (locale === 'tr' && !translatedProject.description) {
    displayProject.description = ({
      'Contro Bot': 'Pandemi döneminde geliştirilen; moderasyon, eğlence komutları ve kapsamlı ekonomi sistemi sunan çok amaçlı Discord botu.',
      'Contro Dashboard': 'Contro bot örneklerini, sunucu yapılandırmalarını ve analizleri yönetmek için geliştirilen gelişmiş kontrol paneli.',
      'Ligroup': 'Bot geliştirmeden kapsamlı web çözümlerine geçişimi temsil eden ilk full-stack web projem.',
      'Indoor Air Quality Monitoring': 'Arduino Uno R4 WiFi ile kablosuz veri aktarımı ve gerçek zamanlı hava kalitesi takibi sağlayan IoT çözümü.',
      'RVC & Stable Diffusion Projects': 'Üretken yapay zekânın yükseliş döneminde ses dönüştürme ve görsel üretimini araştıran deneysel yapay zekâ projeleri.',
      'Timekeepers Bot': 'Kullanıcı destek taleplerini yönetmek ve sorunları takip etmek için geliştirilen gelişmiş destek talebi botu.',
      'Stardust RP Bot': 'Envanter sistemleriyle rol yapma sunucuları için özel olarak tasarlanmış Discord botu.',
      'Bergaman Portfolio': 'Modern tasarım ve etkileşimli öğelerle Next.js kullanılarak geliştirilen kişisel portföy sitesi.'
    })[displayProject.title] || displayProject.description;
  }

  if (displayProject.title?.includes('Contro Bot')) {
    displayProject.liveUrl = 'https://www.contro.space';
  }

  if (displayProject.title?.includes('Ligroup')) {
    displayProject.status = 'completed';
    displayProject.liveUrl = null; // Mark inactive
  }

  // Smart Link Configuration
  const getLinkConfig = (url) => {
    const parsedUrl = parseSafeHttpUrl(url);
    if (!parsedUrl) return null;

    // Contro Space specific
    if (hostnameMatches(parsedUrl, 'contro.space')) return {
      label: locale === 'tr' ? 'Panel' : 'Dashboard',
      icon: 'fas fa-columns',
      color: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
    };

    if (hostnameMatches(parsedUrl, 'github.com')) return {
      label: locale === 'tr' ? 'Kaynak' : 'Source',
      icon: 'fab fa-github',
      color: 'bg-white/10 hover:bg-white/20 text-white'
    };

    if (hostnameMatches(parsedUrl, 'youtube.com') || hostnameMatches(parsedUrl, 'youtu.be')) return {
      label: locale === 'tr' ? 'İzle' : 'Watch',
      icon: 'fab fa-youtube',
      color: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
    };

    if (hostnameMatches(parsedUrl, 'figma.com')) return {
      label: locale === 'tr' ? 'Tasarım' : 'Design',
      icon: 'fab fa-figma',
      color: 'bg-purple-600 hover:bg-purple-500 text-white'
    };

    // Default
    return {
      label: locale === 'tr' ? 'Ziyaret Et' : 'Visit',
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
    ? new Date(displayProject.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long' })
    : null;

  // Pre-calculate link configs
  const safeLiveUrl = getSafeHttpUrl(displayProject.liveUrl);
  const safeDemoUrl = getSafeHttpUrl(displayProject.demoUrl);
  const safeGithubUrl = getSafeHttpUrl(displayProject.githubUrl);
  const mainAction = safeLiveUrl ? { url: safeLiveUrl, ...getLinkConfig(safeLiveUrl) } :
    safeDemoUrl ? { url: safeDemoUrl, ...getLinkConfig(safeDemoUrl) } : null;

  const secondaryAction = safeGithubUrl ? { url: safeGithubUrl, ...getLinkConfig(safeGithubUrl) } : null;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl transition-[border-color,box-shadow] duration-300 hover:shadow-xl hover:shadow-[#e8c547]/5">

      {/* Dynamic Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${getCategoryGradient(displayProject.category)} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}></div>

      {/* Glass Container */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#3e503e]/40 bg-[#2e3d29]/30 shadow-sm transition-colors duration-300 group-hover:border-[#e8c547]/40">

        {/* Image Section */}
        <div className={`relative overflow-hidden bg-[#050a07] ${compact ? 'h-40' : 'h-52'}`}>
          {displayProject.image ? (
            <SafeImage
              src={displayProject.image}
              alt={displayProject.title}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
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
              <Tooltip content={locale === 'tr' ? 'Öne Çıkan Proje' : 'Featured Project'} position="right">
                <div className="bg-black/60 backdrop-blur-md border border-[#e8c547]/30 text-[#e8c547] w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-black/20">
                  <i className="fas fa-star text-xs"></i>
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
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
          <p className={`flex-grow text-sm leading-relaxed text-gray-400 ${compact ? 'mb-4 line-clamp-2' : 'mb-5 line-clamp-3'}`}>
            {displayProject.description}
          </p>

          {/* Technologies */}
          <div className={`flex flex-wrap gap-2 ${compact ? 'mb-4' : 'mb-5'}`}>
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
                className={`theme-dark-surface min-h-11 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 ${mainAction.color}`}
              >
                <i className={mainAction.icon}></i>
                <span className="font-semibold text-sm">{mainAction.label}</span>
              </a>
            ) : (
              <div className="flex-1 py-2.5 text-center text-sm text-gray-500 bg-white/5 rounded-xl border border-white/5 cursor-not-allowed">
                {locale === 'tr' ? 'Yakında' : 'Coming Soon'}
              </div>
            )}

            {secondaryAction && (
              <a
                href={secondaryAction.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={locale === 'tr' ? 'Kaynak kodu görüntüle' : 'View source code'}
                className={`theme-dark-surface w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ${secondaryAction.color} border border-white/5`}
              >
                <i className={`${secondaryAction.icon} text-lg`}></i>
              </a>
            )}

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 ml-auto pl-2 border-l border-white/10">
                <button aria-label={locale === 'tr' ? 'Projeyi düzenle' : 'Edit project'} onClick={() => onEdit(displayProject)} className="min-h-11 min-w-11 text-gray-400 hover:text-[#e8c547]">
                  <i className="fas fa-edit"></i>
                </button>
                <button aria-label={locale === 'tr' ? 'Projeyi sil' : 'Delete project'} onClick={() => onDelete(displayProject._id)} className="min-h-11 min-w-11 text-gray-400 hover:text-red-400">
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

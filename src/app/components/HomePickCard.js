"use client";

import Link from 'next/link';
import SafeImage from './SafeImage';

// Uniform, equal-height card used for the home "My Picks" teaser only.
// The full /picks page uses the richer per-category RecommendationCard.
const CATEGORY_META = {
  movie: { label: 'Movie', icon: 'fas fa-film' },
  series: { label: 'TV Series', icon: 'fas fa-tv' },
  tv: { label: 'TV Series', icon: 'fas fa-tv' },
  game: { label: 'Game', icon: 'fas fa-gamepad' },
  book: { label: 'Book', icon: 'fas fa-book' },
  music: { label: 'Music', icon: 'fas fa-music' },
  link: { label: 'Link', icon: 'fas fa-link' },
};

const PLACEHOLDER = {
  game: '/images/portfolio/game-placeholder.svg',
  link: '/images/portfolio/web-placeholder.svg',
};

export default function HomePickCard({ recommendation: rec }) {
  if (!rec) return null;

  const category = (rec.category || 'link').toLowerCase();
  const meta = CATEGORY_META[category] || CATEGORY_META.link;
  const placeholder = PLACEHOLDER[category] || '/images/portfolio/default.svg';
  const href = rec.link || rec.url || '/picks';
  const isExternal = /^https?:\/\//.test(href);
  const subtitle = rec.author || rec.developer || rec.director || rec.linkType || null;
  const blurb = rec.recommendation || rec.description || '';

  const CardInner = (
    <div className="group h-full flex flex-col bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#e8c547]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e8c547]/10">
      {/* Fixed-height media keeps every card the same size regardless of category */}
      <div className="relative h-40 shrink-0 bg-[#0e1b12] overflow-hidden">
        <SafeImage
          src={rec.image || placeholder}
          fallbackSrc={placeholder}
          alt={rec.title || meta.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12]/80 via-transparent to-transparent pointer-events-none"></div>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-[#e8c547]/30 text-[#e8c547] text-xs font-medium">
          <i className={`${meta.icon} text-[10px]`}></i> {meta.label}
        </span>
        {rec.rating && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e8c547] text-[#0e1b12] text-xs font-bold">
            <i className="fas fa-star text-[10px]"></i> {rec.rating}/10
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-5">
        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#e8c547] transition-colors">
          {rec.title}
        </h3>
        {subtitle && (
          <p className="text-sm text-[#e8c547]/80 mt-0.5 line-clamp-1">{subtitle}</p>
        )}
        {blurb && (
          <p className="text-sm text-gray-400 leading-relaxed mt-2 line-clamp-2">{blurb}</p>
        )}
        <div className="mt-auto pt-4 flex items-center text-sm text-gray-500 group-hover:text-[#e8c547] transition-colors">
          <span>{isExternal ? 'Visit' : 'View pick'}</span>
          <i className={`${isExternal ? 'fas fa-external-link-alt' : 'fas fa-arrow-right'} ml-2 text-xs`}></i>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded-xl">
        {CardInner}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60 rounded-xl">
      {CardInner}
    </Link>
  );
}

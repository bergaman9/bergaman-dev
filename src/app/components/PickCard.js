"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import SafeImage from './SafeImage';

// Unified, equal-height card for the Picks page and the home "My Picks" teaser.
// Every category renders the same shell with a vertical 2:3 media area so cards
// line up in a clean grid regardless of content type. Links never show a rating.

const CATEGORY_META = {
  movie: { label: 'Movie', icon: 'fas fa-film', accent: 'text-rose-300', chip: 'bg-rose-500/15 border-rose-400/30' },
  series: { label: 'TV Series', icon: 'fas fa-tv', accent: 'text-violet-300', chip: 'bg-violet-500/15 border-violet-400/30' },
  tv: { label: 'TV Series', icon: 'fas fa-tv', accent: 'text-violet-300', chip: 'bg-violet-500/15 border-violet-400/30' },
  game: { label: 'Game', icon: 'fas fa-gamepad', accent: 'text-emerald-300', chip: 'bg-emerald-500/15 border-emerald-400/30' },
  book: { label: 'Book', icon: 'fas fa-book', accent: 'text-amber-300', chip: 'bg-amber-500/15 border-amber-400/30' },
  music: { label: 'Music', icon: 'fas fa-music', accent: 'text-green-300', chip: 'bg-green-500/15 border-green-400/30' },
  link: { label: 'Link', icon: 'fas fa-link', accent: 'text-cyan-300', chip: 'bg-cyan-500/15 border-cyan-400/30' },
};

const PLACEHOLDER = {
  game: '/images/portfolio/game-placeholder.svg',
  link: '/images/portfolio/web-placeholder.svg',
};

function metaFor(category) {
  return CATEGORY_META[category] || CATEGORY_META.link;
}

function domainFromUrl(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export default function PickCard({ recommendation: rec, variant = 'grid' }) {
  const category = (rec?.category || 'link').toLowerCase();
  const meta = metaFor(category);
  const isLink = category === 'link';
  const href = rec?.link || rec?.url || '/picks';
  const isExternal = /^https?:\/\//.test(href);
  const domain = useMemo(() => domainFromUrl(rec?.url || rec?.link), [rec]);
  const placeholder = PLACEHOLDER[category] || '/images/portfolio/default.svg';
  const subtitle = rec?.author || rec?.developer || rec?.studio || rec?.director || rec?.artist || domain || rec?.linkType || null;
  const blurb = rec?.recommendation || rec?.description || '';
  // Links are bookmarks, not rated items — no score badge for them.
  const showRating = !isLink && rec?.rating;

  if (!rec) return null;

  // Media block shared by both variants. `frame` controls the aspect wrapper.
  const Media = ({ frame }) => (
    <div className={`relative ${frame} shrink-0 overflow-hidden bg-[#0a140d]`}>
      {isLink ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#13202a] to-[#0a140d]">
          {domain ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
              alt=""
              className="w-12 h-12 rounded-lg"
              loading="lazy"
            />
          ) : (
            <i className={`${meta.icon} text-4xl ${meta.accent} opacity-70`}></i>
          )}
        </div>
      ) : (
        <SafeImage
          src={rec.image || placeholder}
          fallbackSrc={placeholder}
          alt={rec.title || meta.label}
          fill
          sizes={variant === 'grid' ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw' : '120px'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12]/70 via-transparent to-transparent pointer-events-none"></div>
      <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/65 backdrop-blur-sm border text-[11px] font-medium ${meta.chip} ${meta.accent}`}>
        <i className={`${meta.icon} text-[10px]`}></i> {meta.label}
      </span>
      {showRating && (
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#e8c547] text-[#0e1b12] text-[11px] font-bold">
          <i className="fas fa-star text-[10px]"></i> {rec.rating}/10
        </span>
      )}
    </div>
  );

  const shell =
    'group h-full bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#e8c547]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e8c547]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60';

  // ---- List variant: poster thumbnail kept at true 2:3 so covers never distort
  if (variant === 'list') {
    const inner = (
      <div className={`${shell} flex`}>
        <Media frame="w-20 sm:w-24 aspect-[2/3]" />
        <div className="flex-1 min-w-0 flex flex-col p-4">
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-[#e8c547] transition-colors">{rec.title}</h3>
          {subtitle && <p className={`text-xs ${meta.accent} mt-0.5 line-clamp-1`}>{subtitle}</p>}
          {blurb && <p className="text-sm text-gray-400 leading-relaxed mt-1.5 line-clamp-2">{blurb}</p>}
          <div className="mt-auto pt-2 flex items-center text-xs text-gray-500 group-hover:text-[#e8c547] transition-colors">
            <span>{isExternal ? 'Visit' : 'View pick'}</span>
            <i className={`${isExternal ? 'fas fa-external-link-alt' : 'fas fa-arrow-right'} ml-2 text-[10px]`}></i>
          </div>
        </div>
      </div>
    );
    return <Wrapper href={href} isExternal={isExternal}>{inner}</Wrapper>;
  }

  // ---- Grid variant: vertical 2:3 cover, equal heights via flex + clamps
  const inner = (
    <div className={`${shell} flex flex-col`}>
      <Media frame="aspect-[2/3]" />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-[#e8c547] transition-colors">{rec.title}</h3>
        {subtitle && <p className={`text-xs ${meta.accent} mt-0.5 line-clamp-1`}>{subtitle}</p>}
        {blurb && <p className="text-sm text-gray-400 leading-relaxed mt-2 line-clamp-2">{blurb}</p>}
        <div className="mt-auto pt-3 flex items-center text-xs text-gray-500 group-hover:text-[#e8c547] transition-colors">
          <span>{isExternal ? 'Visit' : 'View pick'}</span>
          <i className={`${isExternal ? 'fas fa-external-link-alt' : 'fas fa-arrow-right'} ml-2 text-[10px]`}></i>
        </div>
      </div>
    </div>
  );
  return <Wrapper href={href} isExternal={isExternal}>{inner}</Wrapper>;
}

function Wrapper({ href, isExternal, children }) {
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60">
      {children}
    </Link>
  );
}

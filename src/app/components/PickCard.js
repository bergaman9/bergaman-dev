"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import SafeImage from './SafeImage';

// Unified, equal-height card for the Picks page and the home "My Picks" teaser.
// Visual categories (movie/game/book/series) use a vertical 2:3 cover; music
// uses a square album tile and links use a branded favicon panel — all inside
// the same frame so cards line up. Only items with a real destination link.

const CATEGORY_META = {
  movie: { label: 'Movie', icon: 'fas fa-film', accent: 'text-rose-300', chip: 'bg-rose-500/15 border-rose-400/30' },
  series: { label: 'TV Series', icon: 'fas fa-tv', accent: 'text-violet-300', chip: 'bg-violet-500/15 border-violet-400/30' },
  tv: { label: 'TV Series', icon: 'fas fa-tv', accent: 'text-violet-300', chip: 'bg-violet-500/15 border-violet-400/30' },
  game: { label: 'Game', icon: 'fas fa-gamepad', accent: 'text-emerald-300', chip: 'bg-emerald-500/15 border-emerald-400/30' },
  book: { label: 'Book', icon: 'fas fa-book', accent: 'text-amber-300', chip: 'bg-amber-500/15 border-amber-400/30' },
  music: { label: 'Music', icon: 'fas fa-music', accent: 'text-green-300', chip: 'bg-green-500/15 border-green-400/30' },
  link: { label: 'Link', icon: 'fas fa-link', accent: 'text-cyan-300', chip: 'bg-cyan-500/15 border-cyan-400/30' },
};

const PLACEHOLDER = { game: '/images/portfolio/game-placeholder.svg' };

const isUrlLike = (s) => typeof s === 'string' && /^https?:\/\//.test(s.trim());

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
  const isMusic = category === 'music';

  const destination = rec?.link || rec?.url || null;
  const isExternal = isUrlLike(destination);
  const hasLink = !!destination;
  const domain = useMemo(() => domainFromUrl(rec?.url || rec?.link), [rec]);
  const placeholder = PLACEHOLDER[category] || '/images/portfolio/default.svg';

  // Avoid showing a raw URL as the title/subtitle/blurb (some link/music picks
  // store the URL in those fields).
  const displayTitle = isUrlLike(rec?.title)
    ? (rec?.artist || rec?.author || (isMusic ? 'Music pick' : domain) || meta.label)
    : (rec?.title || meta.label);
  const rawSubtitle = rec?.author || rec?.developer || rec?.studio || rec?.director || rec?.artist || (isMusic ? 'Spotify' : domain) || rec?.linkType || null;
  const subtitle = isUrlLike(rawSubtitle) ? null : rawSubtitle;
  const rawBlurb = rec?.recommendation || rec?.description || '';
  const blurb = isUrlLike(rawBlurb) ? '' : rawBlurb;

  // Links are bookmarks, not rated items — no score badge for them.
  const showRating = !isLink && rec?.rating;
  const cta = isMusic ? 'Listen' : 'Visit';

  if (!rec) return null;

  // Shared media block. `frame` controls the aspect wrapper.
  const Media = ({ frame }) => (
    <div className={`relative ${frame} shrink-0 overflow-hidden bg-[#0a140d]`}>
      {isLink ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#13202a] to-[#0a140d]">
          {domain ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt="" className="h-12 w-12 rounded-lg" loading="lazy" draggable={false} />
          ) : (
            <i className={`${meta.icon} text-4xl ${meta.accent} opacity-70`}></i>
          )}
        </div>
      ) : isMusic ? (
        // Square 1:1 album tile centred in the frame, music-themed background.
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/40 via-[#0d1f16] to-[#0a140d] p-6">
          <div className="relative aspect-square w-2/3 overflow-hidden rounded-xl border border-emerald-400/20 bg-black/40 shadow-lg">
            {rec.image ? (
              <SafeImage src={rec.image} fallbackSrc={placeholder} alt={displayTitle} fill sizes="180px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <i className="fas fa-compact-disc text-4xl text-emerald-300/70"></i>
              </div>
            )}
          </div>
        </div>
      ) : (
        <SafeImage
          src={rec.image || placeholder}
          fallbackSrc={placeholder}
          alt={displayTitle}
          fill
          sizes={variant === 'grid' ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw' : '120px'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          draggable={false}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e1b12]/70 via-transparent to-transparent"></div>
      <span className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border bg-black/65 px-2 py-1 text-[11px] font-medium backdrop-blur-sm ${meta.chip} ${meta.accent}`}>
        <i className={`${meta.icon} text-[10px]`}></i> {meta.label}
      </span>
      {showRating && (
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-[#e8c547] px-2 py-1 text-[11px] font-bold text-[#0e1b12]">
          <i className="fas fa-star text-[10px]"></i> {rec.rating}/10
        </span>
      )}
    </div>
  );

  const shell =
    'group h-full bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#e8c547]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60' +
    (hasLink ? ' hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e8c547]/10' : '');

  // Footer: a CTA only when the card actually links somewhere external.
  const Footer = () =>
    isExternal ? (
      <div className="mt-auto pt-3 flex items-center text-xs text-gray-500 group-hover:text-[#e8c547] transition-colors">
        <span>{cta}</span>
        <i className="fas fa-external-link-alt ml-2 text-[10px]"></i>
      </div>
    ) : null;

  const Body = ({ list }) => (
    <div className={`flex flex-1 flex-col ${list ? 'min-w-0 p-4' : 'p-4'}`}>
      <h3 className={`font-bold text-white line-clamp-1 transition-colors ${hasLink ? 'group-hover:text-[#e8c547]' : ''} ${list ? 'text-base' : 'text-base'}`}>{displayTitle}</h3>
      {subtitle && <p className={`text-xs ${meta.accent} mt-0.5 line-clamp-1`}>{subtitle}</p>}
      {blurb && <p className={`text-sm text-gray-400 leading-relaxed line-clamp-2 ${list ? 'mt-1.5' : 'mt-2'}`}>{blurb}</p>}
      <Footer />
    </div>
  );

  const inner =
    variant === 'list' ? (
      <div className={`${shell} flex`}>
        <Media frame="w-20 sm:w-24 aspect-[2/3]" />
        <Body list />
      </div>
    ) : (
      <div className={`${shell} flex flex-col`}>
        <Media frame="aspect-[2/3]" />
        <Body />
      </div>
    );

  // Only wrap in a link when there is a real destination; otherwise it is a
  // plain showcase card (no silly "view pick" that goes nowhere).
  if (isExternal) {
    return (
      <a href={destination} target="_blank" rel="noopener noreferrer" className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60">
        {inner}
      </a>
    );
  }
  if (hasLink) {
    return (
      <Link href={destination} className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8c547]/60">
        {inner}
      </Link>
    );
  }
  return inner;
}

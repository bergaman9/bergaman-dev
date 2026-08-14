"use client";

import { useMemo, useState } from 'react';
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

// Generic placeholder art we should NOT treat as a real cover (the "PROJECT"
// cube etc.) — these look wrong inside a music/album tile.
const PLACEHOLDER_RE = /(default|web-placeholder|game-placeholder|placeholder)\.svg($|\?)/i;

const isUrlLike = (s) => typeof s === 'string' && /^https?:\/\//.test(s.trim());
const hasRealImage = (img) => !!img && !PLACEHOLDER_RE.test(img);

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
  const [coverFailed, setCoverFailed] = useState(false);
  const [musicArtFailed, setMusicArtFailed] = useState(false);

  const destination = rec?.link || rec?.url || null;
  const isExternal = isUrlLike(destination);
  const hasLink = !!destination;
  const domain = useMemo(() => domainFromUrl(rec?.url || rec?.link), [rec]);

  const spotify = isMusic ? { title: rec?.spotifyTitle, thumbnail: rec?.spotifyThumbnail } : null;

  // Real album art from Spotify oEmbed when available.
  const musicArt = isMusic ? (hasRealImage(rec?.image) ? rec.image : (spotify?.thumbnail || null)) : null;

  // Avoid showing a raw URL as the title/subtitle/blurb (some link/music picks
  // store the URL in those fields). Prefer the Spotify track title for music.
  const displayTitle = isMusic && spotify?.title
    ? spotify.title
    : isUrlLike(rec?.title)
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
  const renderMedia = (frame) => (
    <div className={`relative ${frame} shrink-0 overflow-hidden bg-[#0a140d]`}>
      {isLink ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#13202a] to-[#0a140d] p-6 text-center">
          {domain ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-2xl font-bold uppercase text-cyan-200 shadow-lg">
                {domain.charAt(0)}
              </div>
              <span className="max-w-full truncate text-sm font-semibold text-cyan-100/80">{domain}</span>
            </>
          ) : (
            <i className={`${meta.icon} text-4xl ${meta.accent} opacity-70`}></i>
          )}
        </div>
      ) : isMusic ? (
        // Music: real album art as a 1:1 tile when available, otherwise a
        // Spotify-themed vinyl so it never falls back to the "PROJECT" cube.
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1DB954]/20 via-[#0d1f16] to-[#0a140d] p-6">
          {musicArt && !musicArtFailed ? (
            // Spotify CDN hosts vary (i.scdn.co, *.spotifycdn.com); a plain img
            // keeps it simple and only needs the CSP img-src allowance.
            <div className="relative aspect-square w-2/3 overflow-hidden rounded-xl border border-emerald-400/20 bg-black/40 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={musicArt} alt={displayTitle} className="h-full w-full object-cover" loading="lazy" draggable={false} onError={() => setMusicArtFailed(true)} />
            </div>
          ) : (
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-emerald-400/20 bg-gradient-to-br from-zinc-800 to-black shadow-xl">
              <div className="absolute inset-3 rounded-full border border-white/5"></div>
              <div className="absolute inset-6 rounded-full border border-white/5"></div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1DB954]/25">
                <i className="fab fa-spotify text-xl text-[#1DB954]"></i>
              </div>
            </div>
          )}
        </div>
      ) : hasRealImage(rec.image) && !coverFailed ? (
        <SafeImage
          src={rec.image}
          fallbackSrc={rec.image}
          alt={displayTitle}
          fill
          sizes={variant === 'grid' ? '(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px' : '120px'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setCoverFailed(true)}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#14261b] via-[#0d1f16] to-[#08110b] p-6 text-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e8c547]/25 bg-[#e8c547]/10 ${meta.accent}`}>
            <i className={`${meta.icon} text-3xl`}></i>
          </div>
          <span className="line-clamp-2 text-sm font-semibold text-gray-200">{displayTitle}</span>
        </div>
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
  const renderFooter = () =>
    isExternal ? (
      <div className="mt-auto pt-3 flex items-center text-xs text-gray-500 group-hover:text-[#e8c547] transition-colors">
        <span>{cta}</span>
        <i className="fas fa-external-link-alt ml-2 text-[10px]"></i>
      </div>
    ) : null;

  const renderBody = (list = false) => (
    <div className={`flex flex-1 flex-col ${list ? 'min-w-0 p-4' : 'p-4'}`}>
      <h3 className={`font-bold text-white line-clamp-1 transition-colors ${hasLink ? 'group-hover:text-[#e8c547]' : ''} ${list ? 'text-base' : 'text-base'}`}>{displayTitle}</h3>
      {subtitle && <p className={`text-xs ${meta.accent} mt-0.5 line-clamp-1`}>{subtitle}</p>}
      {blurb && <p className={`text-sm text-gray-400 leading-relaxed line-clamp-2 ${list ? 'mt-1.5' : 'mt-2'}`}>{blurb}</p>}
      {renderFooter()}
    </div>
  );

  const inner =
    variant === 'list' ? (
      <div className={`${shell} flex`}>
        {renderMedia('w-20 sm:w-24 aspect-[2/3]')}
        {renderBody(true)}
      </div>
    ) : (
      <div className={`${shell} flex flex-col`}>
        {renderMedia('aspect-[2/3]')}
        {renderBody()}
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

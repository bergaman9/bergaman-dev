"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

// Get placeholder image for a category
const getPlaceholderImage = (category) => {
  const placeholders = {
    movie: '/images/portfolio/default.svg',
    book: '/images/portfolio/default.svg',
    game: '/images/portfolio/game-placeholder.svg',
    music: '/images/portfolio/default.svg',
    series: '/images/portfolio/default.svg',
    link: '/images/portfolio/web-placeholder.svg',
  };
  return placeholders[category.toLowerCase()] || '/images/portfolio/default.svg';
};

// Category configurations with proper capitalization
const categoryConfig = {
  movie: {
    name: 'Movie',
    icon: 'fas fa-film',
    color: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-500/30 hover:border-red-400/50',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/10'
  },
  game: {
    name: 'Game',
    icon: 'fas fa-gamepad',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30 hover:border-purple-400/50',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  book: {
    name: 'Book',
    icon: 'fas fa-book',
    color: 'from-amber-500/20 to-amber-600/20',
    borderColor: 'border-amber-500/30 hover:border-amber-400/50',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  music: {
    name: 'Music',
    icon: 'fas fa-music',
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/30 hover:border-green-400/50',
    textColor: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
  series: {
    name: 'Series',
    icon: 'fas fa-tv',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30 hover:border-blue-400/50',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  link: {
    name: 'Link',
    icon: 'fas fa-link',
    color: 'from-cyan-500/20 to-cyan-600/20',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400/50',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10'
  },
};

// Extract Spotify ID from URL
const getSpotifyEmbedId = (url) => {
  if (!url) return null;

  const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (trackMatch) return { type: 'track', id: trackMatch[1] };

  const albumMatch = url.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
  if (albumMatch) return { type: 'album', id: albumMatch[1] };

  const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (playlistMatch) return { type: 'playlist', id: playlistMatch[1] };

  return null;
};

// Extract domain from URL
const getDomainFromUrl = (url) => {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return null;
  }
};

// Book Card Component - Vintage Library Style
const BookCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? getPlaceholderImage('book') : recommendation.image;
  const config = categoryConfig.book;

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-amber-500/20`}>
      <div className="flex flex-col sm:flex-row h-full">
        {/* Book Cover */}
        <div className="relative sm:w-1/3 h-48 sm:h-auto bg-gradient-to-br from-amber-900/20 to-amber-800/20">
          <div className="absolute inset-0 bg-[url('/images/paper-texture.png')] opacity-10"></div>
          <Image
            src={imageSrc}
            alt={recommendation.title}
            fill
            className="object-contain p-4"
            onError={() => setImageError(true)}
          />
          {/* Bookmark */}
          <div className="absolute top-0 right-4 w-8 h-12 bg-red-600 shadow-lg">
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[8px] border-b-red-800"></div>
          </div>
        </div>

        {/* Content */}
        <div className="sm:w-2/3 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className={`px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-medium flex items-center gap-1`}>
              <i className={config.icon}></i> {config.name}
            </span>
            {recommendation.rating && (
              <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold flex items-center gap-1">
                <i className="fas fa-star"></i> {recommendation.rating}/10
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2 font-serif">{recommendation.title}</h3>

          {recommendation.author && (
            <p className={`${config.textColor} text-sm mb-1 flex items-center gap-2`}>
              <i className="fas fa-feather-alt text-xs"></i>
              <span className="font-medium">{recommendation.author}</span>
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
            {recommendation.year && (
              <span className="flex items-center gap-1">
                <i className="fas fa-calendar text-xs"></i> {recommendation.year}
              </span>
            )}
            {recommendation.genre && (
              <span className="flex items-center gap-1">
                <i className="fas fa-bookmark text-xs"></i> {recommendation.genre}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{recommendation.recommendation}</p>

          {isAdmin && (
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(recommendation, e);
                }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => onDelete(recommendation._id)}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Game Card Component - Epic Gaming Style
const GameCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? getPlaceholderImage('game') : recommendation.image;
  const config = categoryConfig.game;

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-purple-500/20`}>
      {/* Game Cover with Overlay */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageSrc}
          alt={recommendation.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12] via-[#0e1b12]/50 to-transparent"></div>

        {/* Game UI Elements */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className={`px-3 py-1 ${config.bgColor} ${config.textColor} rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-sm`}>
            <i className={config.icon}></i> {config.name}
          </span>
          {recommendation.rating && (
            <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-lg text-xs font-bold flex items-center gap-1">
              <i className="fas fa-star"></i> {recommendation.rating}/10
            </span>
          )}
        </div>

        {/* Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{recommendation.title}</h3>
          {recommendation.developer && (
            <p className={`${config.textColor} text-sm font-medium drop-shadow-lg`}>
              <i className="fas fa-code text-xs"></i> {recommendation.developer}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          {recommendation.year && (
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar-alt text-xs"></i> {recommendation.year}
            </span>
          )}
          {recommendation.genre && (
            <span className="flex items-center gap-1">
              <i className="fas fa-dice text-xs"></i> {recommendation.genre}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{recommendation.recommendation}</p>

        {/* Gaming Platform Icons */}
        <div className="flex gap-3 mt-3 text-gray-500">
          <i className="fab fa-steam text-lg hover:text-gray-300 transition-colors"></i>
          <i className="fab fa-playstation text-lg hover:text-blue-400 transition-colors"></i>
          <i className="fab fa-xbox text-lg hover:text-green-400 transition-colors"></i>
        </div>

        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recommendation, e);
              }}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(recommendation._id)}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Movie Card Component - Cinematic Style
const MovieCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? getPlaceholderImage('movie') : recommendation.image;
  const config = categoryConfig.movie;

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-red-500/20`}>
      {/* Movie Poster */}
      <div className="relative h-80 overflow-hidden bg-black">
        <Image
          src={imageSrc}
          alt={recommendation.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12] via-transparent to-transparent"></div>

        {/* Film Strip Effect */}
        <div className="absolute left-0 right-0 top-0 h-6 bg-black flex items-center">
          <div className="flex gap-2 px-2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-3 h-4 bg-gray-800 rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* Rating Badge */}
        {recommendation.rating && (
          <div className="absolute top-10 right-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e8c547] blur-lg opacity-50"></div>
              <span className="relative px-4 py-2 bg-[#e8c547] text-[#0e1b12] rounded-full text-sm font-bold flex items-center gap-1">
                <i className="fas fa-star"></i> {recommendation.rating}/10
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white flex-1">{recommendation.title}</h3>
          <span className={`ml-3 px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-medium flex items-center gap-1`}>
            <i className={config.icon}></i>
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          {recommendation.director && (
            <span className="flex items-center gap-1">
              <i className="fas fa-video text-xs"></i> {recommendation.director}
            </span>
          )}
          {recommendation.year && (
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar text-xs"></i> {recommendation.year}
            </span>
          )}
          {recommendation.genre && (
            <span className="flex items-center gap-1">
              <i className="fas fa-theater-masks text-xs"></i> {recommendation.genre}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{recommendation.recommendation}</p>

        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recommendation, e);
              }}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(recommendation._id)}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Music Card Component with Spotify Embed
const MusicCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? getPlaceholderImage('music') : recommendation.image;
  const spotifyData = recommendation.url ? getSpotifyEmbedId(recommendation.url) : null;
  const config = categoryConfig.music;

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-green-500/20`}>
      {spotifyData ? (
        <div className="w-full bg-black">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}?theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allowTransparency="true"
            allow="encrypted-media"
            className="w-full"
          ></iframe>
        </div>
      ) : (
        <>
          {/* Album Art with Vinyl Effect */}
          <div className="relative h-64 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Vinyl Record */}
              <div className="relative w-48 h-48 rounded-full bg-black shadow-2xl animate-spin-slow">
                <div className="absolute inset-4 rounded-full bg-gray-900"></div>
                <div className="absolute inset-8 rounded-full bg-black"></div>
                <div className="absolute inset-12 rounded-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={recommendation.title}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                </div>
                {/* Center hole */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Music Notes Animation */}
            <div className="absolute top-4 right-4 text-green-400 opacity-50">
              <i className="fas fa-music text-2xl animate-bounce"></i>
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-medium flex items-center gap-1`}>
            <i className={config.icon}></i> {config.name}
          </span>
          {recommendation.rating && (
            <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold flex items-center gap-1">
              <i className="fas fa-star"></i> {recommendation.rating}/10
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{recommendation.title}</h3>

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          {recommendation.artist && (
            <span className="flex items-center gap-1">
              <i className="fas fa-microphone text-xs"></i> {recommendation.artist}
            </span>
          )}
          {recommendation.year && (
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar text-xs"></i> {recommendation.year}
            </span>
          )}
          {recommendation.genre && (
            <span className="flex items-center gap-1">
              <i className="fas fa-guitar text-xs"></i> {recommendation.genre}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3">{recommendation.recommendation}</p>

        {!spotifyData && recommendation.url && (
          <a
            href={recommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} ${config.textColor} rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium`}
          >
            <i className="fab fa-spotify text-lg"></i> Listen on Spotify
          </a>
        )}

        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recommendation, e);
              }}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(recommendation._id)}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Link Card Component - Modern Tech Style
const LinkCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [faviconUrl, setFaviconUrl] = useState(null);
  const domain = getDomainFromUrl(recommendation.url);
  const config = categoryConfig.link;

  useEffect(() => {
    if (domain) {
      setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    }
  }, [domain]);

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-cyan-500/20`}>
      {/* Tech Pattern Background */}
      <div className="relative h-40 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Centered Icon/Favicon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {faviconUrl ? (
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Image
                  src={faviconUrl}
                  alt={domain || recommendation.title}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  onError={() => setFaviconUrl(null)}
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-cyan-400/30">
                <i className="fas fa-link text-3xl text-cyan-400"></i>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Domain Bar */}
      {domain && (
        <div className={`${config.bgColor} py-2 px-4 border-t border-b ${config.borderColor.split(' ')[0]}`}>
          <p className={`${config.textColor} text-sm font-mono flex items-center gap-2`}>
            <i className="fas fa-globe text-xs"></i>
            {domain}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white flex-1">{recommendation.title}</h3>
          <span className={`ml-3 px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-medium flex items-center gap-1`}>
            <i className={config.icon}></i>
          </span>
        </div>

        {recommendation.linkType && (
          <p className={`${config.textColor} text-sm mb-3 font-medium`}>
            <i className="fas fa-tag text-xs"></i> {recommendation.linkType}
          </p>
        )}

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{recommendation.recommendation}</p>

        {recommendation.url && (
          <a
            href={recommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} ${config.textColor} rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-medium group`}
          >
            Visit Link
            <i className="fas fa-external-link-alt text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
          </a>
        )}

        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recommendation, e);
              }}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(recommendation._id)}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Series Card Component - Binge-worthy Style
const SeriesCard = ({ recommendation, onEdit, onDelete, isAdmin = false }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? getPlaceholderImage('series') : recommendation.image;
  const config = categoryConfig.series;

  return (
    <div className={`bg-gradient-to-br ${config.color} backdrop-blur-md border ${config.borderColor} rounded-xl overflow-hidden transition-all duration-300 group shadow-lg hover:shadow-blue-500/20`}>
      {/* Series Poster with TV Frame */}
      <div className="relative">
        {/* TV Screen */}
        <div className="relative h-64 bg-black rounded-t-xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={recommendation.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b12] via-transparent to-transparent"></div>

          {/* TV Static Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0zM2 0h1v1H2zM0 2h1v1H0zM2 2h1v1H2z' fill='white' fill-opacity='0.4'/%3E%3C/svg%3E")`
            }}
          ></div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="fas fa-play text-white text-2xl ml-1"></i>
            </div>
          </div>

          {/* Rating */}
          {recommendation.rating && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-[#e8c547] text-[#0e1b12] rounded-full text-xs font-bold flex items-center gap-1">
                <i className="fas fa-star"></i> {recommendation.rating}/10
              </span>
            </div>
          )}
        </div>

        {/* TV Stand */}
        <div className="h-2 bg-gradient-to-b from-gray-700 to-gray-800"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white flex-1">{recommendation.title}</h3>
          <span className={`ml-3 px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-xs font-medium flex items-center gap-1`}>
            <i className={config.icon}></i>
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
          {recommendation.director && (
            <span className="flex items-center gap-1">
              <i className="fas fa-user text-xs"></i> {recommendation.director}
            </span>
          )}
          {recommendation.year && (
            <span className="flex items-center gap-1">
              <i className="fas fa-calendar text-xs"></i> {recommendation.year}
            </span>
          )}
          {recommendation.genre && (
            <span className="flex items-center gap-1">
              <i className="fas fa-tags text-xs"></i> {recommendation.genre}
            </span>
          )}
        </div>

        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3">{recommendation.recommendation}</p>

        {/* Streaming Platform Icons */}
        <div className="flex gap-3 text-gray-500">
          <i className="fab fa-netflix text-lg hover:text-red-600 transition-colors" title="Netflix"></i>
          <i className="fab fa-amazon text-lg hover:text-blue-400 transition-colors" title="Prime Video"></i>
          <i className="fab fa-apple text-lg hover:text-gray-300 transition-colors" title="Apple TV+"></i>
          <i className="fas fa-plus text-lg hover:text-blue-300 transition-colors" title="Disney+"></i>
        </div>

        {isAdmin && (
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(recommendation, e);
              }}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(recommendation._id)}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/30"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main RecommendationCard component that renders the appropriate card type
export default function RecommendationCard({
  recommendation,
  variant = 'default', // default, compact, admin
  onEdit = null,
  isAdminMode = false
}) {
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const getRating = () => {
    if (!recommendation.rating) return null;
    const rating = parseFloat(recommendation.rating);
    if (isNaN(rating)) return null;
    return rating;
  };

  // Handle Spotify embed
  const getSpotifyEmbed = (url) => {
    if (!url || !url.toLowerCase().includes('spotify.com')) return null;

    // Handle different Spotify URL formats including international URLs (intl-tr, intl-de, etc.)
    // Track URL - permissive regex
    const trackMatch = url.match(/spotify\.com.*?\/track\/([a-zA-Z0-9]+)/i);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&theme=0`;
    }

    // Playlist URL
    const playlistMatch = url.match(/spotify\.com.*?\/playlist\/([a-zA-Z0-9]+)/i);
    if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}?utm_source=generator&theme=0`;
    }

    // Album URL
    const albumMatch = url.match(/spotify\.com.*?\/album\/([a-zA-Z0-9]+)/i);
    if (albumMatch) {
      return `https://open.spotify.com/embed/album/${albumMatch[1]}?utm_source=generator&theme=0`;
    }

    return null;
  };

  // Handle favicon for links
  const getFaviconUrl = (url) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      // Use multiple favicon services as fallback
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  // Get domain name from URL
  const getDomainName = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Link';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFaviconError = () => {
    setFaviconError(true);
  };

  // Link Card - Enhanced Design with Spotify Detection
  if (recommendation.category === 'link') {
    const linkUrl = recommendation.link || recommendation.url;

    // Check if it's a Spotify link
    const spotifyEmbed = getSpotifyEmbed(linkUrl);

    // If it's a Spotify link, render Spotify player
    if (spotifyEmbed) {
      return (
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-green-500/50 rounded-lg overflow-hidden transition-all duration-300 relative group">
          {/* Admin Controls */}
          {isAdminMode && onEdit && (
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(recommendation)}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                title="Edit"
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          )}

          {/* Spotify Embed */}
          <div className="w-full">
            <iframe
              src={spotifyEmbed}
              width="100%"
              height="152"
              frameBorder="0"
              allowTransparency="true"
              allow="encrypted-media"
              className="w-full"
              loading="lazy"
            ></iframe>
          </div>

          {/* Content below Spotify player */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fab fa-spotify text-green-500 text-lg"></i>
                <span className="text-sm text-gray-400">{recommendation.linkType || 'Spotify track'}</span>
              </div>
              {recommendation.rating && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8c547]/20 text-[#e8c547] text-xs font-medium">
                  <i className="fas fa-star text-xs"></i>
                  {recommendation.rating}/10
                </span>
              )}
            </div>
            {recommendation.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {recommendation.description}
              </p>
            )}
          </div>
        </div>
      );
    }

    // Regular link card (non-Spotify)
    return (
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 relative group h-full">
        {/* Admin Controls */}
        {isAdminMode && onEdit && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(recommendation)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            {/* Favicon */}
            <div className="flex-shrink-0">
              {!faviconError && linkUrl ? (
                <img
                  src={getFaviconUrl(linkUrl)}
                  alt={recommendation.title}
                  className="w-12 h-12 rounded-lg object-contain bg-white p-1.5"
                  onError={handleFaviconError}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                  <i className="fas fa-link text-lg text-cyan-400"></i>
                </div>
              )}
            </div>

            {/* Title and Domain */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-200 mb-1 line-clamp-2">{recommendation.title}</h3>
              {linkUrl && (
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <i className="fas fa-globe text-xs"></i>
                  <span>{getDomainName(linkUrl)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {recommendation.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {recommendation.description}
            </p>
          )}

          {/* Tags and Link */}
          <div className="flex items-center justify-between">
            {recommendation.linkType && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">
                <i className="fas fa-tag text-xs"></i>
                {recommendation.linkType}
              </span>
            )}

            {linkUrl && (
              <Link
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-cyan-500/30 rounded-md text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
              >
                <span>Visit</span>
                <i className="fas fa-external-link-alt text-xs"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Music Card - Spotify Embed
  if (recommendation.category === 'music') {
    const musicUrl = recommendation.link || recommendation.url;
    const spotifyEmbed = getSpotifyEmbed(musicUrl);

    return (
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 relative group">
        {/* Admin Controls */}
        {isAdminMode && onEdit && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(recommendation)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <i className="fab fa-spotify text-green-500 text-xl"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-200 mb-1">{recommendation.title}</h3>
              {recommendation.author && (
                <p className="text-sm text-gray-400">{recommendation.author}</p>
              )}
            </div>
          </div>

          {recommendation.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{recommendation.description}</p>
          )}

          {/* Spotify Embed */}
          {spotifyEmbed && (
            <iframe
              src={spotifyEmbed}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          )}

          {!spotifyEmbed && musicUrl && (
            <Link
              href={musicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              <i className="fab fa-spotify"></i>
              <span>Listen on Spotify</span>
              <i className="fas fa-external-link-alt text-xs"></i>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Movie/Series Card - Visual Focus
  if (recommendation.category === 'movie' || recommendation.category === 'series') {
    return (
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 relative group h-full flex flex-col">
        {/* Admin Controls */}
        {isAdminMode && onEdit && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(recommendation)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-64 bg-[#0e1b12] overflow-hidden">
          {recommendation.image && !imageError ? (
            <Image
              src={recommendation.image}
              alt={recommendation.title}
              fill
              className="object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e8c547]/5 to-[#e8c547]/10">
              <i className={`${recommendation.category === 'movie' ? 'fas fa-film' : 'fas fa-tv'} text-4xl text-[#e8c547] opacity-50`}></i>
            </div>
          )}

          {/* Rating Badge */}
          {getRating() && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0e1b12]/80 backdrop-blur-sm flex items-center gap-1 text-[#e8c547]">
              <i className="fas fa-star text-sm"></i>
              <span className="font-semibold">{getRating()}/10</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">{recommendation.title}</h3>

          <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-400">
            {recommendation.year && (
              <span className="flex items-center gap-1">
                <i className="fas fa-calendar text-[#e8c547] text-xs"></i>
                {recommendation.year}
              </span>
            )}
            {recommendation.genre && (
              <span className="flex items-center gap-1">
                <i className="fas fa-tag text-[#e8c547] text-xs"></i>
                {recommendation.genre}
              </span>
            )}
            {recommendation.director && (
              <span className="flex items-center gap-1">
                <i className="fas fa-user text-[#e8c547] text-xs"></i>
                {recommendation.director}
              </span>
            )}
          </div>

          {recommendation.description && (
            <p className="text-gray-400 text-sm line-clamp-3 flex-1">
              {recommendation.description}
            </p>
          )}

          {(recommendation.link || recommendation.url) && (
            <Link
              href={recommendation.link || recommendation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-4 border border-[#e8c547]/30 rounded-lg text-sm font-medium text-[#e8c547] hover:bg-[#e8c547]/10 transition-all duration-300"
            >
              <span>Watch Now</span>
              <i className="fas fa-play text-xs"></i>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Book Card - Enhanced Design
  if (recommendation.category === 'book') {
    return (
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 relative group h-full max-h-[280px]">
        {/* Admin Controls */}
        {isAdminMode && onEdit && (
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(recommendation)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </button>
          </div>
        )}

        <div className="p-5">
          {/* Book Header with Cover */}
          <div className="flex gap-4 mb-4">
            {/* Book Cover */}
            <div className="w-20 h-28 relative bg-gradient-to-br from-amber-900/20 to-amber-800/20 rounded-md overflow-hidden flex-shrink-0">
              {recommendation.image && !imageError ? (
                <Image
                  src={recommendation.image}
                  alt={recommendation.title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-book text-xl text-amber-600 opacity-50"></i>
                </div>
              )}
            </div>

            {/* Title and Author */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-200 mb-1 line-clamp-2">{recommendation.title}</h3>

              {recommendation.author && (
                <p className="text-sm text-amber-500 mb-1 flex items-center gap-2">
                  <i className="fas fa-feather-alt text-xs"></i>
                  <span className="line-clamp-1">{recommendation.author}</span>
                </p>
              )}

              {recommendation.genre && (
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-500">
                  {recommendation.genre}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {recommendation.description && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
              {recommendation.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {getRating() && (
              <div className="flex items-center gap-1 text-[#e8c547] text-sm">
                <i className="fas fa-star text-xs"></i>
                <span className="font-semibold">{getRating()}/10</span>
              </div>
            )}

            {(recommendation.link || recommendation.url) && (
              <Link
                href={recommendation.link || recommendation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-amber-500/30 rounded-md text-xs font-medium text-amber-500 hover:bg-amber-500/10 transition-all duration-300"
              >
                <span>Read</span>
                <i className="fas fa-book-open text-xs"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game Card - Default style for games
  return (
    <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 hover:border-[#e8c547]/50 rounded-lg overflow-hidden transition-all duration-300 relative group h-full flex flex-col">
      {/* Admin Controls */}
      {isAdminMode && onEdit && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(recommendation)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 bg-[#0e1b12] overflow-hidden">
        {recommendation.image && !imageError ? (
          <Image
            src={recommendation.image}
            alt={recommendation.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-purple-800/20">
            <i className="fas fa-gamepad text-4xl text-purple-500 opacity-50"></i>
          </div>
        )}

        {/* Rating Badge */}
        {getRating() && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0e1b12]/80 backdrop-blur-sm flex items-center gap-1 text-[#e8c547]">
            <i className="fas fa-star text-sm"></i>
            <span className="font-semibold">{getRating()}/10</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-200 mb-2">{recommendation.title}</h3>

        <div className="flex flex-wrap gap-3 mb-3 text-sm">
          {recommendation.developer && (
            <span className="text-purple-400 flex items-center gap-1">
              <i className="fas fa-code text-xs"></i>
              {recommendation.developer}
            </span>
          )}
          {recommendation.genre && (
            <span className="text-gray-400 flex items-center gap-1">
              <i className="fas fa-tag text-[#e8c547] text-xs"></i>
              {recommendation.genre}
            </span>
          )}
        </div>

        {recommendation.description && (
          <p className="text-gray-400 text-sm line-clamp-3 flex-1">
            {recommendation.description}
          </p>
        )}

        {(recommendation.link || recommendation.url) && (
          <Link
            href={recommendation.link || recommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-4 border border-purple-500/30 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all duration-300"
          >
            <span>Play Now</span>
            <i className="fas fa-gamepad text-xs"></i>
          </Link>
        )}
      </div>
    </div>
  );
}
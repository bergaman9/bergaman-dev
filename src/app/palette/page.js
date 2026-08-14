"use client";

import { useCallback, useEffect, useState } from 'react';
import { usePreferences } from '../components/PreferencesProvider';

const INITIAL_COLORS = ['#0f5132', '#e8c547', '#1f2937', '#2563eb', '#be185d'];

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, '0')}`;
}

function readableText(hex) {
  // YIQ contrast to decide black/white label text
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#0b0b0b' : '#f5f5f5';
}

export default function PalettePage() {
  const { locale } = usePreferences();
  const tr = locale === 'tr';
  const [colors, setColors] = useState(() => INITIAL_COLORS.map((hex) => ({ hex, locked: false })));
  const [copied, setCopied] = useState(null);

  const generate = useCallback(() => {
    setColors((prev) => prev.map((c) => (c.locked ? c : { hex: randomHex(), locked: false })));
  }, []);

  // Spacebar regenerates (desktop convenience)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [generate]);

  const toggleLock = (i) => {
    setColors((prev) => prev.map((c, idx) => (idx === i ? { ...c, locked: !c.locked } : c)));
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const tailwindSnippet =
    `colors: {\n  palette: {\n${colors.map((c, i) => `    ${(i + 1) * 100}: '${c.hex}',`).join('\n')}\n  },\n}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--mini-accent, #f472b6)' }}>
          <i className="fas fa-palette mr-2"></i> {tr ? 'Renk Paleti Oluşturucu' : 'Palette Generator'}
        </h1>
        <p className="text-gray-400 mt-2">
          {tr ? 'Hex kodunu kopyalamak için bir renge dokunun. Beğendiklerinizi kilitleyip kalanları yeniden oluşturun' : 'Tap a swatch to copy its hex. Lock the ones you love, then regenerate the rest'}
          <span className="hidden sm:inline"> {tr ? '(veya boşluk tuşuna basın)' : '(or press space)'}</span>.
        </p>
      </header>

      {/* Swatches */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {colors.map((c, i) => {
          const label = readableText(c.hex);
          return (
            <div
              key={i}
              className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-3 transition-[border-color,box-shadow] hover:border-white/25 hover:shadow-xl sm:h-56"
              style={{ background: c.hex }}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => toggleLock(i)}
                  aria-label={c.locked ? (tr ? 'Rengin kilidini aç' : 'Unlock color') : (tr ? 'Rengi kilitle' : 'Lock color')}
                  aria-pressed={c.locked}
                  className="w-9 h-9 rounded-full grid place-items-center bg-black/20 hover:bg-black/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  style={{ color: label }}
                >
                  <i className={`fas ${c.locked ? 'fa-lock' : 'fa-lock-open'} text-sm`}></i>
                </button>
              </div>
              <button
                onClick={() => copy(c.hex, `swatch-${i}`)}
                className="text-left focus:outline-none"
                style={{ color: label }}
                aria-label={`${tr ? 'Kopyala' : 'Copy'} ${c.hex}`}
              >
                <span className="font-mono font-bold text-lg uppercase tracking-wide">{c.hex}</span>
                <span className="block text-xs opacity-70">
                  {copied === `swatch-${i}` ? (tr ? 'Kopyalandı!' : 'Copied!') : (tr ? 'Kopyalamak için dokunun' : 'Tap to copy')}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <button
          onClick={generate}
          className="px-8 py-3 rounded-full font-bold text-black transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
          style={{ background: 'var(--mini-accent, #f472b6)' }}
        >
          <i className="fas fa-shuffle mr-2"></i> {tr ? 'Oluştur' : 'Generate'}
        </button>
        <button
          onClick={() => copy(colors.map((c) => c.hex).join(', '), 'all')}
          className="px-8 py-3 rounded-full font-medium bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
        >
          <i className="fas fa-copy mr-2"></i> {copied === 'all' ? (tr ? 'Kopyalandı!' : 'Copied!') : (tr ? 'Tüm hex kodlarını kopyala' : 'Copy all hex')}
        </button>
      </div>

      {/* Tailwind export */}
      <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-semibold text-gray-300">
            <i className="fas fa-wind mr-2 text-pink-400/80"></i> tailwind.config.js
          </span>
          <button
            onClick={() => copy(tailwindSnippet, 'tw')}
            className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/60"
          >
            {copied === 'tw' ? (tr ? 'Kopyalandı!' : 'Copied!') : (tr ? 'Kopyala' : 'Copy')}
          </button>
        </div>
        <pre className="p-4 text-sm text-gray-300 overflow-x-auto"><code>{tailwindSnippet}</code></pre>
      </div>
    </div>
  );
}

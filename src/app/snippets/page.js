"use client";

import { useMemo, useState } from 'react';

const SNIPPETS = [
  {
    title: 'Debounce a function',
    category: 'JavaScript',
    lang: 'js',
    code: `function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}`,
  },
  {
    title: 'useDebouncedValue hook',
    category: 'React',
    lang: 'jsx',
    code: `import { useEffect, useState } from 'react';

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}`,
  },
  {
    title: 'useMediaQuery hook',
    category: 'React',
    lang: 'jsx',
    code: `import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    handler();
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
}`,
  },
  {
    title: 'Email validation',
    category: 'Regex',
    lang: 'js',
    code: `const isEmail = (v) =>
  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);`,
  },
  {
    title: 'Slugify a string',
    category: 'JavaScript',
    lang: 'js',
    code: `const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');`,
  },
  {
    title: 'Strong password regex',
    category: 'Regex',
    lang: 'js',
    code: `// 8+ chars, upper, lower, number, symbol
const strong =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/;`,
  },
  {
    title: 'Format bytes',
    category: 'JavaScript',
    lang: 'js',
    code: `function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return \`\${parseFloat((bytes / k ** i).toFixed(decimals))} \${sizes[i]}\`;
}`,
  },
  {
    title: 'Sleep / delay',
    category: 'JavaScript',
    lang: 'js',
    code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// usage: await sleep(500);`,
  },
  {
    title: 'Center with flex',
    category: 'CSS',
    lang: 'css',
    code: `.center {
  display: flex;
  align-items: center;
  justify-content: center;
}`,
  },
  {
    title: 'Truncate to N lines',
    category: 'CSS',
    lang: 'css',
    code: `.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(SNIPPETS.map((s) => s.category)))];

function SnippetCard({ snippet }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-200 truncate">{snippet.title}</h3>
          <span className="text-xs text-cyan-400/80">{snippet.category} · {snippet.lang}</span>
        </div>
        <button
          onClick={copy}
          aria-label={`Copy ${snippet.title}`}
          className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-1.5`}></i>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto flex-1"><code>{snippet.code}</code></pre>
    </div>
  );
}

export default function SnippetsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SNIPPETS.filter((s) => {
      const matchesCat = category === 'All' || s.category === category;
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--mini-accent, #22d3ee)' }}>
          <i className="fas fa-code mr-2"></i> Snippet Vault
        </h1>
        <p className="text-gray-400 mt-2">A small, hand-picked set of snippets I reach for often.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <label htmlFor="snippet-search" className="sr-only">Search snippets</label>
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></i>
          <input
            id="snippet-search"
            type="text"
            placeholder="Search snippets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-lg bg-black/30 border border-white/10 text-gray-200 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`shrink-0 px-4 h-12 sm:h-auto sm:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                category === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <i className="fas fa-box-open text-4xl mb-3 block text-cyan-400/40"></i>
          No snippets match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <SnippetCard key={s.title} snippet={s} />
          ))}
        </div>
      )}
    </div>
  );
}

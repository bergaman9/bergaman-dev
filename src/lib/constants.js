// Version is injected from package.json by next.config.mjs (NEXT_PUBLIC_APP_VERSION).
// npm_package_version covers node scripts run through npm outside the Next build.
const APP_VERSION_VALUE = (process.env.NEXT_PUBLIC_APP_VERSION || process.env.npm_package_version || '0.0.0').replace(/^v/, '');
const isProduction = process.env.NODE_ENV === 'production';
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(!isProduction ? ["'unsafe-eval'"] : []),
  'https://open.spotify.com',
].join(' ');

const imageSources = [
  "'self'",
  'data:',
  'blob:',
  'https://bergaman.dev',
  'https://www.bergaman.dev',
  'https://i.scdn.co',
  'https://*.spotifycdn.com',
  'https://open.spotify.com',
  'https://www.google.com',
  'https://*.gstatic.com',
  'https://i.ytimg.com',
  'https://github.com',
  'https://avatars.githubusercontent.com',
  'https://raw.githubusercontent.com',
  'https://images.unsplash.com',
].join(' ');

// Site Configuration
export const SITE_CONFIG = {
  name: 'Bergaman',
  title: 'Ömer • Electrical Engineer & Full-Stack Developer',
  description: 'Ömer builds reliable high-voltage, automation, embedded, and full-stack software solutions through Bergasoft in Istanbul, Turkey.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bergaman.dev',
  author: {
    name: 'Ömer',
    email: 'contact@bergaman.dev',
    github: 'https://github.com/bergaman9',
    linkedin: 'https://www.linkedin.com/in/omerguler/',
    twitter: 'https://twitter.com/bergaman9',
    discord: 'https://discord.gg/bergaman'
  },
  keywords: [
    'Electrical Engineer',
    'Electronics Engineer',
    'High Voltage Engineer',
    'Power Systems',
    'AutoCAD Electrical',
    'Electrical Automation',
    'Full Stack Developer',
    'Next.js',
    'React',
    'Python',
    'Discord Bot',
    'Web Development',
    'AI-Assisted Development',
    'Bergasoft',
    'Bergaman',
    'Dragon Developer'
  ],
  themeColor: '#e8c547',
  version: APP_VERSION_VALUE,
  previousVersions: {
    v1: {
      url: 'https://bergaman-v1.vercel.app/',
      label: 'Portfolio v1.0',
      description: 'Previous version of Bergaman Portfolio'
    }
  }
};

// Navigation Links — single source for Header, Footer and sitemaps.
// Canonical route for curated content is /picks (legacy /recommendations
// and /suggestions redirect there, see next.config.mjs).
export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'fas fa-home' },
  { href: '/about', label: 'About', icon: 'fas fa-user' },
  { href: '/portfolio', label: 'Work', icon: 'fas fa-briefcase' },
  { href: '/blog', label: 'Writing', icon: 'fas fa-blog' },
  { href: '/picks', label: 'Picks', icon: 'fas fa-heart' },
  { href: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
];

// Social Media Links
export const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: SITE_CONFIG.author.github,
    icon: 'fab fa-github'
  },
  {
    label: 'LinkedIn',
    href: SITE_CONFIG.author.linkedin,
    icon: 'fab fa-linkedin'
  },
  {
    label: 'Discord',
    href: SITE_CONFIG.author.discord,
    icon: 'fab fa-discord'
  },
  {
    label: 'Email',
    href: `mailto:${SITE_CONFIG.author.email}`,
    icon: 'fas fa-envelope'
  }
];

// SEO Defaults
export const SEO_DEFAULTS = {
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: '/images/profile/profile.jpg',
        width: 512,
        height: 512,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@bergaman9',
    creator: '@bergaman9',
  },
};

// Genel sabitler
export const APP_NAME = 'Bergaman';
export const APP_VERSION = APP_VERSION_VALUE;
export const APP_DESCRIPTION = 'Personal portfolio and blog';
export const APP_URL = 'https://www.bergaman.dev';

// API rotaları
export const API_ROUTES = {
  POSTS: '/api/posts',
  PORTFOLIO: '/api/portfolio',
  CONTACT: '/api/contact',
  NEWSLETTER: '/api/newsletter',
  MEDIA: '/api/media',
  ADMIN: '/api/admin',
  RECOMMENDATIONS: '/api/recommendations',
  COMMENTS: '/api/comments',
};

// Medya türleri
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
};

// Sayfa boyutları
export const PAGE_SIZES = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 20,
};

// Blog kategorileri
export const BLOG_CATEGORIES = [
  'Technology',
  'Design',
  'Development',
  'Business',
  'Lifestyle',
  'Personal',
];

// Portfolio kategorileri
export const PORTFOLIO_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Branding',
  'Game Development',
  'AI & Machine Learning',
  'IoT',
  'Desktop Applications',
];

// Güvenlik sabitleri
export const SECURITY = {
  // Session ayarları
  SESSION: {
    DURATION: 8 * 60 * 60 * 1000, // 8 hours
    REFRESH_BEFORE: 5 * 60 * 1000, // Son 5 dakikada yenile (ms)
    COOKIE_NAME: 'admin_session',
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    },
  },

  // Rate limiting
  RATE_LIMIT: {
    MAX_LOGIN_ATTEMPTS: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 5,
    LOCKOUT_DURATION: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000, // 15 dakika (ms)
    API_LIMIT: process.env.API_RATE_LIMIT ? parseInt(process.env.API_RATE_LIMIT) : 100,
    API_WINDOW: process.env.API_RATE_LIMIT_WINDOW_MS ? parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) : 60 * 1000, // 1 dakika (ms)
  },

  // JWT ayarları
  JWT: {
    ALGORITHM: 'HS256',
    SECRET: process.env.JWT_SECRET || 'bergaman-secret-key-please-change-in-production',
  },

  // Şifre güvenliği
  PASSWORD: {
    MIN_LENGTH: 12,
    HASH_ITERATIONS: 10000,
    HASH_KEYLEN: 64,
    HASH_DIGEST: 'sha512',
  },

  // Güvenlik başlıkları
  HEADERS: {
      CONTENT_SECURITY_POLICY: `default-src 'self'; script-src ${scriptSources}; style-src 'self' 'unsafe-inline'; img-src ${imageSources}; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com; frame-src 'self' https://open.spotify.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`,
    XSS_PROTECTION: '1; mode=block',
    FRAME_OPTIONS: 'SAMEORIGIN',
    CONTENT_TYPE_OPTIONS: 'nosniff',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    HSTS: 'max-age=31536000; includeSubDomains',
    PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()',
  },

  // Korunan rotalar
  PROTECTED_ROUTES: {
    ADMIN: ['/admin/dashboard', '/admin/portfolio', '/admin/posts', '/api/admin/portfolio', '/api/admin/posts'],
    PUBLIC: ['/admin', '/api/admin/auth'],
  },

  // CORS ayarları
  CORS: {
    ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS ?
      process.env.CORS_ALLOWED_ORIGINS.split(',') :
      ['http://localhost:3000', 'https://www.bergaman.dev'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  },
};

// Canonical skills source shared by Home and About. The established card and
// progress-bar presentation is intentionally preserved in both places.
export const SKILL_CATEGORIES = [
  {
    title: 'Programming Languages',
    icon: 'fas fa-code',
    skills: [
      { name: 'Python', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'C#', level: 70 },
      { name: 'HTML & CSS', level: 90 },
    ],
  },
  {
    title: 'Web & Software',
    icon: 'fas fa-layer-group',
    skills: [
      { name: 'React & Next.js', level: 85 },
      { name: 'Node.js', level: 75 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'AI-Assisted Development', level: 85 },
    ],
  },
  {
    title: 'Electrical Engineering',
    icon: 'fas fa-bolt',
    skills: [
      { name: 'High-Voltage Systems', level: 80 },
      { name: 'Power Systems', level: 80 },
      { name: 'Protection & Grounding', level: 80 },
      { name: 'AutoCAD', level: 85 },
    ],
  },
  {
    title: 'Data & Engineering Tools',
    icon: 'fas fa-database',
    skills: [
      { name: 'MongoDB', level: 75 },
      { name: 'SQL', level: 70 },
      { name: 'Git', level: 85 },
      { name: 'Technical Documentation', level: 85 },
    ],
  },
  {
    title: 'Hardware & Automation',
    icon: 'fas fa-microchip',
    skills: [
      { name: 'Arduino/ESP32', level: 80 },
      { name: 'Circuit Design', level: 75 },
      { name: 'Panels & Automation', level: 80 },
      { name: 'IoT Systems', level: 75 },
    ],
  },
  {
    title: 'Professional Practice',
    icon: 'fas fa-cogs',
    skills: [
      { name: 'Problem Solving', level: 90 },
      { name: 'System Design', level: 75 },
      { name: 'Technical Communication', level: 85 },
      { name: 'Operational Safety', level: 85 },
    ],
  },
];

export const SKILLS = SKILL_CATEGORIES.flatMap((category) => category.skills);

// Default export for ESM compatibility
export default {
  SITE_CONFIG,
  NAV_LINKS,
  SOCIAL_LINKS,
  SEO_DEFAULTS,
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  APP_URL,
  API_ROUTES,
  MEDIA_TYPES,
  PAGE_SIZES,
  BLOG_CATEGORIES,
  PORTFOLIO_CATEGORIES,
  SECURITY,
  SKILLS,
  SKILL_CATEGORIES,
};


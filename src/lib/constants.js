// Site Configuration
export const SITE_CONFIG = {
  name: 'Bergaman',
  title: 'Bergaman - The Dragon\'s Domain',
  description: 'Passionate Electrical & Electronics Engineer specializing in modern web technologies, innovative digital solutions, and technical projects. Crafting technology inspired by the strength and wisdom of a dragon.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bergaman.dev',
  author: {
    name: 'Ömer (Bergaman)',
    email: 'contact@bergaman.dev',
    github: 'https://github.com/bergaman9',
    twitter: 'https://twitter.com/bergaman9',
    discord: 'https://discord.gg/bergaman'
  },
  keywords: [
    'Electrical Engineer',
    'Electronics Engineer',
    'Full Stack Developer',
    'Next.js',
    'React',
    'Python',
    'Discord Bot',
    'Web Development',
    'Bergaman',
    'Dragon Developer'
  ],
  themeColor: '#e8c547',
  version: '2.5.13', // Current version - updated to match package.json
  previousVersions: {
    v1: {
      url: 'https://bergaman-v1.vercel.app/',
      label: 'Portfolio v1.0',
      description: 'Previous version of Bergaman Portfolio'
    }
  }
};

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'fas fa-home' },
  { href: '/about', label: 'About', icon: 'fas fa-user' },
  { href: '/portfolio', label: 'Portfolio', icon: 'fas fa-briefcase' },
  { href: '/blog', label: 'Blog', icon: 'fas fa-blog' },
  { href: '/suggestions', label: 'Suggestions', icon: 'fas fa-lightbulb' }
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
    href: 'https://www.linkedin.com/in/omerguler/',
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
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bergaman9',
    creator: '@bergaman9',
  },
};

// Genel sabitler
export const APP_NAME = 'Bergaman';
export const APP_VERSION = '2.5.13';
export const APP_DESCRIPTION = 'Personal portfolio and blog';
export const APP_URL = 'https://bergaman.dev';

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
    DURATION: 24 * 60 * 60 * 1000, // 24 saat (ms)
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
    CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; img-src 'self' data: blob: https: http:; font-src 'self' data: https://cdnjs.cloudflare.com; connect-src 'self' https://*.vercel-insights.com",
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
      ['http://localhost:3000', 'https://bergaman.dev'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  },
};

// Skills Data
export const SKILLS = [
  { name: 'Python', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'React/Next.js', level: 88 },
  { name: 'Node.js', level: 80 },
  { name: 'C#', level: 85 },
  { name: 'SQL', level: 75 },
  { name: 'MongoDB', level: 78 },
  { name: 'Git', level: 85 },
  { name: 'AI/ML', level: 70 },
  { name: 'Blockchain', level: 65 }
];

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
  SKILLS
};


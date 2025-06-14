// Site Configuration
export const SITE_CONFIG = {
  name: 'Bergaman',
  title: 'Bergaman - AI & Blockchain Developer | The Dragon\'s Domain',
  description: 'Passionate AI & Blockchain Developer specializing in modern web technologies, artificial intelligence, and innovative digital solutions. Crafting technology inspired by the strength and wisdom of a dragon.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bergaman.dev',
  author: {
    name: 'Ömer (Bergaman)',
    email: 'contact@bergaman.dev',
    github: 'https://github.com/bergaman9',
    twitter: 'https://twitter.com/bergaman9',
    discord: 'https://discord.gg/bergaman'
  },
  keywords: [
    'AI Developer',
    'Blockchain Developer',
    'Full Stack Developer',
    'Next.js',
    'React',
    'Python',
    'Discord Bot',
    'Machine Learning',
    'Web Development',
    'Bergaman',
    'Dragon Developer'
  ],
  themeColor: '#e8c547',
  version: '2.0.0', // Current version
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
    label: 'Twitter',
    href: SITE_CONFIG.author.twitter,
    icon: 'fab fa-twitter'
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

// Blog Categories
export const BLOG_CATEGORIES = [
  'technology',
  'ai',
  'blockchain',
  'web-development',
  'programming',
  'tutorial',
  'personal',
  'gaming'
];

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

// Get dynamic version from package.json
export const getAppVersion = () => {
  try {
    // In production, this would be set during build time
    return process.env.NEXT_PUBLIC_APP_VERSION || SITE_CONFIG.version;
  } catch (error) {
    return SITE_CONFIG.version;
  }
}; 
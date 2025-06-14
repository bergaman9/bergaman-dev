// Site Configuration
export const SITE_CONFIG = {
  name: "Bergaman",
  title: "The Dragon's Domain - Bergaman",
  description: "Crafting technology inspired by the strength and wisdom of a dragon. Expert in AI, blockchain, and full-stack development.",
  url: "https://bergaman.dev",
  author: {
    name: "Ömer (Bergaman)",
    email: "contact@bergaman.dev",
    github: "https://github.com/bergaman9",
    linkedin: "https://linkedin.com/in/bergaman",
    discord: "https://discord.gg/your-discord"
  },
  keywords: [
    "Bergaman", "AI developer", "blockchain developer", "full stack developer", 
    "Python developer", "JavaScript developer", "Discord bot developer", 
    "IoT projects", "Arduino projects", "machine learning", "web development",
    "Next.js", "React", "Node.js", "artificial intelligence", "crypto", "DeFi"
  ],
  themeColor: "#e8c547",
  backgroundColor: "#0e1b12"
};

// Navigation Links
export const NAV_LINKS = [
  { href: "/", label: "Home", icon: "fas fa-home" },
  { href: "/about", label: "About", icon: "fas fa-user" },
  { href: "/portfolio", label: "Portfolio", icon: "fas fa-briefcase" },
  { href: "/blog", label: "Blog", icon: "fas fa-blog" },
  { href: "/suggestions", label: "Suggestions", icon: "fas fa-lightbulb" }
];

// Social Media Links
export const SOCIAL_LINKS = [
  { 
    href: "https://github.com/bergaman9", 
    label: "GitHub", 
    icon: "fab fa-github",
    color: "hover:text-gray-300"
  },
  { 
    href: "https://discord.gg/your-discord", 
    label: "Discord", 
    icon: "fab fa-discord",
    color: "hover:text-indigo-400"
  },
  { 
    href: "mailto:contact@bergaman.dev", 
    label: "Email", 
    icon: "fas fa-envelope",
    color: "hover:text-red-400"
  },
  { 
    href: "https://linkedin.com/in/bergaman", 
    label: "LinkedIn", 
    icon: "fab fa-linkedin",
    color: "hover:text-blue-400"
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
        url: '/images/profile.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bergaman_dev',
    images: ['/images/profile.png'],
  },
}; 
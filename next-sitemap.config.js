/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://bergaman.dev',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/404',
    '/500',
    '/maintenance',
    '/test-webhook'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/404',
          '/500',
          '/maintenance',
          '/test-webhook'
        ]
      }
    ],
    additionalSitemaps: [
      'https://bergaman.dev/sitemap.xml',
    ],
  },
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: {
    '/': 1.0,
    '/blog': 0.9,
    '/portfolio': 0.8,
    '/about': 0.7,
    '/contact': 0.6,
    '/blog/*': 0.8,
    '/portfolio/*': 0.7,
  },
  sitemapSize: 5000,
  autoLastmod: true,
  generateIndexSitemap: false,
  transform: async (config, path) => {
    // Custom priority for different pages
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/portfolio')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Default transformation
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
};

export default config; 
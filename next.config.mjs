import { readFileSync } from 'fs';
import { join } from 'path';
import { SECURITY } from './src/lib/constants.js';

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const version = `v${packageJson.version}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || version,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bergaman-dev',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
  },
  // Skip API routes during static generation
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Tüm sayfalar için güvenlik başlıkları
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: SECURITY.HEADERS.CONTENT_SECURITY_POLICY,
          },
          {
            key: 'X-XSS-Protection',
            value: SECURITY.HEADERS.XSS_PROTECTION,
          },
          {
            key: 'X-Frame-Options',
            value: SECURITY.HEADERS.FRAME_OPTIONS,
          },
          {
            key: 'X-Content-Type-Options',
            value: SECURITY.HEADERS.CONTENT_TYPE_OPTIONS,
          },
          {
            key: 'Referrer-Policy',
            value: SECURITY.HEADERS.REFERRER_POLICY,
          },
          {
            key: 'Permissions-Policy',
            value: SECURITY.HEADERS.PERMISSIONS_POLICY,
          },
          // HSTS başlığı sadece production ortamında eklenecek
          ...(process.env.NODE_ENV === 'production' ? [
            {
              key: 'Strict-Transport-Security',
              value: SECURITY.HEADERS.HSTS,
            }
          ] : [])
        ],
      },
    ];
  },
  // Güvenlik için varsayılan ayarlar
  poweredByHeader: false, // X-Powered-By başlığını kaldır
  compress: true, // Yanıtları sıkıştır
};

export default nextConfig;

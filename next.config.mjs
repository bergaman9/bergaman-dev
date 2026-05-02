import { readFileSync } from 'fs';
import { join } from 'path';
// CommonJS modülünden named export'ları import etmek için önerilen yöntem
import pkg from './src/lib/constants.js';
const { SECURITY } = pkg;

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const version = `v${packageJson.version}`;
const remoteImageHosts = (
  process.env.NEXT_IMAGE_ALLOWED_HOSTS ||
  [
    'bergaman.dev',
    'www.bergaman.dev',
    'localhost',
    'i.scdn.co',
    'open.spotify.com',
    'www.google.com',
    't1.gstatic.com',
    't2.gstatic.com',
    't3.gstatic.com',
    'github.com',
    'avatars.githubusercontent.com',
    'raw.githubusercontent.com',
    'i.ytimg.com',
    'images.unsplash.com',
  ].join(',')
)
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

// Get current environment
const nodeEnv = process.env.NODE_ENV || 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || version,
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      ...remoteImageHosts
        .filter((hostname) => hostname !== 'localhost')
        .map((hostname) => ({
          protocol: 'https',
          hostname,
        })),
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  trailingSlash: false,
  generateBuildId: async () => {
    return process.env.NEXT_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || packageJson.version;
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*'
      }
    ];
  },
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
          ...(nodeEnv === 'production' ? [
            {
              key: 'Strict-Transport-Security',
              value: SECURITY.HEADERS.HSTS,
            }
          ] : [])
        ],
      },
    ];
  },
};

export default nextConfig;

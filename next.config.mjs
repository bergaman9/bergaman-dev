/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  },
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

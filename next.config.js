/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable image optimization during development
    unoptimized: process.env.NODE_ENV === 'development',
    // Configure image domains
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'drive.googleusercontent.com'
    ],
    // Configure image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Configure image formats
    formats: ['image/webp'],
    // Configure minimum cache TTL
    minimumCacheTTL: 60,
    // Configure remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.googleusercontent.com',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/www/:path*',
        destination: '/:path*',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy-image',
        destination: '/api/proxy-image',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.fsyd6-1.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.trybooking.com',
        pathname: '/**',
      },
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
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy-image',
        destination: '/api/proxy-image',
      },
    ]
  },
}

module.exports = nextConfig 
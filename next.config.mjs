/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { 'googleapis': 'commonjs googleapis' }];
    return config;
  },
}

export default nextConfig

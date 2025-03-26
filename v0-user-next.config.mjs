/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // Handle Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
      
      return config;
    },
  };
  
  export default nextConfig;
  
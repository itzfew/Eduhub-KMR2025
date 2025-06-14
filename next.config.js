/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client-side bundles
      config.resolve.fallback = {
        fs: false,
        net: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

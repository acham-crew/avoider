/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only use basePath in production (GitHub Pages)
  basePath: process.env.NODE_ENV === 'production' ? '/avoider' : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    // Phaser requires special webpack configuration for proper bundling
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
}

module.exports = nextConfig

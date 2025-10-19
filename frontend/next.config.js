const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../'),
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    // Monaco Editor webpack configuration
    config.module.rules.push({
      test: /\.ttf$/,
      type: 'asset/resource',
    });
    
    return config;
  },
};

module.exports = nextConfig;

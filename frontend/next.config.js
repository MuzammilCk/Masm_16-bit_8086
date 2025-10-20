const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  outputFileTracingRoot: path.join(__dirname, '../'),
  // Suppress hydration warnings caused by browser extensions in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Custom webpack config to suppress hydration warnings in dev console
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
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

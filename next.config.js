/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  staticPageGenerationTimeout: 300, // 5 minutes (300 seconds)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

//prettier-ignore
module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

//prettier-ignore
module.exports = nextConfig

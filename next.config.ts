/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/mtg_converter',
  assetPrefix: '/mtg_converter',
  trailingSlash: true, // important for GitHub Pages routing
};

module.exports = nextConfig;

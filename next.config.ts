/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  basePath: '/mtg_converter', // Important: use your GitHub repo name here
  assetPrefix: '/mtg_converter/', // Same as above
  trailingSlash: true, // Ensures all routes work as static files
  images: {
    unoptimized: true, // Required for static HTML export
  },
};

module.exports = nextConfig;

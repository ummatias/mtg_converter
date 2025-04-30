/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mtg_converter',
  assetPrefix: '/mtg_converter/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // importante para rotas estáticas no GitHub Pages
};

module.exports = nextConfig;

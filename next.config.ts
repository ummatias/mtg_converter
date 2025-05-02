/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/mtg_converter',
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
};

module.exports = nextConfig;

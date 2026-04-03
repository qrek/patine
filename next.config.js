/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  // Note: output: 'export' désactive les API Routes et next-auth.
  // Laisser commenté pour un déploiement Vercel standard.
  // output: 'export',
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Note: output: 'export' désactive les API Routes et next-auth.
  // Laisser commenté pour un déploiement Vercel standard.
  // output: 'export',
};

module.exports = nextConfig;

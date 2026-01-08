/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Disable type checking during build (Prisma types are generated)
  typescript: {
    ignoreBuildErrors: false,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Environment variables to expose to browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'English Training',
  },

  // Compression
  compress: true,

  // React strict mode
  reactStrictMode: true,

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

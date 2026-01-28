/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Fatima Zehra Boutique',
  },
  // Headers disabled for static export (GitHub Pages)
  // headers: async () => {
  //   return []
  // },
}

module.exports = nextConfig

import withPWA from 'next-pwa'

const withPWAFunc = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        url.pathname.startsWith('/books/') && url.pathname.includes('/verses/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'verse-data',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWAFunc(nextConfig)

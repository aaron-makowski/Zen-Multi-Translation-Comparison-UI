import nextPwa from "next-pwa"
import defaultRuntimeCaching from "next-pwa/cache.js"

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

const runtimeCaching = [
  ...defaultRuntimeCaching,
  {
    urlPattern: /\/books\/.*\/verses\/.*$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "verse-data",
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
]

export default nextPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
})(nextConfig)


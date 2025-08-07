import withPWA from "next-pwa"

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

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        url.pathname.startsWith("/books/") && url.pathname.includes("/verses/"),
      handler: "NetworkFirst",
      options: {
        cacheName: "verse-data",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
        },
      },
    },
  ],
})(nextConfig)

import nextMDX from "@next/mdx"

const withMDX = nextMDX({
  extension: /\.(md|mdx)$/,
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
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

export default withMDX(nextConfig)
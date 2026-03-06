/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages static hosting
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

module.exports = nextConfig

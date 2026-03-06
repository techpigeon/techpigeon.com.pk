/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['www.techpigeon.org'],
  },
  // Ensure all pages are treated as dynamic (no static generation)
  // This prevents build-time timeouts and server/client boundary issues
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'books.google.com', 'is1-ssl.mzstatic.com'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig

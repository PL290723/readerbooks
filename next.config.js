/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Disable static generation for auth pages to avoid build-time errors
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Ensure environment variables are available during build
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  },
  // Force dynamic rendering for specific routes
  async rewrites() {
    return {
      fallback: [],
    }
  },
}

module.exports = nextConfig

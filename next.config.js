/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to allow API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Next.js 15 optimizations
  experimental: {
    optimizeCss: false, // Disable CSS optimization due to critters issue
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*']
  }
};

module.exports = nextConfig;

import type { NextConfig } from 'next';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api-puce-delta.vercel.app';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['@repo/ui'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

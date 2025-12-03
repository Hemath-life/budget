import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['better-sqlite3'],
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;

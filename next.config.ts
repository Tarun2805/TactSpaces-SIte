import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/anatomy.html', destination: '/anatomy', permanent: true },
      { source: '/standard.html', destination: '/standard', permanent: true },
      { source: '/command-center.html', destination: '/command-center', permanent: true },
      { source: '/studio.html', destination: '/studio', permanent: true },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.mds.yandex.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/b2b',
        destination: '/contacts#wholesale',
        permanent: true,
      },
      {
        source: '/horeca',
        destination: '/contacts#wholesale',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

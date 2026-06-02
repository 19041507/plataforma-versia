/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  allowedDevOrigins: ['http://192.168.15.180:3000', 'http://localhost:3000'],
};

export default nextConfig;

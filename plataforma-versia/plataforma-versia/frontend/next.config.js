import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Evita que o Next use um package-lock.json fora deste projeto (ex.: pasta do usu??rio)
  outputFileTracingRoot: path.join(__dirname),

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

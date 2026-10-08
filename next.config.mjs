/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/eewe1vjr/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'cloudinary'],
    cpus: 1,
    isrMemoryCacheSize: 0,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  productionBrowserSourceMaps: false,
};

export default nextConfig;

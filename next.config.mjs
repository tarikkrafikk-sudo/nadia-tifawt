/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images servies telles quelles (déjà optimisées) : fiable sur Windows/Linux, aucun besoin de sharp.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: { serverComponentsExternalPackages: ['mongoose'] },
};
export default nextConfig;

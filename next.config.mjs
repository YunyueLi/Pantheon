/** @type {import('next').NextConfig} */

// Static export, served at the root of a custom domain (pantheon.ungetsu.net).
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

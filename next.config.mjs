/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// Static export for GitHub Pages (project site served from /Pantheon).
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? "/Pantheon" : "",
};

export default nextConfig;

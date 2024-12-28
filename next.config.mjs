/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Remove basePath or set it to empty string
  basePath: '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
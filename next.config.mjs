/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/blog' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
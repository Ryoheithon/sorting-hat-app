/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // 型チェックの警告を無視する
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLintの警告を無視する
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
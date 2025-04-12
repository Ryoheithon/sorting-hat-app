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
  // 末尾のスラッシュを削除
  trailingSlash: false,
  // 実験的機能の設定
  experimental: {
    // モジュール解決の改善
    esmExternals: 'loose',
  },
  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/result',
        destination: '/',
        permanent: false,
        missing: [
          {
            type: 'query',
            key: 'id'
          }
        ]
      },
    ]
  },
  // リワイト設定
  async rewrites() {
    return [
      {
        source: '/result/:path*',
        destination: '/result',
      },
    ]
  },
};

module.exports = nextConfig;
import type { NextConfig } from 'next';
import path from 'path';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // 配置为静态导出，适合部署到 Gitee Pages
  output: 'export',
  // 静态导出的基础路径
  basePath: '',
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // 使用 webpack 而不是 Turbopack
  webpack: (config) => config,
};

// 临时禁用 PWA 以测试兼容性问题
// export default withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// })(nextConfig);

export default nextConfig;

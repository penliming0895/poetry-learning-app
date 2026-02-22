import type { Metadata, Viewport } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '初三语文古诗词背默',
    template: '%s | 古诗词背默',
  },
  description:
    '初三语文古诗词背诵与默写练习，支持逐句背诵、智能提示、语音朗读、每日任务、成就系统等功能，帮助学生轻松掌握古诗词。',
  keywords: [
    '古诗词',
    '初三语文',
    '背诵',
    '默写',
    '古诗学习',
    '诗词练习',
    '语文学习',
    '中考语文',
    '语音朗读',
    '智能提示',
  ],
  authors: [{ name: '诗词背默', url: 'https://code.coze.cn' }],
  generator: 'Next.js',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '古诗词背默',
  },
  openGraph: {
    title: '初三语文古诗词背默',
    description:
      '初三语文古诗词背诵与默写练习，支持逐句背诵、智能提示、语音朗读等功能',
    url: '/',
    siteName: '古诗词背默',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}

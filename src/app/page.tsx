'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, PenTool, Trophy, GraduationCap, AlertCircle, Sparkles, Star } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { progress, getAverageAccuracy, getUnmasteredWrong, mounted } = useGameProgress();
  const [showEmoji, setShowEmoji] = useState(false);

  // 浮动emoji动画
  useEffect(() => {
    setShowEmoji(true);
  }, []);

  // 计算错题总数（只在 mounted 后计算）
  const wrongPoetryCount = mounted ? getUnmasteredWrong('poetry').length : 0;
  const wrongLineCount = mounted ? getUnmasteredWrong('line').length : 0;
  const totalWrongCount = wrongPoetryCount + wrongLineCount;

  // 浮动emoji组件
  const FloatingEmoji = ({ emoji, style }: { emoji: string; style: React.CSSProperties }) => (
    <div
      className="absolute pointer-events-none text-4xl animate-bounce"
      style={{
        ...style,
        opacity: showEmoji ? 0.6 : 0,
        transition: 'opacity 0.5s ease-in',
      }}
    >
      {emoji}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 浮动emoji装饰 */}
      <FloatingEmoji emoji="📚" style={{ top: '15%', left: '5%', animationDuration: '3s' }} />
      <FloatingEmoji emoji="✨" style={{ top: '20%', right: '8%', animationDuration: '4s', animationDelay: '0.5s' }} />
      <FloatingEmoji emoji="🎯" style={{ top: '50%', left: '3%', animationDuration: '3.5s', animationDelay: '1s' }} />
      <FloatingEmoji emoji="🏆" style={{ top: '70%', right: '5%', animationDuration: '4.5s', animationDelay: '1.5s' }} />
      <FloatingEmoji emoji="📝" style={{ bottom: '20%', left: '8%', animationDuration: '3s', animationDelay: '2s' }} />
      <FloatingEmoji emoji="🌟" style={{ bottom: '25%', right: '10%', animationDuration: '3.8s', animationDelay: '0.8s' }} />

      {/* 清除缓存链接 */}
      {mounted && (
        <div className="fixed top-2 right-2 z-50">
          <Link
            href="/clear-cache"
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            清除缓存
          </Link>
        </div>
      )}

      {/* 主容器 */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 头部 */}
        <header className="mb-12 text-center animate-fade-in-down">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900 dark:to-purple-900 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x leading-tight">
            初三语文古诗词背默
          </h1>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 leading-relaxed">
            游戏化学习，轻松掌握必背古诗词 🎮
          </p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            让背诵不再枯燥，让学习充满乐趣 ✨
          </p>
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 hover:scale-105 transition-transform cursor-default font-semibold text-sm">
              📚 60首必背古诗
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 hover:scale-105 transition-transform cursor-default font-semibold text-sm">
              🎯 练习+测试双模式
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 hover:scale-105 transition-transform cursor-default font-semibold text-sm">
              ⭐ 智能评分
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-3 py-1 hover:scale-105 transition-transform cursor-default font-semibold text-sm">
              📅 每日背默5首
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-3 py-1 hover:scale-105 transition-transform cursor-default font-semibold text-sm">
              ❌ 错题本
            </Badge>
          </div>
        </header>

        {/* 每日背默任务 */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            今日任务
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </h2>
          <Link href="/daily" className="group block">
            <Card
              className={`cursor-pointer border-2 transition-all duration-300 overflow-hidden ${
                hoveredCard === 'daily'
                  ? 'scale-[1.02] border-orange-500 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                  : 'hover:scale-[1.01] hover:shadow-xl border-orange-200'
              }`}
              onMouseEnter={() => setHoveredCard('daily')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2 tracking-tight">
                        每日背默5首
                        <span className="text-sm font-normal text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full">
                          🔥 热门
                        </span>
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-relaxed">
                        根据日期自动轮换，每天5首新诗词
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    开始今日任务 🚀
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 游戏模式选择 */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            选择游戏模式
            <Star className="h-6 w-6 text-yellow-500" />
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* 练习模式 */}
            <Link href="/practice" className="group block">
              <Card
                className={`cursor-pointer transition-all duration-300 h-full ${
                  hoveredCard === 'practice'
                    ? 'scale-[1.02] border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                    : 'hover:scale-[1.01] hover:shadow-xl border-blue-200'
                }`}
                onMouseEnter={() => setHoveredCard('practice')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">背诵练习模式</CardTitle>
                  <CardDescription>
                    逐句背诵，智能提示，轻松掌握每首诗词 📖
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    开始练习 💪
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* 测试模式 */}
            <Link href="/test" className="group block">
              <Card
                className={`cursor-pointer transition-all duration-300 h-full ${
                  hoveredCard === 'test'
                    ? 'scale-[1.02] border-purple-500 shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                    : 'hover:scale-[1.01] hover:shadow-xl border-purple-200'
                }`}
                onMouseEnter={() => setHoveredCard('test')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">默写测试模式</CardTitle>
                  <CardDescription>
                    完整默写，智能评分，检验学习成果 ✍️
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    开始测试 🎯
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* 错题本 */}
            <Link href="/wrongbook" className="group block">
              <Card
                className={`cursor-pointer transition-all duration-300 h-full ${
                  hoveredCard === 'wrongbook'
                    ? 'scale-[1.02] border-red-500 shadow-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
                    : 'hover:scale-[1.01] hover:shadow-xl border-red-200'
                }`}
                onMouseEnter={() => setHoveredCard('wrongbook')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">错题本</CardTitle>
                  <CardDescription>
                    {totalWrongCount > 0
                      ? `${totalWrongCount} 道错题等待复习 📚`
                      : '记录错题，重点复习 🎯'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={totalWrongCount > 0 ? 'destructive' : 'outline'}
                    className={`w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                      totalWrongCount > 0
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                        : ''
                    }`}
                  >
                    {totalWrongCount > 0 ? '开始复习 🔥' : '查看错题本 📋'}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 成就展示 */}
        <div className="mx-auto max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card className="border-2 border-gradient bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 opacity-50 blur-3xl"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500 animate-pulse" />
                <CardTitle className="text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent dark:from-yellow-400 dark:to-orange-400">
                  学习成就
                </CardTitle>
                <Trophy className="h-8 w-8 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-white p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 dark:bg-gray-700">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    {mounted ? progress.learnedPoems.length : 0}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">📚 已学诗词</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 dark:bg-gray-700">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent dark:from-green-400 dark:to-teal-400">
                    {mounted ? `${getAverageAccuracy()}%` : '0%'}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">⭐ 正确率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 底部提示 */}
        <footer className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
            <span className="text-xl">💡</span>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
              提示：先从练习模式开始，熟悉后再进行测试，加油！
            </p>
            <span className="text-xl">✨</span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-bounce {
          animation: bounce 3s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

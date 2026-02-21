'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, PenTool, Trophy, GraduationCap } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { progress, getAverageAccuracy, mounted } = useGameProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* 主容器 */}
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-4 dark:from-blue-900 dark:to-purple-900">
            <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
            初三语文古诗词背默
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            游戏化学习，轻松掌握必背古诗词
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              60首必背古诗
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              练习+测试双模式
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              智能评分
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              每日背默5首
            </Badge>
          </div>
        </header>

        {/* 每日背默任务 */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
            今日任务
          </h2>
          <Link href="/daily" className="group">
            <Card
              className={`cursor-pointer border-2 transition-all duration-300 ${
                hoveredCard === 'daily'
                  ? 'scale-105 border-orange-500 shadow-xl'
                  : 'hover:scale-102 hover:shadow-lg'
              }`}
              onMouseEnter={() => setHoveredCard('daily')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        每日背默5首
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        根据日期自动轮换，每天5首新诗词
                      </p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    开始今日任务
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 游戏模式选择 */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
            选择游戏模式
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* 练习模式 */}
            <Link href="/practice" className="group">
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  hoveredCard === 'practice'
                    ? 'scale-105 border-blue-500 shadow-xl'
                    : 'hover:scale-102 hover:shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('practice')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">背诵练习模式</CardTitle>
                  <CardDescription>
                    逐句背诵，智能提示，轻松掌握每首诗词
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    开始练习
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* 测试模式 */}
            <Link href="/test" className="group">
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  hoveredCard === 'test'
                    ? 'scale-105 border-purple-500 shadow-xl'
                    : 'hover:scale-102 hover:shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard('test')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">默写测试模式</CardTitle>
                  <CardDescription>
                    完整默写，智能评分，检验学习成果
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800">
                    开始测试
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 成就展示 */}
        <Card className="mx-auto max-w-2xl border-2 border-gradient bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-2xl">学习成就</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {mounted ? progress.learnedPoems.length : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">已学诗词</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-700">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {mounted ? progress.testCount : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">测试次数</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-700">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {mounted ? `${getAverageAccuracy()}%` : '0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">正确率</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 提示：先从练习模式开始，熟悉后再进行测试</p>
        </footer>
      </div>
    </div>
  );
}

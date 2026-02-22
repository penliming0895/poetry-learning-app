'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Award } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function HomeContent() {
  try {
    const { getUnmasteredWrong, mounted } = useGameProgress();

    // 计算错题总数
    const wrongPoetryCount = mounted ? getUnmasteredWrong('poetry').length : 0;
    const wrongLineCount = mounted ? getUnmasteredWrong('line').length : 0;
    const totalWrongCount = wrongPoetryCount + wrongLineCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="container mx-auto py-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            初三语文古诗词背默
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            积少成多，日有所成
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            今日任务
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </h2>
          <Link href="/daily" className="block">
            <Card className="border-2 border-orange-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">📅 每日背默5首</h3>
                    <p className="text-gray-600 dark:text-gray-300">根据日期自动轮换，每天5首新诗词</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    开始今日任务 🚀
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
            选择游戏模式
            <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/practice" className="block">
              <Card className="border-2 border-blue-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                  <CardTitle className="text-xl">📖 背诵练习模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">逐句背诵，智能提示，轻松掌握每首诗词</p>
                  <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:scale-105">
                    开始练习 💪
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/test" className="block">
              <Card className="border-2 border-purple-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="text-xl">✍️ 默写测试模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">完整默写，智能评分，检验学习成果</p>
                  <div className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:scale-105">
                    开始测试 🎯
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wrongbook" className="block">
              <Card className={`border-2 ${totalWrongCount > 0 ? 'border-red-300' : 'border-gray-200'} hover:scale-[1.02] hover:shadow-2xl ${totalWrongCount > 0 ? 'hover:shadow-red-200/50' : ''} transition-all duration-300 h-full ${totalWrongCount > 0 ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20' : 'bg-white dark:bg-gray-800'}`}>
                <CardHeader>
                  <CardTitle className="text-xl">📋 错题本</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {totalWrongCount > 0
                      ? `${totalWrongCount} 道错题等待复习`
                      : '记录错题，重点复习'}
                  </p>
                  <div className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:scale-105 ${
                    totalWrongCount > 0
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                    {totalWrongCount > 0 ? '开始复习 🔥' : '查看错题本 📋'}
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/achievements" className="block">
              <Card className="border-2 border-yellow-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-300 h-full bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    🏆 成就系统
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md">NEW</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">解锁成就，收集徽章，展示你的学习成果</p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">已解锁成就</span>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">查看详情 →</span>
                    </div>
                  </div>
                  <div className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 text-center shadow-md hover:shadow-lg transform hover:scale-105">
                    查看成就 ✨
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 底部提示信息 */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💡 学习小贴士
          </h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <p>📚 建议每天坚持背诵，积少成多，日有所成</p>
            <p>🎯 配合错题本复习，攻克难点，事半功倍</p>
            <p>🏆 完成每日任务解锁成就，展示你的学习成果</p>
          </div>
          <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>🎧 语音朗读功能推荐使用</span>
            <span className="font-semibold">Chrome</span>
            <span>或</span>
            <span className="font-semibold">Firefox</span>
            <span>浏览器</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 5s linear infinite;
        }
      `}</style>
    </div>
    );
  } catch (error) {
    console.error('HomeContent error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">应用加载失败</h1>
            <p className="text-gray-600 mb-4">抱歉，应用遇到了一些问题。请尝试以下操作：</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>刷新页面</li>
              <li>清除浏览器缓存</li>
              <li>使用 Chrome 或 Edge 浏览器</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// 默认导出，使用 ErrorBoundary 包裹
export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}

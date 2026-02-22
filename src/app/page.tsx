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
    const [clickLog, setClickLog] = useState<string[]>([]);
    const [showDebug, setShowDebug] = useState(false);

    // 计算错题总数
    const wrongPoetryCount = mounted ? getUnmasteredWrong('poetry').length : 0;
    const wrongLineCount = mounted ? getUnmasteredWrong('line').length : 0;
    const totalWrongCount = wrongPoetryCount + wrongLineCount;

    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setClickLog(prev => [`[${timestamp}] ${message}`, ...prev]);
      console.log(message);
    };

    // 全局错误监听
    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        const errorMsg = `Global Error: ${event.message}`;
        addLog(errorMsg);
        console.error('全局错误:', event);
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
        addLog(errorMsg);
        console.error('未处理的 Promise 拒绝:', event);
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 relative">
      {/* 调试面板 */}
      {showDebug && (
        <div className="fixed top-0 right-0 w-80 max-h-96 bg-black text-green-400 p-4 overflow-y-auto z-[9999] font-mono text-xs">
          <button
            onClick={() => setShowDebug(false)}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
          >
            关闭
          </button>
          <div className="mt-6">
            <div className="font-bold mb-2">点击日志:</div>
            {clickLog.length === 0 && <div>暂无点击记录</div>}
            {clickLog.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
          </div>
          <button
            onClick={() => {
              addLog('清除日志');
              setClickLog([]);
            }}
            className="mt-4 bg-blue-500 text-white px-2 py-1 rounded"
          >
            清除日志
          </button>
        </div>
      )}

      {/* 调试按钮 */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed top-2 right-2 z-[9999] bg-gray-800 text-white px-3 py-1 rounded text-xs"
      >
        {showDebug ? '隐藏调试' : '显示调试'}
      </button>

      <div className="container mx-auto py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          初三语文古诗词背默
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            今日任务
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </h2>
          <Link href="/daily" className="block">
            <Card className="border-2 border-orange-200 hover:scale-[1.02] hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">📅 每日背默5首</h3>
                    <p className="text-gray-600 mt-1">根据日期自动轮换，每天5首新诗词</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all">
                    开始今日任务 🚀
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            选择游戏模式
            <Star className="h-6 w-6 text-yellow-500" />
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/practice" className="block">
              <Card className="border-2 border-blue-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl">📖 背诵练习模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">逐句背诵，智能提示，轻松掌握每首诗词</p>
                  <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-center">
                    开始练习 💪
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/test" className="block">
              <Card className="border-2 border-purple-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl">✍️ 默写测试模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">完整默写，智能评分，检验学习成果</p>
                  <div className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all text-center">
                    开始测试 🎯
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wrongbook" className="block">
              <Card className="border-2 border-red-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl">📋 错题本</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {totalWrongCount > 0
                      ? `${totalWrongCount} 道错题等待复习`
                      : '记录错题，重点复习'}
                  </p>
                  <div className={`w-full py-2 rounded-lg font-semibold transition-all text-center ${
                    totalWrongCount > 0
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}>
                    {totalWrongCount > 0 ? '开始复习 🔥' : '查看错题本 📋'}
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/achievements" className="block">
              <Card className="border-2 border-yellow-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    🏆 成就系统
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500">NEW</Badge>
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
                  <div className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all text-center">
                    查看成就 ✨
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* 快速测试链接 */}
        <div className="text-center mt-12 p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold mb-4">快速测试（点击这些链接应该可以跳转）</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/daily" onClick={() => addLog('测试链接: daily')} className="text-blue-600 hover:underline">
              直接跳转到每日背默
            </a>
            <a href="/practice" onClick={() => addLog('测试链接: practice')} className="text-blue-600 hover:underline">
              直接跳转到练习模式
            </a>
            <a href="/test" onClick={() => addLog('测试链接: test')} className="text-blue-600 hover:underline">
              直接跳转到测试模式
            </a>
            <a href="/wrongbook" onClick={() => addLog('测试链接: wrongbook')} className="text-blue-600 hover:underline">
              直接跳转到错题本
            </a>
            <a href="/voice-test" onClick={() => addLog('测试链接: voice-test')} className="text-purple-600 hover:underline font-semibold">
              🎤 语音朗读测试
            </a>
          </div>
        </div>
      </div>
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

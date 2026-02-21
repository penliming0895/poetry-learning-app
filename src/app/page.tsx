'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function Home() {
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

  const handleCardClick = (type: string, e: React.MouseEvent) => {
    addLog(`卡片点击: ${type}, 阻止状态: ${e.defaultPrevented}`);
    e.preventDefault();
    window.location.href = '/' + type;
  };

  const handleButtonClick = (type: string, e: React.MouseEvent) => {
    addLog(`按钮点击: ${type}, 阻止状态: ${e.defaultPrevented}`);
    e.stopPropagation();
    e.preventDefault();
    window.location.href = '/' + type;
  };

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
          <div
            onClick={(e) => handleCardClick('daily', e)}
            onMouseDown={() => addLog('mousedown: daily')}
            onMouseUp={() => addLog('mouseup: daily')}
            className="cursor-pointer"
          >
            <Card className="border-2 border-orange-200 hover:scale-[1.02] hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">📅 每日背默5首</h3>
                    <p className="text-gray-600 mt-1">根据日期自动轮换，每天5首新诗词</p>
                  </div>
                  <button
                    onClick={(e) => handleButtonClick('daily', e)}
                    onMouseDown={() => addLog('mousedown button: daily')}
                    onMouseUp={() => addLog('mouseup button: daily')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    开始今日任务 🚀
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            选择游戏模式
            <Star className="h-6 w-6 text-yellow-500" />
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div
              onClick={(e) => handleCardClick('practice', e)}
              onMouseDown={() => addLog('mousedown: practice')}
              onMouseUp={() => addLog('mouseup: practice')}
              className="cursor-pointer"
            >
              <Card className="border-2 border-blue-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl">📖 背诵练习模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">逐句背诵，智能提示，轻松掌握每首诗词</p>
                  <button
                    onClick={(e) => handleButtonClick('practice', e)}
                    onMouseDown={() => addLog('mousedown button: practice')}
                    onMouseUp={() => addLog('mouseup button: practice')}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    开始练习 💪
                  </button>
                </CardContent>
              </Card>
            </div>

            <div
              onClick={(e) => handleCardClick('test', e)}
              onMouseDown={() => addLog('mousedown: test')}
              onMouseUp={() => addLog('mouseup: test')}
              className="cursor-pointer"
            >
              <Card className="border-2 border-purple-200 hover:scale-[1.02] hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="text-xl">✍️ 默写测试模式</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">完整默写，智能评分，检验学习成果</p>
                  <button
                    onClick={(e) => handleButtonClick('test', e)}
                    onMouseDown={() => addLog('mousedown button: test')}
                    onMouseUp={() => addLog('mouseup button: test')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                  >
                    开始测试 🎯
                  </button>
                </CardContent>
              </Card>
            </div>

            <div
              onClick={(e) => handleCardClick('wrongbook', e)}
              onMouseDown={() => addLog('mousedown: wrongbook')}
              onMouseUp={() => addLog('mouseup: wrongbook')}
              className="cursor-pointer"
            >
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
                  <button
                    onClick={(e) => handleButtonClick('wrongbook', e)}
                    onMouseDown={() => addLog('mousedown button: wrongbook')}
                    onMouseUp={() => addLog('mouseup button: wrongbook')}
                    className={`w-full py-2 rounded-lg font-semibold transition-all ${
                      totalWrongCount > 0
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {totalWrongCount > 0 ? '开始复习 🔥' : '查看错题本 📋'}
                  </button>
                </CardContent>
              </Card>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

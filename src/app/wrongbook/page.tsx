'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw, Trash2, AlertCircle, Sparkles, Star, Zap } from 'lucide-react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { WrongPoetry, WrongLine } from '@/types/poetry';

export default function WrongBookPage() {
  const [activeTab, setActiveTab] = useState<'poetry' | 'line'>('poetry');
  const {
    getUnmasteredWrong,
    markAsMastered,
    clearMastered,
    progress,
    mounted,
  } = useGameProgress();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  const wrongPoetryList = getUnmasteredWrong('poetry') as WrongPoetry[];
  const wrongLineList = getUnmasteredWrong('line') as WrongLine[];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 p-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl py-8 relative z-10">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Badge variant="outline" className="px-3 py-1 border-2 border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 bg-white dark:bg-gray-800">
            ❌ 错题本
          </Badge>
        </div>

        {/* 标题区域 */}
        <div className="mb-8 animate-fade-in-down">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-4xl font-extrabold text-transparent dark:from-red-400 dark:to-orange-400 tracking-tight">
                错题本
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                记录答错的题目，方便针对性复习
                <Sparkles className="h-5 w-5 text-orange-500" />
              </p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 animate-fade-in-up">
          <Card className="border-2 border-red-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-red-500" />
                    整首诗词错题
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">
                    {wrongPoetryList.length}
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    单句错题
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mt-2">
                    {wrongLineList.length}
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 空状态 */}
        {wrongPoetryList.length === 0 && wrongLineList.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-xl animate-fade-in-up">
            <CardContent className="p-16 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-6 shadow-lg animate-bounce">
                  <CheckCircle2 className="h-20 w-20 text-white" />
                </div>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
                🎉 太棒了！没有错题
              </h3>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                继续保持，你已经掌握了所有内容！
                <Star className="h-5 w-5 text-yellow-500" />
              </p>
              <Link href="/daily">
                <Button className="h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Zap className="mr-2 h-6 w-6" />
                  开始每日背默
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* 错题列表 */}
        {(wrongPoetryList.length > 0 || wrongLineList.length > 0) && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'poetry' | 'line')} className="animate-fade-in-up">
            <TabsList className="mb-6 grid w-full grid-cols-2 h-12 bg-white dark:bg-gray-800 border-2">
              <TabsTrigger
                value="poetry"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                📚 整首诗词 ({wrongPoetryList.length})
              </TabsTrigger>
              <TabsTrigger
                value="line"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                📝 单句错题 ({wrongLineList.length})
              </TabsTrigger>
            </TabsList>

            {/* 整首诗词错题 */}
            <TabsContent value="poetry" className="space-y-4">
              {wrongPoetryList.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      暂无整首诗词错题
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {wrongPoetryList.map((wrongPoetry: WrongPoetry, index: number) => (
                    <Card
                      key={wrongPoetry.poetryId}
                      className="border-2 border-red-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-2 text-2xl font-semibold flex items-center gap-2">
                              <BookOpen className="h-6 w-6 text-red-500" />
                              {wrongPoetry.poetryTitle}
                            </CardTitle>
                            <CardDescription className="text-base flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {wrongPoetry.author} · {wrongPoetry.dynasty || '佚名'}
                            </CardDescription>
                          </div>
                          <Badge variant="destructive" className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500">
                            🔥 错{wrongPoetry.wrongCount}次
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 rounded-xl bg-gradient-to-r from-red-100 to-orange-100 p-4 dark:from-red-900/30 dark:to-orange-900/30 border-2 border-red-200 dark:border-red-800">
                          <p className="text-base text-red-900 dark:text-red-100 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            上次错误：{formatDate(wrongPoetry.lastWrongDate)}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Link href={`/practice?poemId=${wrongPoetry.poetryId}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full h-12 bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 border-2 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <BookOpen className="mr-2 h-5 w-5" />
                              练习
                            </Button>
                          </Link>
                          <Link href={`/test?poemId=${wrongPoetry.poetryId}`} className="flex-1">
                            <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <RotateCcw className="mr-2 h-5 w-5" />
                              重新测试
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsMastered('poetry', wrongPoetry.poetryId)}
                            className="h-12 w-12 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition-all duration-300 transform hover:scale-110"
                            title="标记为已掌握"
                          >
                            <CheckCircle2 className="h-6 w-6" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {wrongPoetryList.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => clearMastered('poetry')}
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      清除所有已掌握的错题
                    </Button>
                  )}
                </>
              )}
            </TabsContent>

            {/* 单句错题 */}
            <TabsContent value="line" className="space-y-4">
              {wrongLineList.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      暂无单句错题
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {wrongLineList.map((wrongLine: WrongLine, index: number) => (
                    <Card
                      key={`${wrongLine.poetryId}-${wrongLine.lineIndex}`}
                      className="border-2 border-orange-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-2 text-2xl font-semibold flex items-center gap-2">
                              <BookOpen className="h-6 w-6 text-orange-500" />
                              {wrongLine.poetryTitle}
                            </CardTitle>
                            <CardDescription className="text-base flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {wrongLine.author} · 第{wrongLine.lineIndex + 1}句
                            </CardDescription>
                          </div>
                          <Badge variant="destructive" className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500">
                            🔥 错{wrongLine.wrongCount}次
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 rounded-xl bg-gradient-to-r from-orange-100 to-yellow-100 p-4 dark:from-orange-900/30 dark:to-yellow-900/30 border-2 border-orange-200 dark:border-orange-800">
                          <p className="text-base text-orange-900 dark:text-orange-100 flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5" />
                            上次错误：{formatDate(wrongLine.lastWrongDate)}
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                            {wrongLine.lineContent}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Link href={`/practice?poemId=${wrongLine.poetryId}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full h-12 bg-white hover:bg-orange-50 dark:bg-gray-800 dark:hover:bg-orange-900/20 border-2 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <BookOpen className="mr-2 h-5 w-5" />
                              练习
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsMastered('line', wrongLine.poetryId, wrongLine.lineIndex)}
                            className="h-12 w-12 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition-all duration-300 transform hover:scale-110"
                            title="标记为已掌握"
                          >
                            <CheckCircle2 className="h-6 w-6" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {wrongLineList.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 transition-all duration-300 transform hover:-translate-y-1"
                      onClick={() => clearMastered('line')}
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      清除所有已掌握的错题
                    </Button>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
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
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

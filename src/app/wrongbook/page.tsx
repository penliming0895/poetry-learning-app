'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
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

  const wrongPoetryList = getUnmasteredWrong('poetry') as WrongPoetry[];
  const wrongLineList = getUnmasteredWrong('line') as WrongLine[];

  if (!mounted) {
    return <div>加载中...</div>;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Badge variant="outline" className="border-red-500 text-red-600 dark:border-red-400 dark:text-red-400">
            错题本
          </Badge>
        </div>

        {/* 标题区域 */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent dark:from-red-400 dark:to-orange-400">
                错题本
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                记录答错的题目，方便针对性复习
              </p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Card className="border-2 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">整首诗词错题</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {wrongPoetryList.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">单句错题</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {wrongLineList.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 空状态 */}
        {wrongPoetryList.length === 0 && wrongLineList.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                太棒了！没有错题
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                继续保持，你已经掌握了所有内容！
              </p>
              <Link href="/daily">
                <Button className="bg-gradient-to-r from-red-600 to-orange-600">
                  开始每日背默
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* 错题列表 */}
        {(wrongPoetryList.length > 0 || wrongLineList.length > 0) && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'poetry' | 'line')}>
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="poetry">
                整首诗词 ({wrongPoetryList.length})
              </TabsTrigger>
              <TabsTrigger value="line">
                单句错题 ({wrongLineList.length})
              </TabsTrigger>
            </TabsList>

            {/* 整首诗词错题 */}
            <TabsContent value="poetry" className="space-y-4">
              {wrongPoetryList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300">暂无整首诗词错题</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {wrongPoetryList.map((wrongPoetry: WrongPoetry, index: number) => (
                    <Card key={wrongPoetry.poetryId} className="border-2 border-red-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-1">{wrongPoetry.poetryTitle}</CardTitle>
                            <CardDescription className="text-sm">
                              {wrongPoetry.author} · {wrongPoetry.dynasty || '佚名'}
                            </CardDescription>
                          </div>
                          <Badge variant="destructive">
                            错{wrongPoetry.wrongCount}次
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                          <p className="text-sm text-red-900 dark:text-red-100">
                            <AlertCircle className="mr-2 inline-block h-4 w-4" />
                            上次错误：{formatDate(wrongPoetry.lastWrongDate)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/practice?poemId=${wrongPoetry.poetryId}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <BookOpen className="mr-2 h-4 w-4" />
                              练习
                            </Button>
                          </Link>
                          <Link href={`/test?poemId=${wrongPoetry.poetryId}`} className="flex-1">
                            <Button className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                              <RotateCcw className="mr-2 h-4 w-4" />
                              重新测试
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsMastered('poetry', wrongPoetry.poetryId)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {wrongPoetryList.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => clearMastered('poetry')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      清除所有已掌握的错题
                    </Button>
                  )}
                </>
              )}
            </TabsContent>

            {/* 单句错题 */}
            <TabsContent value="line" className="space-y-4">
              {wrongLineList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300">暂无单句错题</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {wrongLineList.map((wrongLine: WrongLine, index: number) => (
                    <Card key={`${wrongLine.poetryId}-${wrongLine.lineIndex}`} className="border-2 border-orange-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-1">{wrongLine.poetryTitle}</CardTitle>
                            <CardDescription className="text-sm">
                              {wrongLine.author} · 第{wrongLine.lineIndex + 1}句
                            </CardDescription>
                          </div>
                          <Badge variant="destructive">
                            错{wrongLine.wrongCount}次
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                          <p className="text-sm text-orange-900 dark:text-orange-100">
                            <AlertCircle className="mr-2 inline-block h-4 w-4" />
                            上次错误：{formatDate(wrongLine.lastWrongDate)}
                          </p>
                          <p className="mt-2 text-base font-medium">
                            {wrongLine.lineContent}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/practice?poemId=${wrongLine.poetryId}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <BookOpen className="mr-2 h-4 w-4" />
                              练习
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsMastered('line', wrongLine.poetryId, wrongLine.lineIndex)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {wrongLineList.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => clearMastered('line')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      清除所有已掌握的错题
                    </Button>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

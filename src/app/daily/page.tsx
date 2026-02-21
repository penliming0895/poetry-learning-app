'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, BookOpen, CheckCircle2, Circle, Play } from 'lucide-react';
import { getDailyPoetry } from '@/data/poetryData';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function DailyPage() {
  const [dailyPoems, setDailyPoems] = useState<Poetry[]>([]);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const { recordPractice, recordTest, getBestScore, mounted } = useGameProgress();

  useEffect(() => {
    setDailyPoems(getDailyPoetry());
  }, []);

  const handlePoetryComplete = (index: number, score: number) => {
    const newCompleted = new Set(completed);
    newCompleted.add(index);
    setCompleted(newCompleted);

    // 记录进度
    const poem = dailyPoems[index];
    if (score >= 60) {
      recordTest(poem.id, score);
    }

    // 自动跳转到下一首
    if (index < dailyPoems.length - 1) {
      setCurrentPoetryIndex(index + 1);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  };

  const overallProgress = (completed.size / 5) * 100;

  if (!mounted) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4" />
            {getTodayDate()}
          </div>
        </div>

        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
            每日背默
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            今天需要背诵5首古诗词，坚持学习，积少成多！
          </p>
        </div>

        {/* 整体进度 */}
        <Card className="mb-6 border-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">今日进度</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  已完成 {completed.size}/5 首
                </p>
              </div>
              <Badge variant={overallProgress === 100 ? 'default' : 'secondary'}>
                {Math.round(overallProgress)}%
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* 每日诗词列表 */}
        <div className="space-y-4">
          {dailyPoems.map((poem, index) => {
            const isCompleted = completed.has(index);
            const isCurrent = index === currentPoetryIndex;
            const bestScore = getBestScore(poem.id);

            return (
              <Card
                key={poem.id}
                className={`transition-all ${
                  isCurrent
                    ? 'border-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          第{index + 1}首
                        </span>
                        {isCompleted && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        {!isCompleted && (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <Badge variant="outline">{poem.difficulty}</Badge>
                      </div>
                      <CardTitle className="mb-1">{poem.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {poem.author} · {poem.dynasty || '佚名'}
                      </CardDescription>
                    </div>
                    {bestScore > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        最高: {bestScore}分
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {poem.content.substring(0, 50)}...
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!isCompleted ? (
                        <>
                          <Link href={`/practice?poemId=${poem.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setCurrentPoetryIndex(index)}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              练习
                            </Button>
                          </Link>
                          <Link href={`/test?poemId=${poem.id}`} className="flex-1">
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              onClick={() => setCurrentPoetryIndex(index)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              测试
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div className="flex-1">
                          <Button variant="outline" className="w-full" disabled>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            已完成
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 底部提示 */}
        {overallProgress === 100 && (
          <Card className="mt-6 border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-600 dark:text-green-400" />
              <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
                今日任务完成！
              </h3>
              <p className="text-green-700 dark:text-green-300">
                你已经完成了今天的5首诗词背诵，继续保持！
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, BookOpen, CheckCircle2, Circle, Play, Sparkles, Star, Trophy, Flame } from 'lucide-react';
import { getDailyPoetry } from '@/data/poetryData';
import VoicePlayer from '@/components/VoicePlayer';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function DailyPage() {
  const [dailyPoems, setDailyPoems] = useState<Poetry[]>([]);
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const { recordPractice, recordTest, getBestScore, mounted } = useGameProgress();
  const { recordDaily, recordPractice: recordDailyPractice, recordTest: recordDailyTest } = useAchievements();

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
      recordDailyTest(poem.id, score);
      recordDailyPractice(poem.id, score);
      recordDaily();
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20 p-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl py-8 relative z-10">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-800 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {getTodayDate()}
          </Badge>
        </div>

        {/* 标题区域 */}
        <div className="mb-8 animate-fade-in-down">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <img src="/li_qingzhao.png" alt="李清照" className="h-10 w-10 rounded-full object-cover" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-4xl font-extrabold text-transparent dark:from-orange-400 dark:to-red-400 tracking-tight">
                每日背默
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                今天需要背诵5首古诗词，坚持学习，积少成多！
                <Sparkles className="h-5 w-5 text-orange-500" />
              </p>
            </div>
          </div>
        </div>

        {/* 整体进度 */}
        <Card className="mb-8 border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 animate-fade-in-up">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  今日进度
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  已完成 <span className="font-bold">{completed.size}/5</span> 首
                </p>
              </div>
              <Badge
                variant={overallProgress === 100 ? 'default' : 'secondary'}
                className={`px-4 py-2 text-base font-bold ${
                  overallProgress === 100
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                }`}
              >
                {Math.round(overallProgress)}%
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-4 bg-orange-100 dark:bg-orange-900" />
          </CardContent>
        </Card>

        {/* 每日诗词列表 */}
        <div className="space-y-6 animate-fade-in-up">
          {dailyPoems.map((poem, index) => {
            const isCompleted = completed.has(index);
            const isCurrent = index === currentPoetryIndex;
            const bestScore = getBestScore(poem.id);

            return (
              <Card
                key={poem.id}
                className={`transition-all duration-300 hover:scale-[1.02] ${
                  isCurrent
                    ? 'border-2 border-orange-500 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30'
                    : isCompleted
                    ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
                    : 'border-2 hover:border-orange-400 bg-white dark:bg-gray-800'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="px-3 py-1 font-semibold bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 dark:from-orange-900 dark:to-red-900 dark:text-orange-300 border-2"
                        >
                          第{index + 1}首
                        </Badge>
                        {isCompleted ? (
                          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full dark:bg-green-900/30">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">已完成</span>
                          </div>
                        ) : isCurrent ? (
                          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full dark:bg-orange-900/30">
                            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400 animate-pulse" />
                            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">进行中</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full dark:bg-gray-700">
                            <Circle className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">待完成</span>
                          </div>
                        )}
                        <Badge variant="outline" className="px-3 py-1">
                          {poem.difficulty === 'easy' ? '🌟 简单' : poem.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 困难'}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-semibold mb-2 flex items-center gap-2">
                        <img src="/bai_juyi.png" alt="白居易" className="h-6 w-6 rounded-full object-cover" />
                        {poem.title}
                      </CardTitle>
                      <CardDescription className="text-base flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {poem.author} · {poem.dynasty || '佚名'}
                      </CardDescription>
                    </div>
                    {bestScore > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-800"
                      >
                        🏆 {bestScore}分
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-5 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {poem.content.substring(0, 50)}...
                      </p>
                      <div>
                        <VoicePlayer text={poem.content} />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!isCompleted ? (
                        <>
                          <Link href={`/practice?poemId=${poem.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full h-12 bg-white hover:bg-orange-50 dark:bg-gray-800 dark:hover:bg-orange-900/20 border-2 hover:border-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                              onClick={() => setCurrentPoetryIndex(index)}
                            >
                              <BookOpen className="mr-2 h-5 w-5" />
                              练习
                            </Button>
                          </Link>
                          <Link href={`/test?poemId=${poem.id}`} className="flex-1">
                            <Button
                              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                              onClick={() => setCurrentPoetryIndex(index)}
                            >
                              <Play className="mr-2 h-5 w-5" />
                              测试
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full h-12 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-300 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300 dark:border-green-700"
                            disabled
                          >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
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
          <Card className="mt-8 border-2 border-green-500 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 animate-fade-in-up">
            <CardContent className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-6 shadow-lg animate-bounce">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-green-900 dark:text-green-100 flex items-center justify-center gap-2">
                🎉 今日任务完成！
              </h3>
              <p className="text-lg text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                你已经完成了今天的5首诗词背诵，继续保持！
                <Star className="h-5 w-5" />
              </p>
            </CardContent>
          </Card>
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

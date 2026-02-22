'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Eye, EyeOff, CheckCircle, XCircle, Lightbulb, Sparkles, Star, Zap } from 'lucide-react';
import VoicePlayer from '@/components/VoicePlayer';
import { poetryDatabase, getPoetryById } from '@/data/poetryData';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useAchievements } from '@/hooks/useAchievements';

function PracticeContent() {
  const searchParams = useSearchParams();
  const poemId = searchParams.get('poemId');

  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { recordPractice, recordWrongLine } = useGameProgress();
  const { recordPractice: recordPracticeAchievement, recordWrongLineReview } = useAchievements();

  // 如果有poemId，跳转到对应的诗词
  useEffect(() => {
    if (poemId) {
      const index = poetryDatabase.findIndex(p => p.id === poemId);
      if (index !== -1) {
        setCurrentPoetryIndex(index);
      }
    }
  }, [poemId]);

  const currentPoetry: Poetry = poetryDatabase[currentPoetryIndex];
  const totalLines = currentPoetry.lines.length;
  const progress = ((currentLineIndex) / totalLines) * 100;

  const handleNextLine = (isCorrect: boolean) => {
    setIsAnimating(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      // 记录答错的句子
      recordWrongLine(
        currentPoetry.id,
        currentPoetry.title,
        currentLineIndex,
        currentPoetry.lines[currentLineIndex],
        currentPoetry.author
      );
      recordWrongLineReview();
    }

    setTimeout(() => {
      if (currentLineIndex < totalLines - 1) {
        setCurrentLineIndex(prev => prev + 1);
        setShowAnswer(false);
        setShowHint(false);
        setIsAnimating(false);
      } else {
        // 记录练习进度
        const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrectCount / totalLines) * 100);
        recordPractice(currentPoetry.id, finalCorrectCount, totalLines);
        recordPracticeAchievement(currentPoetry.id, score);
        setCompleted(true);
        setIsAnimating(false);
      }
    }, 300);
  };

  const handleNextPoetry = () => {
    if (currentPoetryIndex < poetryDatabase.length - 1) {
      setCurrentPoetryIndex(prev => prev + 1);
      setCurrentLineIndex(0);
      setShowAnswer(false);
      setCompleted(false);
      setCorrectCount(0);
      setShowHint(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const getHint = (fullLine: string): string => {
    // 根据诗句长度智能显示提示：显示前4-6个字符，或者一半的字符
    const hintLength = Math.max(4, Math.ceil(fullLine.length / 2));
    return fullLine.substring(0, hintLength) + '...';
  };

  if (completed) {
    const score = Math.round((correctCount / totalLines) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto max-w-2xl py-8 relative z-10">
          <Card className="border-2 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 opacity-50"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mb-4 flex justify-center animate-bounce">
                <div className={`rounded-full p-6 shadow-lg transform hover:scale-110 transition-transform ${
                  score >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  score >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  'bg-gradient-to-br from-red-400 to-pink-500'
                }`}>
                  {score >= 80 ? (
                    <CheckCircle className="h-16 w-16 text-white" />
                  ) : (
                    <XCircle className="h-16 w-16 text-white" />
                  )}
                </div>
              </div>
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent dark:from-green-400 dark:to-blue-400 tracking-tight">
                {score >= 80 ? '🎉 太棒了！' : score >= 60 ? '👍 继续加油！' : '💪 再接再厉！'}
              </CardTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">练习完成！</p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <div className={`mb-2 text-6xl font-bold animate-pulse ${
                  score >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' :
                  score >= 60 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' :
                  'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
                }`}>
                  {score}分
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                  <span className="text-2xl">📚</span>
                  <p className="text-lg">
                    正确率：<span className="font-bold">{correctCount}/{totalLines}</span> 句
                  </p>
                  <span className="text-2xl">✨</span>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-md dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">《{currentPoetry.title}》</h3>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {currentPoetry.author} · {currentPoetry.dynasty}
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/practice" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/20 border-2 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={handleNextPoetry}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    下一首
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Zap className="mr-2 h-5 w-5" />
                    返回首页
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-3xl py-8 relative z-10">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800">
            📖 第 {currentPoetryIndex + 1}/{poetryDatabase.length} 首
          </Badge>
        </div>

        {/* 进度条 */}
        <div className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-md border-2 border-blue-200 dark:border-blue-800">
          <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              进度
            </span>
            <span className="font-semibold">
              {currentLineIndex + 1}/{totalLines} 句
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-100 dark:bg-blue-900" />
        </div>

        {/* 诗词信息 */}
        <Card className="mb-6 border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 tracking-tight">
                  {currentPoetry.title}
                </CardTitle>
                <p className="text-base text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {currentPoetry.author} · {currentPoetry.dynasty}
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                <img src="/bai_juyi.png" alt="白居易" className="h-10 w-10 rounded-full object-cover" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 背诵区域 */}
        <Card className={`mb-6 border-2 shadow-xl transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100 hover:shadow-2xl'} bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20`}>
          <CardContent className="space-y-6 p-8">
            {/* 当前诗句 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  第 {currentLineIndex + 1} 句
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowHint}
                  className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition-colors"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  提示
                </Button>
              </div>

              {/* 提示显示 */}
              {showHint && (
                <div className="rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-4 text-center shadow-md dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-200 dark:border-yellow-800 animate-fade-in">
                  <span className="text-lg">💡 提示：</span>
                  <span className="text-lg font-extrabold text-yellow-800 dark:text-yellow-200 tracking-tight">{getHint(currentPoetry.lines[currentLineIndex])}</span>
                </div>
              )}

              {/* 答案区域 */}
              <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-inner dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
                <div className="text-center min-h-[80px] flex items-center justify-center">
                  {showAnswer ? (
                    <div className="w-full">
                      <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 animate-fade-in tracking-tight mb-3">
                        {currentPoetry.lines[currentLineIndex]}
                      </div>
                      {/* 临时禁用 VoicePlayer 以诊断问题 */}
                      <div className="text-gray-500 text-sm text-center">
                        🎤 语音朗读已临时禁用（诊断模式）
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-gray-400 dark:text-gray-500">
                      <span className="text-lg">点击下方按钮查看答案</span>
                      <Eye className="h-5 w-5 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {!showAnswer ? (
                <Button
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setShowAnswer(true)}
                >
                  <Eye className="mr-2 h-6 w-6" />
                  显示答案 👀
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-14 text-lg border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleNextLine(false)}
                  >
                    <XCircle className="mr-2 h-6 w-6" />
                    没记住
                  </Button>
                  <Button
                    className="h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleNextLine(true)}
                  >
                    <CheckCircle className="mr-2 h-6 w-6" />
                    记住了
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 已背诵的诗句 */}
        {currentLineIndex > 0 && (
          <Card className="border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <CardContent className="p-6">
              <h4 className="mb-4 text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                已背诵 {currentLineIndex} 句：
              </h4>
              <div className="space-y-2">
                {currentPoetry.lines.slice(0, currentLineIndex).map((line, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 p-3 text-base text-gray-700 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-gray-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    }>
      <PracticeContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Eye, EyeOff, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { poetryDatabase } from '@/data/poetryData';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function PracticePage() {
  const [currentPoetryIndex, setCurrentPoetryIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const { recordPractice } = useGameProgress();

  const currentPoetry: Poetry = poetryDatabase[currentPoetryIndex];
  const totalLines = currentPoetry.lines.length;
  const progress = ((currentLineIndex) / totalLines) * 100;

  const handleNextLine = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentLineIndex < totalLines - 1) {
      setCurrentLineIndex(prev => prev + 1);
      setShowAnswer(false);
      setShowHint(false);
    } else {
      // 记录练习进度
      const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      recordPractice(currentPoetry.id, finalCorrectCount, totalLines);
      setCompleted(true);
    }
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
    return fullLine.substring(0, 2) + '...';
  };

  if (completed) {
    const score = Math.round((correctCount / totalLines) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className={`rounded-full p-4 ${
                  score >= 80 ? 'bg-green-100 dark:bg-green-900' :
                  score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-red-100 dark:bg-red-900'
                }`}>
                  {score >= 80 ? (
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
              <CardTitle className="text-3xl">练习完成！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`mb-2 text-5xl font-bold ${
                  score >= 80 ? 'text-green-600 dark:text-green-400' :
                  score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {score}分
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  正确率：{correctCount}/{totalLines}句
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">《{currentPoetry.title}》</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentPoetry.author} · {currentPoetry.dynasty}
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/practice" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleNextPoetry}
                  >
                    下一首
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <Badge variant="secondary">
            第 {currentPoetryIndex + 1}/{poetryDatabase.length} 首
          </Badge>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>进度</span>
            <span>{currentLineIndex + 1}/{totalLines} 句</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 诗词信息 */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentPoetry.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentPoetry.author} · {currentPoetry.dynasty}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
        </Card>

        {/* 背诵区域 */}
        <Card className="mb-6 border-2">
          <CardContent className="space-y-6 p-6">
            {/* 当前诗句 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">第 {currentLineIndex + 1} 句</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowHint}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  提示
                </Button>
              </div>

              {/* 提示显示 */}
              {showHint && (
                <div className="rounded-lg bg-yellow-50 p-3 text-center text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                  💡 提示：{getHint(currentPoetry.lines[currentLineIndex])}
                </div>
              )}

              {/* 答案区域 */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="text-center">
                  {showAnswer ? (
                    <div className="text-xl font-medium text-gray-900 dark:text-gray-100">
                      {currentPoetry.lines[currentLineIndex]}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-gray-400 dark:text-gray-500">
                      <span>点击下方按钮查看答案</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {!showAnswer ? (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => setShowAnswer(true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  显示答案
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => handleNextLine(false)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    没记住
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    onClick={() => handleNextLine(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    记住了
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 已背诵的诗句 */}
        {currentLineIndex > 0 && (
          <Card className="border-2">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                已背诵 {currentLineIndex} 句：
              </h4>
              <div className="space-y-2">
                {currentPoetry.lines.slice(0, currentLineIndex).map((line, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-blue-50 p-2 text-sm text-gray-700 dark:bg-blue-900/20 dark:text-gray-300"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

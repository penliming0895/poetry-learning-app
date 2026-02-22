'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PenTool, CheckCircle, XCircle, RotateCcw, Sparkles, Star, Zap, BookOpen } from 'lucide-react';
import VoicePlayer from '@/components/VoicePlayer';
import { poetryDatabase } from '@/data/poetryData';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useAchievements } from '@/hooks/useAchievements';

export default function TestPage() {
  const [poemId, setPoemId] = useState<string | null>(null);

  const [selectedPoetry, setSelectedPoetry] = useState<Poetry | null>(null);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedLines, setMatchedLines] = useState<number[]>([]);
  const { recordTest, recordWrongPoetry } = useGameProgress();
  const { recordTest: recordTestAchievement } = useAchievements();

  // 如果有poemId，自动选择对应的诗词
  useEffect(() => {
    // 使用传统的 URL 解析方式，兼容移动端
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('poemId');
      if (id) {
        setPoemId(id);
        const poem = poetryDatabase.find(p => p.id === id);
        if (poem) {
          setSelectedPoetry(poem);
        }
      }
    }
  }, []);

  const handleSelectPoetry = (poetry: Poetry) => {
    setSelectedPoetry(poetry);
    setUserInput('');
    setSubmitted(false);
    setScore(0);
    setMatchedLines([]);
  };

  const handleSubmit = () => {
    if (!selectedPoetry) return;

    // 简单的匹配算法：比较每一行
    let matches = 0;
    const matched: number[] = [];
    const userLines = userInput
      .split(/[，。？！、，,.?!;；]/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    selectedPoetry.lines.forEach((correctLine, idx) => {
      const normalizedCorrect = correctLine.replace(/[，。？！、，,.?!;；]/g, '').trim();
      const isMatched = userLines.some(
        userLine => {
          const normalizedUser = userLine.replace(/[，。？！、，,.?!;；]/g, '').trim();
          return normalizedUser === normalizedCorrect || normalizedUser.includes(normalizedCorrect);
        }
      );

      if (isMatched) {
        matches++;
        matched.push(idx);
      }
    });

    const finalScore = Math.round((matches / selectedPoetry.lines.length) * 100);
    setScore(finalScore);
    setMatchedLines(matched);
    setSubmitted(true);

    // 记录测试进度
    recordTest(selectedPoetry.id, finalScore);
    recordTestAchievement(selectedPoetry.id, finalScore);

    // 如果得分低于60分，记录为错题
    if (finalScore < 60) {
      recordWrongPoetry(
        selectedPoetry.id,
        selectedPoetry.title,
        selectedPoetry.author,
        selectedPoetry.dynasty,
        selectedPoetry.category
      );
    }
  };

  const handleReset = () => {
    setUserInput('');
    setSubmitted(false);
    setScore(0);
    setMatchedLines([]);
  };

  if (!selectedPoetry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900 p-4 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container mx-auto max-w-5xl py-8 relative z-10">
          {/* 顶部导航 */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>

          <div className="mb-8 animate-fade-in-down">
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <img src="/li_qingzhao.png" alt="李清照" className="h-10 w-10 rounded-full object-cover" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 tracking-tight">
                  选择要测试的诗词
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  选择一首诗词进行完整默写测试
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </p>
              </div>
            </div>
          </div>

          {/* 诗词列表 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            {poetryDatabase.map((poetry, index) => (
              <Card
                key={poetry.id}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                onClick={() => handleSelectPoetry(poetry)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 text-xl font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-500" />
                        {poetry.title}
                      </CardTitle>
                      <CardDescription className="text-sm flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {poetry.author} · {poetry.dynasty}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 ${
                        poetry.difficulty === 'easy'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : poetry.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {poetry.difficulty === 'easy' ? '🌟 简单' : poetry.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 困难'}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      {poetry.lines.length} 句
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900 p-4 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto max-w-4xl py-8 relative z-10">
          <Card className="border-2 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 opacity-50"></div>
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
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 tracking-tight">
                {score >= 80 ? '🎉 太棒了！' : score >= 60 ? '👍 继续加油！' : '💪 再接再厉！'}
              </CardTitle>
              <CardDescription className="text-lg mt-2 flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                《{selectedPoetry.title}》
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* 得分 */}
              <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <div className={`mb-2 text-6xl font-bold animate-pulse ${
                  score >= 80 ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' :
                  score >= 60 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent' :
                  'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'
                }`}>
                  {score}分
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  正确背诵 <span className="font-bold">{matchedLines.length}</span>/{selectedPoetry.lines.length} 句
                  <Star className="h-5 w-5 text-yellow-500" />
                </p>
              </div>

              {/* 正确答案对照 */}
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-6 shadow-md dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-200 dark:border-green-800">
                <h3 className="mb-4 text-xl font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  正确答案
                </h3>
                <div className="space-y-2">
                  {selectedPoetry.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 text-base transition-all duration-300 ${
                        matchedLines.includes(idx)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-2 border-green-200 dark:border-green-800'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-2 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <span className="font-bold mr-2">
                        {matchedLines.includes(idx) ? '✓ ' : '✗ '}
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* 你的答案 */}
              <div className="rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-md dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <PenTool className="h-6 w-6 text-purple-500" />
                  你的答案
                </h3>
                <div className="whitespace-pre-wrap text-base text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  {userInput || '（未填写）'}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 text-base bg-white hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900/20 border-2 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  重新默写
                </Button>
                <Link href="/test" className="flex-1">
                  <Button className="w-full h-12 text-base bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Sparkles className="mr-2 h-5 w-5" />
                    选择其他诗词
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-900 p-4 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply opacity-5 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto max-w-4xl py-8 relative z-10">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            onClick={() => setSelectedPoetry(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回选择
          </Button>
          <Badge variant="secondary" className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-800">
            ⭐ {selectedPoetry.difficulty === 'easy' ? '简单' : selectedPoetry.difficulty === 'medium' ? '中等' : '困难'}
          </Badge>
        </div>

        {/* 诗词信息 */}
        <Card className="mb-6 border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 tracking-tight">
                  {selectedPoetry.title}
                </CardTitle>
                <p className="text-base text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  {selectedPoetry.author} · {selectedPoetry.dynasty}
                </p>
                <div className="mt-3">
                  <VoicePlayer text={selectedPoetry.content} />
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                <img src="/li_qingzhao.png" alt="李清照" className="h-10 w-10 rounded-full object-cover" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 默写区域 */}
        <Card className="mb-6 border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
          <CardContent className="space-y-6 p-8">
            <div>
              <label htmlFor="poetry-input" className="mb-3 block text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                请默写这首诗词：
              </label>
              <Textarea
                id="poetry-input"
                placeholder="在这里输入你背诵的诗词内容...✍️"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[350px] text-base border-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-base text-blue-900 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-100 border-2 border-blue-200 dark:border-blue-800 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <span>提示：这首诗词共 {selectedPoetry.lines.length} 句，请尽量完整背诵</span>
              <span className="text-2xl">✨</span>
            </div>

            <Button
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={handleSubmit}
              disabled={!userInput.trim()}
            >
              <Zap className="mr-2 h-6 w-6" />
              提交测试
            </Button>
          </CardContent>
        </Card>

        {/* 诗词背景 */}
        {selectedPoetry.notes && (
          <Card className="border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30">
            <CardContent className="p-6">
              <p className="text-base text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-xl">📖</span>
                <span>
                  <strong className="text-amber-900 dark:text-amber-100">背景：</strong>
                  {selectedPoetry.notes}
                </span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

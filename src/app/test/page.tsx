'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PenTool, CheckCircle, RotateCcw } from 'lucide-react';
import { poetryDatabase } from '@/data/poetryData';
import { Poetry } from '@/types/poetry';
import { useGameProgress } from '@/hooks/useGameProgress';

export default function TestPage() {
  const searchParams = useSearchParams();
  const poemId = searchParams.get('poemId');

  const [selectedPoetry, setSelectedPoetry] = useState<Poetry | null>(null);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedLines, setMatchedLines] = useState<number[]>([]);
  const { recordTest, recordWrongPoetry } = useGameProgress();

  // 如果有poemId，自动选择对应的诗词
  useEffect(() => {
    if (poemId) {
      const poem = poetryDatabase.find(p => p.id === poemId);
      if (poem) {
        setSelectedPoetry(poem);
      }
    }
  }, [poemId]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          {/* 顶部导航 */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">选择要测试的诗词</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  选择一首诗词进行完整默写测试
                </p>
              </div>
            </div>
          </div>

          {/* 诗词列表 */}
          <div className="grid gap-4 md:grid-cols-2">
            {poetryDatabase.map((poetry) => (
              <Card
                key={poetry.id}
                className="cursor-pointer transition-all hover:scale-102 hover:shadow-lg"
                onClick={() => handleSelectPoetry(poetry)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-1">{poetry.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {poetry.author} · {poetry.dynasty}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        poetry.difficulty === 'easy'
                          ? 'secondary'
                          : poetry.difficulty === 'medium'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {poetry.difficulty === 'easy'
                        ? '简单'
                        : poetry.difficulty === 'medium'
                        ? '中等'
                        : '困难'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    共 {poetry.lines.length} 句
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
        <div className="container mx-auto max-w-3xl py-8">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className={`rounded-full p-4 ${
                  score >= 80 ? 'bg-green-100 dark:bg-green-900' :
                  score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-red-100 dark:bg-red-900'
                }`}>
                  <CheckCircle className={`h-12 w-12 ${
                    score >= 80 ? 'text-green-600 dark:text-green-400' :
                    score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`} />
                </div>
              </div>
              <CardTitle className="text-3xl">测试完成</CardTitle>
              <CardDescription>《{selectedPoetry.title}》</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 得分 */}
              <div className="text-center">
                <div className={`mb-2 text-5xl font-bold ${
                  score >= 80 ? 'text-green-600 dark:text-green-400' :
                  score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {score}分
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  正确背诵 {matchedLines.length}/{selectedPoetry.lines.length} 句
                </p>
              </div>

              {/* 正确答案对照 */}
              <div className="rounded-lg border-2 bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">正确答案：</h3>
                <div className="space-y-2">
                  {selectedPoetry.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`rounded p-2 text-sm ${
                        matchedLines.includes(idx)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {matchedLines.includes(idx) ? '✓ ' : '✗ '}
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* 你的答案 */}
              <div className="rounded-lg border-2 bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">你的答案：</h3>
                <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {userInput || '（未填写）'}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  重新默写
                </Button>
                <Link href="/test" className="flex-1">
                  <Button className="flex-1">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* 顶部导航 */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/test">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回选择
            </Button>
          </Link>
          <Badge variant="secondary">{selectedPoetry.difficulty}</Badge>
        </div>

        {/* 诗词信息 */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedPoetry.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedPoetry.author} · {selectedPoetry.dynasty}
                </p>
              </div>
              <PenTool className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
        </Card>

        {/* 默写区域 */}
        <Card className="mb-6 border-2">
          <CardContent className="space-y-4 p-6">
            <div>
              <label htmlFor="poetry-input" className="mb-2 block text-lg font-semibold">
                请默写这首诗词：
              </label>
              <Textarea
                id="poetry-input"
                placeholder="在这里输入你背诵的诗词内容..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[300px] text-base"
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
              💡 提示：这首诗词共 {selectedPoetry.lines.length} 句，请尽量完整背诵
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
              onClick={handleSubmit}
              disabled={!userInput.trim()}
            >
              提交测试
            </Button>
          </CardContent>
        </Card>

        {/* 诗词背景 */}
        {selectedPoetry.notes && (
          <Card className="border-2">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>背景：</strong>{selectedPoetry.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

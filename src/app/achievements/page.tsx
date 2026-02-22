'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Sparkles, Target, Flame, Award, Star, Calendar, BookOpen } from 'lucide-react';
import AchievementCard from '@/components/AchievementCard';
import AchievementNotification from '@/components/AchievementNotification';
import { useAchievements } from '@/hooks/useAchievements';
import { achievementsByType, tierOrder } from '@/data/achievements';

export default function AchievementsPage() {
  const {
    mounted,
    stats,
    newlyUnlocked,
    getAllAchievements,
    getUnlockedAchievements,
    clearNewUnlocked,
  } = useAchievements();

  const [selectedTab, setSelectedTab] = useState('all');

  // 获取所有成就并按类型和稀有度排序
  const allAchievements = useMemo(() => {
    if (!mounted) return [];

    const achievements = getAllAchievements();
    return achievements.sort((a, b) => {
      // 已解锁的排在前面
      const aUnlocked = !!a.unlockedAt;
      const bUnlocked = !!b.unlockedAt;

      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;

      // 同状态下按稀有度排序
      if (aUnlocked) {
        // 已解锁的按解锁时间排序
        return (b.unlockedAt || 0) - (a.unlockedAt || 0);
      } else {
        // 未解锁的按稀有度排序
        return tierOrder[b.tier] - tierOrder[a.tier];
      }
    });
  }, [mounted, getAllAchievements]);

  const unlockedAchievements = useMemo(() => getUnlockedAchievements(), [getUnlockedAchievements]);
  const lockedAchievements = useMemo(
    () => getAllAchievements().filter((a) => !a.unlockedAt),
    [getAllAchievements]
  );

  // 按类型分组成就
  const achievementsByCategory = useMemo(() => {
    if (!mounted) return {};

    const categories = {
      all: allAchievements,
      practice: allAchievements.filter((a) => a.type === 'practice'),
      test: allAchievements.filter((a) => a.type === 'test'),
      perfect: allAchievements.filter((a) => a.type === 'perfect'),
      streak: allAchievements.filter((a) => a.type === 'streak'),
      poetry: allAchievements.filter((a) => a.type === 'poetry'),
      daily: allAchievements.filter((a) => a.type === 'daily'),
      master: allAchievements.filter((a) => a.type === 'master'),
      special: allAchievements.filter((a) => a.type === 'special'),
    };

    return categories;
  }, [mounted, allAchievements]);

  // 计算完成度
  const completionRate = useMemo(() => {
    if (!mounted) return 0;
    const total = achievementsByType.practice.length +
                 achievementsByType.test.length +
                 achievementsByType.perfect.length +
                 achievementsByType.streak.length +
                 achievementsByType.poetry.length +
                 achievementsByType.daily.length +
                 achievementsByType.master.length +
                 achievementsByType.special.length;
    return Math.round((unlockedAchievements.length / total) * 100);
  }, [mounted, unlockedAchievements.length]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  const newlyUnlockedAchievements = newlyUnlocked.map((id) =>
    allAchievements.find((a) => a.id === id)
  ).filter(Boolean) as any[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 md:p-6">
      {/* 成就解锁通知 */}
      {newlyUnlockedAchievements.length > 0 && (
        <AchievementNotification
          achievements={newlyUnlockedAchievements}
          onClose={clearNewUnlocked}
        />
      )}

      {/* 头部导航 */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              我的成就
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              已解锁 {unlockedAchievements.length} / {allAchievements.length} 个成就
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">完成度</div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.practiceCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">练习次数</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.testCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">测试次数</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.streakDays}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">连续天数</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stats.poetryLearned}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">诗词数量</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="max-w-6xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 h-auto mb-6">
            <TabsTrigger value="all" className="gap-2">
              <Award className="h-4 w-4" />
              全部
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <BookOpen className="h-4 w-4" />
              练习
            </TabsTrigger>
            <TabsTrigger value="test" className="gap-2">
              <Trophy className="h-4 w-4" />
              测试
            </TabsTrigger>
            <TabsTrigger value="perfect" className="gap-2">
              <Sparkles className="h-4 w-4" />
              完美
            </TabsTrigger>
            <TabsTrigger value="streak" className="gap-2">
              <Flame className="h-4 w-4" />
              坚持
            </TabsTrigger>
            <TabsTrigger value="poetry" className="gap-2">
              <Target className="h-4 w-4" />
              收集
            </TabsTrigger>
            <TabsTrigger value="daily" className="gap-2">
              <Calendar className="h-4 w-4" />
              每日
            </TabsTrigger>
            <TabsTrigger value="master" className="gap-2">
              <Star className="h-4 w-4" />
              精通
            </TabsTrigger>
            <TabsTrigger value="special" className="gap-2">
              <Award className="h-4 w-4" />
              特殊
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allAchievements.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    暂无成就
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    开始学习诗词，解锁你的第一个成就吧！
                  </p>
                  <Link href="/practice">
                    <Button>开始练习</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    showProgress={!achievement.unlockedAt}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {Object.entries(achievementsByCategory).map(([key, categoryAchievements]) => {
            if (key === 'all') return null;
            const categoryKey = key as keyof typeof achievementsByCategory;

            return (
              <TabsContent key={key} value={key} className="space-y-4">
                {categoryAchievements.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Target className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        暂无成就
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        完成相关任务解锁此分类的成就
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        showProgress={!achievement.unlockedAt}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

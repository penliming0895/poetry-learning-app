import { useState, useEffect, useCallback } from 'react';
import { achievements, tierOrder } from '@/data/achievements';
import { UserStats, UserAchievement, Achievement } from '@/types/achievement';

const STORAGE_KEY = 'user_achievements';
const STATS_KEY = 'user_stats';

const initialStats: UserStats = {
  practiceCount: 0,
  testCount: 0,
  perfectTests: 0,
  streakDays: 0,
  totalDays: 0,
  poetryLearned: 0,
  dailyCompleted: 0,
  lastPracticeDate: '',
  averageScore: 0,
  wrongLinesCount: 0,
};

export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // 加载用户数据
  useEffect(() => {
    try {
      const savedAchievements = localStorage.getItem(STORAGE_KEY);
      const savedStats = localStorage.getItem(STATS_KEY);

      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        setUserAchievements(parsed);
      }

      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
      }
    } catch (error) {
      console.error('加载成就数据失败:', error);
    } finally {
      setMounted(true);
    }
  }, []);

  // 保存用户数据
  const saveAchievements = useCallback((achievements: UserAchievement[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('保存成就数据失败:', error);
    }
  }, []);

  const saveStats = useCallback((stats: UserStats) => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('保存统计数据失败:', error);
    }
  }, []);

  // 更新统计数据
  const updateStats = useCallback(
    (updates: Partial<UserStats>) => {
      setStats((prev) => {
        const newStats = { ...prev, ...updates };
        saveStats(newStats);
        return newStats;
      });
    },
    [saveStats]
  );

  // 检查新解锁的成就
  const checkAchievements = useCallback(() => {
    const unlockedIds = userAchievements.map((a) => a.id);
    const newUnlocks: Achievement[] = [];

    achievements.forEach((achievement) => {
      if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
        newUnlocks.push(achievement);
      }
    });

    if (newUnlocks.length > 0) {
      const newAchievements = newUnlocks.map((a) => ({
        ...a,
        unlockedAt: Date.now(),
      }));

      setUserAchievements((prev) => {
        const updated = [...prev, ...newAchievements];
        saveAchievements(updated);
        return updated;
      });

      setNewlyUnlocked(newUnlocks.map((a) => a.id));
    }

    return newUnlocks;
  }, [userAchievements, stats, saveAchievements]);

  // 记录练习
  const recordPractice = useCallback(
    (poetryId: string, score: number) => {
      updateStats({
        practiceCount: stats.practiceCount + 1,
        poetryLearned: stats.poetryLearned + 1,
        lastPracticeDate: new Date().toISOString().split('T')[0],
      });

      // 更新连续学习天数
      checkStreak();

      // 检查新成就
      setTimeout(() => checkAchievements(), 100);
    },
    [stats, updateStats, checkAchievements]
  );

  // 记录测试
  const recordTest = useCallback(
    (poetryId: string, score: number) => {
      const newTestCount = stats.testCount + 1;
      const newPerfectTests = score === 100 ? stats.perfectTests + 1 : stats.perfectTests;
      const newAverageScore =
        ((stats.averageScore * stats.testCount) + score) / newTestCount;

      updateStats({
        testCount: newTestCount,
        perfectTests: newPerfectTests,
        averageScore: newAverageScore,
        lastPracticeDate: new Date().toISOString().split('T')[0],
      });

      // 更新连续学习天数
      checkStreak();

      // 检查新成就
      setTimeout(() => checkAchievements(), 100);
    },
    [stats, updateStats, checkAchievements]
  );

  // 检查连续学习天数
  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastPracticeDate;

    if (!lastDate) {
      updateStats({ streakDays: 1, totalDays: 1, lastPracticeDate: today });
      return;
    }

    const lastPractice = new Date(lastDate);
    const currentPractice = new Date(today);
    const diffDays = Math.floor((currentPractice.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // 今天已经学过了
      return;
    } else if (diffDays === 1) {
      // 连续学习
      updateStats({
        streakDays: stats.streakDays + 1,
        totalDays: stats.totalDays + 1,
        lastPracticeDate: today,
      });
    } else {
      // 中断了
      updateStats({
        streakDays: 1,
        totalDays: stats.totalDays + 1,
        lastPracticeDate: today,
      });
    }
  }, [stats, updateStats]);

  // 记录每日任务完成
  const recordDaily = useCallback(() => {
    updateStats({
      dailyCompleted: stats.dailyCompleted + 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
    });

    // 更新连续学习天数
    checkStreak();

    // 检查新成就
    setTimeout(() => checkAchievements(), 100);
  }, [stats, updateStats, checkStreak, checkAchievements]);

  // 记录错题复习
  const recordWrongLineReview = useCallback(() => {
    updateStats({
      wrongLinesCount: stats.wrongLinesCount + 1,
    });

    // 检查新成就
    setTimeout(() => checkAchievements(), 100);
  }, [stats, updateStats, checkAchievements]);

  // 获取成就进度
  const getAchievementProgress = useCallback(
    (achievement: Achievement): number => {
      // 简单的进度计算，可以根据成就类型优化
      const value = stats[achievement.type + 'Count' as keyof UserStats] as number || 0;
      const requirement = parseInt(achievement.requirement.match(/\d+/)?.[0] || '0');
      return Math.min((value / requirement) * 100, 100);
    },
    [stats]
  );

  // 清除新解锁提示
  const clearNewUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  // 获取统计信息
  const getStats = () => stats;

  // 获取所有成就
  const getAllAchievements = (): UserAchievement[] => {
    return achievements.map((achievement) => {
      const unlocked = userAchievements.find((a) => a.id === achievement.id);
      if (unlocked) {
        return {
          ...achievement,
          unlockedAt: unlocked.unlockedAt,
        };
      }
      return achievement;
    });
  };

  // 获取已解锁的成就
  const getUnlockedAchievements = (): UserAchievement[] => {
    return userAchievements;
  };

  // 获取未解锁的成就
  const getLockedAchievements = (): UserAchievement[] => {
    return achievements
      .filter((a) => !userAchievements.find((ua) => ua.id === a.id))
      .map((a) => ({ ...a, progress: getAchievementProgress(a) }));
  };

  return {
    mounted,
    stats,
    newlyUnlocked,
    getAllAchievements,
    getUnlockedAchievements,
    getLockedAchievements,
    recordPractice,
    recordTest,
    recordDaily,
    recordWrongLineReview,
    clearNewUnlocked,
    checkAchievements,
  };
}

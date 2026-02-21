import { useState, useEffect } from 'react';

export interface GameProgress {
  learnedPoems: string[]; // 已学习的诗词ID列表
  testCount: number; // 测试次数
  totalScore: number; // 总得分
  bestScores: Record<string, number>; // 每首诗词的最佳得分
}

const STORAGE_KEY = 'poetry-game-progress';

const defaultProgress: GameProgress = {
  learnedPoems: [],
  testCount: 0,
  totalScore: 0,
  bestScores: {},
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载进度
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    setMounted(true);
  }, []);

  // 保存进度到 localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [progress, mounted]);

  // 记录练习完成
  const recordPractice = (poetryId: string, correctCount: number, totalLines: number) => {
    const score = Math.round((correctCount / totalLines) * 100);
    setProgress(prev => {
      const newLearnedPoems = prev.learnedPoems.includes(poetryId)
        ? prev.learnedPoems
        : [...prev.learnedPoems, poetryId];

      return {
        ...prev,
        learnedPoems: newLearnedPoems,
        testCount: prev.testCount + 1,
        totalScore: prev.totalScore + score,
        bestScores: {
          ...prev.bestScores,
          [poetryId]: Math.max(prev.bestScores[poetryId] || 0, score),
        },
      };
    });
    return score;
  };

  // 记录测试完成
  const recordTest = (poetryId: string, score: number) => {
    setProgress(prev => {
      const newLearnedPoems = score >= 60 && !prev.learnedPoems.includes(poetryId)
        ? [...prev.learnedPoems, poetryId]
        : prev.learnedPoems;

      return {
        ...prev,
        learnedPoems: newLearnedPoems,
        testCount: prev.testCount + 1,
        totalScore: prev.totalScore + score,
        bestScores: {
          ...prev.bestScores,
          [poetryId]: Math.max(prev.bestScores[poetryId] || 0, score),
        },
      };
    });
  };

  // 计算平均正确率
  const getAverageAccuracy = (): number => {
    if (progress.testCount === 0) return 0;
    return Math.round(progress.totalScore / progress.testCount);
  };

  // 重置进度
  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 获取诗词的最佳得分
  const getBestScore = (poetryId: string): number => {
    return progress.bestScores[poetryId] || 0;
  };

  return {
    progress,
    recordPractice,
    recordTest,
    getAverageAccuracy,
    resetProgress,
    getBestScore,
    mounted,
  };
};

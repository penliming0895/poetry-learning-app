import { useState, useEffect } from 'react';
import { WrongPoetry, WrongLine } from '@/types/poetry';

export interface GameProgress {
  learnedPoems: string[]; // 已学习的诗词ID列表
  testCount: number; // 测试次数
  totalScore: number; // 总得分
  bestScores: Record<string, number>; // 每首诗词的最佳得分
  wrongPoetryList: WrongPoetry[]; // 错题列表（整首）
  wrongLineList: WrongLine[]; // 错题列表（单句）
}

const STORAGE_KEY = 'poetry-game-progress';

const defaultProgress: GameProgress = {
  learnedPoems: [],
  testCount: 0,
  totalScore: 0,
  bestScores: {},
  wrongPoetryList: [],
  wrongLineList: [],
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载进度
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        // 检查是否是旧版本数据（没有错题字段）
        if (!parsed.wrongPoetryList || !parsed.wrongLineList) {
          console.log('检测到旧版本数据，正在迁移...');
          // 保留旧数据，只添加新字段
          setProgress({
            ...defaultProgress,
            ...parsed,
            wrongPoetryList: parsed.wrongPoetryList || [],
            wrongLineList: parsed.wrongLineList || [],
          });
        } else {
          setProgress(parsed);
        }
      } else {
        setProgress(defaultProgress);
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

  // 记录整首诗词错题
  const recordWrongPoetry = (
    poetryId: string,
    poetryTitle: string,
    author: string,
    dynasty: string,
    category: string
  ) => {
    setProgress(prev => {
      const existingIndex = prev.wrongPoetryList.findIndex(wp => wp.poetryId === poetryId);
      const wrongPoetry: WrongPoetry = {
        poetryId,
        poetryTitle,
        author,
        dynasty,
        category,
        wrongCount: existingIndex !== -1 ? prev.wrongPoetryList[existingIndex].wrongCount + 1 : 1,
        lastWrongDate: Date.now(),
        mastered: false,
      };

      const newWrongList = existingIndex !== -1
        ? prev.wrongPoetryList.map((wp, idx) => idx === existingIndex ? wrongPoetry : wp)
        : [...prev.wrongPoetryList, wrongPoetry];

      return {
        ...prev,
        wrongPoetryList: newWrongList,
      };
    });
  };

  // 记录单句错题
  const recordWrongLine = (
    poetryId: string,
    poetryTitle: string,
    lineIndex: number,
    lineContent: string,
    author: string
  ) => {
    setProgress(prev => {
      // 查找是否已经存在该诗词该句的错题
      const existingIndex = prev.wrongLineList.findIndex(
        wl => wl.poetryId === poetryId && wl.lineIndex === lineIndex
      );

      const wrongLine: WrongLine = {
        poetryId,
        poetryTitle,
        lineIndex,
        lineContent,
        author,
        wrongCount: existingIndex !== -1 ? prev.wrongLineList[existingIndex].wrongCount + 1 : 1,
        lastWrongDate: Date.now(),
        mastered: false,
      };

      const newWrongList = existingIndex !== -1
        ? prev.wrongLineList.map((wl, idx) => idx === existingIndex ? wrongLine : wl)
        : [...prev.wrongLineList, wrongLine];

      return {
        ...prev,
        wrongLineList: newWrongList,
      };
    });
  };

  // 标记错题为已掌握
  const markAsMastered = (type: 'poetry' | 'line', poetryId: string, lineIndex?: number) => {
    setProgress(prev => {
      if (type === 'poetry') {
        return {
          ...prev,
          wrongPoetryList: prev.wrongPoetryList.map(wp =>
            wp.poetryId === poetryId ? { ...wp, mastered: true } : wp
          ),
        };
      } else {
        return {
          ...prev,
          wrongLineList: prev.wrongLineList.map(wl =>
            wl.poetryId === poetryId && wl.lineIndex === lineIndex
              ? { ...wl, mastered: true }
              : wl
          ),
        };
      }
    });
  };

  // 清除已掌握的错题
  const clearMastered = (type: 'poetry' | 'line') => {
    setProgress(prev => {
      if (type === 'poetry') {
        return {
          ...prev,
          wrongPoetryList: prev.wrongPoetryList.filter(wp => !wp.mastered),
        };
      } else {
        return {
          ...prev,
          wrongLineList: prev.wrongLineList.filter(wl => !wl.mastered),
        };
      }
    });
  };

  // 获取未掌握的错题
  const getUnmasteredWrong = (type: 'poetry' | 'line'): WrongPoetry[] | WrongLine[] => {
    // 确保数组存在
    const wrongPoetryList = progress.wrongPoetryList || [];
    const wrongLineList = progress.wrongLineList || [];

    if (type === 'poetry') {
      return wrongPoetryList.filter(wp => !wp.mastered);
    } else {
      return wrongLineList.filter(wl => !wl.mastered);
    }
  };

  return {
    progress,
    recordPractice,
    recordTest,
    getAverageAccuracy,
    resetProgress,
    getBestScore,
    recordWrongPoetry,
    recordWrongLine,
    markAsMastered,
    clearMastered,
    getUnmasteredWrong,
    mounted,
  };
};

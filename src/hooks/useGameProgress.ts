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

// 临时禁用 localStorage 以诊断问题
const DISABLE_LOCAL_STORAGE = true;

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [mounted, setMounted] = useState(false);

  // 从 localStorage 加载进度
  useEffect(() => {
    if (DISABLE_LOCAL_STORAGE) {
      console.log('⚠️ localStorage 已禁用（诊断模式）');
      setMounted(true);
      return;
    }

    // 确保只在客户端执行
    if (typeof window === 'undefined') {
      setMounted(true);
      return;
    }

    try {
      // 检查 localStorage 是否可用
      const testKey = '__storage_test__';
      try {
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
      } catch (e) {
        console.warn('localStorage 不可用:', e);
        setMounted(true);
        return;
      }

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
      setProgress(defaultProgress);
    }
    setMounted(true);
  }, []);

  // 保存进度到 localStorage
  useEffect(() => {
    if (DISABLE_LOCAL_STORAGE) {
      return;
    }

    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [progress, mounted]);

  // 记录练习完成
  const recordPractice = (poetryId: string, correctCount: number, totalLines: number) => {
    try {
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
    } catch (error) {
      console.error('recordPractice error:', error);
      return 0;
    }
  };

  // 记录测试完成
  const recordTest = (poetryId: string, score: number) => {
    try {
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
    } catch (error) {
      console.error('recordTest error:', error);
    }
  };

  // 计算平均正确率
  const getAverageAccuracy = (): number => {
    try {
      if (progress.testCount === 0) return 0;
      return Math.round(progress.totalScore / progress.testCount);
    } catch (error) {
      console.error('getAverageAccuracy error:', error);
      return 0;
    }
  };

  // 重置进度
  const resetProgress = () => {
    try {
      setProgress(defaultProgress);
      if (typeof window !== 'undefined' && !DISABLE_LOCAL_STORAGE) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('resetProgress error:', error);
    }
  };

  // 获取诗词的最佳得分
  const getBestScore = (poetryId: string): number => {
    try {
      return progress.bestScores[poetryId] || 0;
    } catch (error) {
      console.error('getBestScore error:', error);
      return 0;
    }
  };

  // 记录整首诗词错题
  const recordWrongPoetry = (
    poetryId: string,
    poetryTitle: string,
    author: string,
    dynasty: string,
    category: string
  ) => {
    try {
      if (DISABLE_LOCAL_STORAGE) {
        console.log('⚠️ 错题记录已禁用（诊断模式）');
        return;
      }

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
    } catch (error) {
      console.error('recordWrongPoetry error:', error);
    }
  };

  // 记录单句错题
  const recordWrongLine = (
    poetryId: string,
    poetryTitle: string,
    lineIndex: number,
    lineContent: string,
    author: string
  ) => {
    try {
      if (DISABLE_LOCAL_STORAGE) {
        console.log('⚠️ 错题记录已禁用（诊断模式）');
        return;
      }

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
    } catch (error) {
      console.error('recordWrongLine error:', error);
    }
  };

  // 标记错题为已掌握
  const markAsMastered = (type: 'poetry' | 'line', poetryId: string, lineIndex?: number) => {
    try {
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
    } catch (error) {
      console.error('markAsMastered error:', error);
    }
  };

  // 清除已掌握的错题
  const clearMastered = (type: 'poetry' | 'line') => {
    try {
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
    } catch (error) {
      console.error('clearMastered error:', error);
    }
  };

  // 获取未掌握的错题
  const getUnmasteredWrong = (type: 'poetry' | 'line'): WrongPoetry[] | WrongLine[] => {
    try {
      const wrongPoetryList = progress.wrongPoetryList || [];
      const wrongLineList = progress.wrongLineList || [];

      if (type === 'poetry') {
        return wrongPoetryList.filter(wp => !wp.mastered);
      } else {
        return wrongLineList.filter(wl => !wl.mastered);
      }
    } catch (error) {
      console.error('getUnmasteredWrong error:', error);
      return [];
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

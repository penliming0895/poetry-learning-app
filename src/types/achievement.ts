export type AchievementType =
  | 'practice'
  | 'test'
  | 'streak'
  | 'perfect'
  | 'poetry'
  | 'daily'
  | 'master'
  | 'special';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Achievement {
  id: string;
  type: AchievementType;
  tier: AchievementTier;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  condition: (stats: UserStats) => boolean;
  reward?: string;
}

export interface UserStats {
  practiceCount: number; // 练习次数
  testCount: number; // 测试次数
  perfectTests: number; // 满分测试次数
  streakDays: number; // 连续学习天数
  totalDays: number; // 总学习天数
  poetryLearned: number; // 学习诗词数量
  dailyCompleted: number; // 每日任务完成次数
  lastPracticeDate: string; // 最后练习日期
  averageScore: number; // 平均分
  wrongLinesCount: number; // 错题数量
}

export interface UserAchievement extends Achievement {
  unlockedAt?: number; // 解锁时间戳
  progress?: number; // 当前进度（0-100）
}

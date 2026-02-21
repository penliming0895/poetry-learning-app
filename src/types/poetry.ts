export interface Poetry {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  content: string; // 完整内容
  lines: string[]; // 分行的诗句
  difficulty: 'easy' | 'medium' | 'hard';
  category: string; // 诗、词、曲等
  notes?: string; // 注释或背景
}

export interface GameState {
  score: number;
  currentPoetry: Poetry | null;
  currentIndex: number;
  completedPoems: string[];
  mode: 'practice' | 'test'; // 练习模式或测试模式
}

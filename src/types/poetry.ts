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

// 错题类型：整首诗词出错
export interface WrongPoetry {
  poetryId: string;
  poetryTitle: string;
  author: string;
  dynasty: string;
  category: string;
  wrongCount: number; // 错误次数
  lastWrongDate: number; // 最后错误时间戳
  mastered: boolean; // 是否已掌握
}

// 错题类型：单句出错（练习模式）
export interface WrongLine {
  poetryId: string;
  poetryTitle: string;
  lineIndex: number; // 第几句
  lineContent: string; // 错误的那句内容
  author: string;
  wrongCount: number; // 错误次数
  lastWrongDate: number; // 最后错误时间戳
  mastered: boolean; // 是否已掌握
}

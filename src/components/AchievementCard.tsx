'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Sparkles, Clock } from 'lucide-react';
import { Achievement, UserAchievement } from '@/types/achievement';

interface AchievementCardProps {
  achievement: UserAchievement;
  showProgress?: boolean;
}

const tierStyles = {
  bronze: {
    bg: 'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
    border: 'border-amber-300 dark:border-amber-700',
    iconBg: 'bg-amber-500',
  },
  silver: {
    bg: 'from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800',
    border: 'border-gray-300 dark:border-gray-600',
    iconBg: 'bg-gray-500',
  },
  gold: {
    bg: 'from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30',
    border: 'border-yellow-400 dark:border-yellow-600',
    iconBg: 'bg-yellow-500',
  },
  diamond: {
    bg: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
    border: 'border-blue-400 dark:border-blue-600',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
};

const tierLabels = {
  bronze: '青铜',
  silver: '白银',
  gold: '黄金',
  diamond: '钻石',
};

function AchievementCard({ achievement, showProgress = false }: AchievementCardProps) {
  const isUnlocked = !!achievement.unlockedAt;
  const tierStyle = tierStyles[achievement.tier];

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-xl
        ${isUnlocked ? tierStyle.bg : 'bg-gray-50 dark:bg-gray-900'}
        ${isUnlocked ? tierStyle.border : 'border-gray-200 dark:border-gray-800'}
        border-2
      `}
    >
      <CardContent className="p-4">
        {/* 图标和标题 */}
        <div className="flex items-start gap-3">
          {/* 图标 */}
          <div
            className={`
              flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl
              ${isUnlocked ? tierStyle.iconBg : 'bg-gray-200 dark:bg-gray-800'}
              ${isUnlocked ? 'text-white shadow-lg' : 'text-gray-400'}
              transition-all duration-300
            `}
          >
            {achievement.icon}
          </div>

          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold truncate ${
                  isUnlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                {achievement.title}
              </h3>
              {isUnlocked && <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
              {!isUnlocked && <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />}
            </div>
            <p
              className={`text-sm mb-2 line-clamp-2 ${
                isUnlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              {achievement.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`
                  text-xs
                  ${isUnlocked ? tierStyle.border : 'border-gray-300 dark:border-gray-700'}
                `}
              >
                {tierLabels[achievement.tier]}
              </Badge>
              {achievement.reward && isUnlocked && (
                <Badge variant="secondary" className="text-xs">
                  {achievement.reward}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 解锁时间 */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>
                解锁于 {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        )}

        {/* 进度条 */}
        {showProgress && !isUnlocked && achievement.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{achievement.requirement}</span>
              <span>{Math.round(achievement.progress)}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      {/* 光效 */}
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 w-6 h-6">
          <Sparkles className="h-full w-full text-yellow-400" />
        </div>
      )}
    </Card>
  );
}

export default memo(AchievementCard);

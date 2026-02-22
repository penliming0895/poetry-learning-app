'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, X } from 'lucide-react';
import { Achievement } from '@/types/achievement';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: () => void;
}

export default function AchievementNotification({
  achievements,
  onClose,
}: AchievementNotificationProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400 dark:border-yellow-600 shadow-2xl">
        <CardContent className="p-4">
          {/* 标题 */}
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {achievements.length === 1 ? '成就解锁！' : '成就解锁 × ' + achievements.length}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 成就列表 */}
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {achievement.description}
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 animate-pulse" />
              </div>
            ))}
          </div>

          {/* 底部提示 */}
          {achievements.length > 1 && (
            <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                太棒了！你解锁了 {achievements.length} 个新成就！
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

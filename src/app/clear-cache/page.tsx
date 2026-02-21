'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';

export default function ClearCachePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'clearing' | 'success' | 'error'>('idle');

  const clearCache = () => {
    setStatus('clearing');
    try {
      // 清除所有相关的 localStorage 数据
      localStorage.removeItem('poetry-game-progress');

      setStatus('success');

      // 3秒后跳转到首页
      setTimeout(() => {
        router.push('/');
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('清除缓存失败:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-md">
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {status === 'idle' && (
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              )}
              {status === 'clearing' && (
                <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              )}
              {status === 'error' && (
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
              <CardTitle>
                {status === 'idle' && '清除缓存数据'}
                {status === 'clearing' && '正在清除...'}
                {status === 'success' && '清除成功！'}
                {status === 'error' && '清除失败'}
              </CardTitle>
            </div>
            <CardDescription>
              {status === 'idle' && '清除旧版本数据后，页面将自动刷新'}
              {status === 'clearing' && '请稍候...'}
              {status === 'success' && '即将跳转到首页'}
              {status === 'error' && '请手动清除浏览器缓存'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'idle' && (
              <>
                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                  <p className="text-sm text-orange-900 dark:text-orange-100">
                    <AlertCircle className="mr-2 inline-block h-4 w-4" />
                    如果页面出现加载错误，请清除缓存数据
                  </p>
                </div>
                <Button
                  onClick={clearCache}
                  className="w-full"
                  size="lg"
                >
                  <Trash2 className="mr-2 h-5 w-5" />
                  清除缓存
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  返回
                </Button>
              </>
            )}

            {status === 'success' && (
              <div className="text-center py-4">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-green-700 dark:text-green-300">
                  缓存已清除，正在跳转...
                </p>
              </div>
            )}

            {status === 'error' && (
              <>
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    <AlertCircle className="mr-2 inline-block h-4 w-4" />
                    清除失败，请按 F12 打开控制台手动清除
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStatus('idle')}
                  className="w-full"
                >
                  重试
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

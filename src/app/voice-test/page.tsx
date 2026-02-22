'use client';

import { useState } from 'react';
import SimpleVoicePlayer from '@/components/SimpleVoicePlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VoiceTestPage() {
  const [testText, setTestText] = useState('床前明月光，疑是地上霜。举头望明月，低头思故乡。');

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8">🎤 语音朗读测试</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>测试诗词</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg min-h-[100px] text-lg"
              placeholder="请输入要朗读的文本..."
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>朗读按钮</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <SimpleVoicePlayer text={testText} />
              <p className="text-gray-600 text-sm">
                点击"朗读"按钮测试语音功能。请在浏览器控制台查看详细日志。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>测试说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>1. 点击"朗读"按钮会调用 TTS API 生成语音</p>
            <p>2. 生成成功后会自动播放</p>
            <p>3. 再次点击可以暂停/恢复播放</p>
            <p>4. 如果有问题，请查看浏览器控制台（按 F12）的日志信息</p>
            <p>5. 常见问题：</p>
            <ul className="list-disc list-inside ml-4">
              <li>浏览器可能阻止自动播放，需要用户先点击页面</li>
              <li>网络问题可能导致音频加载失败</li>
              <li>跨域问题（已使用 CORS 处理）</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

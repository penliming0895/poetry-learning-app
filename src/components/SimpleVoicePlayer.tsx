'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VoicePlayerProps {
  text: string;
  className?: string;
}

/**
 * 极简版语音播放器
 * 专注于基本功能，确保在所有移动浏览器上都能工作
 */
function SimpleVoicePlayer({ text, className = '' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null); // null = 检测中

  // 检测浏览器支持
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeechSynthesis = 'speechSynthesis' in window;
      const hasUtterance = 'SpeechSynthesisUtterance' in window;
      const hasSupport = hasSpeechSynthesis && hasUtterance;

      console.log('🎤 语音支持检测:', {
        hasSpeechSynthesis,
        hasUtterance,
        hasSupport,
        userAgent: navigator.userAgent
      });

      setSupported(hasSupport);
    }
  }, []);

  // 停止播放
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        console.log('⏸️ 停止播放');
      } catch (e) {
        console.error('停止语音时出错:', e);
      }
      setIsPlaying(false);
    }
  }, []);

  // 开始播放
  const startSpeaking = useCallback(() => {
    if (!text || text.trim() === '') {
      setErrorMessage('没有可朗读的内容');
      return;
    }

    console.log('🎤 开始播放:', text.substring(0, 30) + '...');
    setErrorMessage(null);

    try {
      // 停止之前的播放
      stopSpeaking();

      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 1.0;

      // 事件处理
      utterance.onstart = () => {
        console.log('▶️ 语音开始播放');
        setIsPlaying(true);
      };

      utterance.onend = () => {
        console.log('🏁 语音播放结束');
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('❌ 语音播放错误:', event);
        setIsPlaying(false);
        setErrorMessage('播放失败，请重试');
      };

      // 开始播放
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('❌ 启动语音失败:', error);
      setIsPlaying(false);
      setErrorMessage('语音功能不可用');
    }
  }, [text, stopSpeaking]);

  // 处理点击
  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!supported) {
      setErrorMessage('您的浏览器不支持语音功能');
      return;
    }

    if (isPlaying) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  }, [isPlaying, supported, stopSpeaking, startSpeaking]);

  // 检测中
  if (supported === null) {
    return (
      <div className={className}>
        <Button
          disabled
          size="sm"
          variant="outline"
        >
          检测中...
        </Button>
      </div>
    );
  }

  // 不支持时显示
  if (!supported) {
    return (
      <div className={className}>
        <Button
          disabled
          size="sm"
          variant="outline"
          className="opacity-60"
        >
          <VolumeX className="h-4 w-4 mr-2" />
          不支持
        </Button>
        <div className="mt-2 text-xs text-gray-500">
          您的浏览器不支持语音功能
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button
        onClick={handlePlayPause}
        disabled={!text}
        size="sm"
        variant="outline"
        className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 transition-all"
      >
        {isPlaying ? (
          <VolumeX className="h-4 w-4 mr-2" />
        ) : (
          <Volume2 className="h-4 w-4 mr-2" />
        )}
        {isPlaying ? '停止' : '朗读'}
      </Button>

      {errorMessage && (
        <div className="mt-2 text-xs text-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default SimpleVoicePlayer;

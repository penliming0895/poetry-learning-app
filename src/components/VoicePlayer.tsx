'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoicePlayerProps {
  text: string;
  className?: string;
  speaker?: 'zh_female_xueayi_saturn_bigtts' | 'zh_male_m191_uranus_bigtts';
}

export default function VoicePlayer({ text, className = '', speaker = 'zh_female_xueayi_saturn_bigtts' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializing = useRef(false);

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('=== VoicePlayer handlePlayPause ===');
    console.log('当前状态 - isPlaying:', isPlaying, 'isLoading:', isLoading, 'hasAudioUrl:', !!audioUrl);

    // 防止重复初始化
    if (isInitializing.current) {
      console.log('正在初始化中，忽略点击');
      return;
    }

    // 如果正在播放，则暂停
    if (isPlaying) {
      console.log('执行暂停操作');
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('音频已暂停');
      }
      return;
    }

    // 如果正在加载，忽略点击
    if (isLoading) {
      console.log('正在加载中，忽略点击');
      return;
    }

    // 如果已经有音频 URL，直接播放
    if (audioUrl && audioRef.current) {
      console.log('使用已有音频播放');
      playAudio(audioUrl);
      return;
    }

    // 否则生成新音频
    console.log('生成新音频');
    setIsLoading(true);
    isInitializing.current = true;

    try {
      console.log('调用 TTS API，文本:', text.substring(0, 30) + '...');
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, speaker }),
      });

      console.log('TTS API 响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      console.log('TTS API 响应成功，audioUri:', data.audioUri);
      setAudioUrl(data.audioUri);
      playAudio(data.audioUri);
    } catch (error) {
      console.error('生成音频失败:', error);
      alert(`语音播放失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsLoading(false);
    } finally {
      isInitializing.current = false;
    }
  };

  const playAudio = (url: string) => {
    console.log('=== playAudio ===', url);

    // 清理之前的音频
    if (audioRef.current) {
      console.log('清理之前的音频');
      audioRef.current.pause();
      audioRef.current.onloadedmetadata = null;
      audioRef.current.oncanplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    console.log('创建新的 Audio 对象');

    audio.onloadedmetadata = () => {
      console.log('音频元数据已加载，时长:', audio.duration);
    };

    audio.oncanplay = () => {
      console.log('音频可以播放，开始播放...');
      setIsPlaying(true);
      audio.play()
        .then(() => {
          console.log('播放成功');
        })
        .catch((error) => {
          console.error('播放失败:', error);
          setIsPlaying(false);
          alert(`播放失败: ${error.message}`);
        });
    };

    audio.onended = () => {
      console.log('音频播放结束');
      setIsPlaying(false);
    };

    audio.onerror = (e) => {
      console.error('音频错误:', e);
      console.error('错误详情:', {
        error: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      setIsPlaying(false);
      alert(`音频播放错误: ${audio.error?.message || '未知错误'}`);
    };

    audio.load();
  };

  return (
    <div className={className}>
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 dark:border-blue-800 transition-all duration-300 hover:scale-105"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : isPlaying ? (
          <VolumeX className="h-4 w-4 mr-2" />
        ) : (
          <Volume2 className="h-4 w-4 mr-2" />
        )}
        {isLoading ? '生成中...' : isPlaying ? '暂停' : '朗读'}
      </Button>
    </div>
  );
}

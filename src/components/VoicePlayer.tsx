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

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePlay = async () => {
    if (isPlaying) {
      // 如果正在播放，则暂停
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // 如果已经有音频 URL，直接播放
    if (audioUrl) {
      playAudio();
      return;
    }

    // 否则生成新音频
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, speaker }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      setAudioUrl(data.audioUri);
      playAudio(data.audioUri);
    } catch (error) {
      console.error('Error playing voice:', error);
      alert('语音播放失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url?: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url || audioUrl || undefined);
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      alert('音频播放错误');
    };

    setIsPlaying(true);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  };

  return (
    <div className={className}>
      <Button
        onClick={handlePlay}
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

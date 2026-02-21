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

  const handlePlay = async (e?: React.MouseEvent) => {
    // 阻止事件冒泡，防止触发父元素的点击事件
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    console.log('VoicePlayer handlePlay called, isPlaying:', isPlaying);

    if (isPlaying) {
      // 如果正在播放，则暂停
      console.log('Pausing audio...');
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // 如果已经有音频 URL，直接播放
    if (audioUrl) {
      console.log('Playing existing audio:', audioUrl);
      playAudio();
      return;
    }

    // 否则生成新音频
    console.log('Generating new audio for text:', text.substring(0, 20) + '...');
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, speaker }),
      });

      console.log('TTS response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      console.log('TTS response data:', { audioUri: data.audioUri, audioSize: data.audioSize });
      setAudioUrl(data.audioUri);
      playAudio(data.audioUri);
    } catch (error) {
      console.error('Error playing voice:', error);
      alert(`语音播放失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url?: string) => {
    const audioUrlToUse = url || audioUrl;
    if (!audioUrlToUse) {
      console.error('No audio URL available');
      return;
    }

    console.log('Creating audio for URL:', audioUrlToUse);

    // 清理之前的音频
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const audio = new Audio(audioUrlToUse);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
    };

    audio.oncanplay = () => {
      console.log('Audio can play, starting playback...');
      setIsPlaying(true);
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        alert(`播放失败: ${error.message}`);
      });
    };

    audio.onended = () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
    };

    audio.onerror = (e) => {
      console.error('Audio error:', e);
      console.error('Audio error details:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      setIsPlaying(false);
      alert(`音频播放错误: ${audio.error?.message || '未知错误'}`);
    };

    // 开始加载音频
    audio.load();
  };

  return (
    <div className={className}>
      <Button
        onClick={(e) => handlePlay(e)}
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

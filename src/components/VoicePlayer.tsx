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
        audioRef.current.onloadedmetadata = null;
        audioRef.current.oncanplay = null;
        audioRef.current.onplay = null;
        audioRef.current.onpause = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('=== VoicePlayer ===');
    console.log('状态:', { isPlaying, isLoading, hasAudioUrl: !!audioUrl });

    // 防止重复初始化
    if (isInitializing.current) {
      console.log('⚠️ 正在初始化中，忽略点击');
      return;
    }

    // 如果正在播放，则暂停
    if (isPlaying) {
      console.log('⏸️ 执行暂停');
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // 如果正在加载，忽略点击
    if (isLoading) {
      console.log('⏳ 正在加载中，忽略点击');
      return;
    }

    // 如果已经有音频 URL，直接播放
    if (audioUrl && audioRef.current) {
      console.log('▶️ 继续播放已有音频');
      resumePlay();
      return;
    }

    // 否则生成新音频
    console.log('🎙️ 生成新音频');
    await generateAndPlay();
  };

  const generateAndPlay = async () => {
    setIsLoading(true);
    isInitializing.current = true;

    try {
      console.log('📡 调用 TTS API...');
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker }),
      });

      console.log('📥 API 响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 音频生成成功:', { uri: data.audioUri, size: data.audioSize });
      setAudioUrl(data.audioUri);

      // 等待状态更新
      await new Promise(resolve => setTimeout(resolve, 100));

      // 播放音频
      createAndPlayAudio(data.audioUri);
    } catch (error) {
      console.error('❌ 生成音频失败:', error);
      const errorMsg = error instanceof Error ? error.message : '未知错误';
      alert(`语音播放失败: ${errorMsg}\n\n请检查网络连接或稍后重试`);
      setIsLoading(false);
    } finally {
      isInitializing.current = false;
    }
  };

  const createAndPlayAudio = (url: string) => {
    console.log('🎵 创建音频对象:', url);

    // 清理之前的音频
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onloadedmetadata = null;
      audioRef.current.oncanplay = null;
      audioRef.current.onplay = null;
      audioRef.current.onpause = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.src = '';
      audioRef.current.load();
    }

    const audio = new Audio();
    audioRef.current = audio;

    // 设置音频属性
    audio.crossOrigin = 'anonymous'; // 允许跨域
    audio.preload = 'auto';
    audio.src = url;

    // 音频加载完成
    audio.onloadedmetadata = () => {
      console.log('📊 元数据加载完成，时长:', audio.duration, '秒');
    };

    // 音频数据加载完成
    audio.oncanplaythrough = () => {
      console.log('✅ 音频数据加载完成，可以流畅播放');
      setIsLoading(false);
    };

    // 音频可以播放
    audio.oncanplay = () => {
      console.log('✅ 音频可以播放');
      setIsLoading(false);
    };

    // 音频开始播放
    audio.onplay = () => {
      console.log('▶️ 音频开始播放');
      setIsPlaying(true);
      setIsLoading(false);
    };

    // 音频暂停
    audio.onpause = () => {
      console.log('⏸️ 音频暂停');
      setIsPlaying(false);
      setIsLoading(false);
    };

    // 音频播放结束
    audio.onended = () => {
      console.log('🏁 音频播放结束');
      setIsPlaying(false);
      setIsLoading(false);
    };

    // 音频错误
    audio.onerror = (e) => {
      console.error('❌ 音频播放错误');
      console.error('错误详情:', {
        error: audio.error,
        message: audio.error?.message,
        code: audio.error?.code,
        networkState: audio.networkState,
        readyState: audio.readyState,
        src: audio.src
      });

      setIsPlaying(false);
      setIsLoading(false);

      let errorMsg = '音频播放失败';
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = '音频播放被中止';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = '网络错误，无法加载音频';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = '音频解码失败';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = '音频格式不支持';
            break;
          default:
            errorMsg = `音频错误: ${audio.error.message}`;
        }
      }
      alert(errorMsg + '\n\n请检查网络连接或稍后重试');
    };

    // 开始加载音频
    audio.load();

    // 等待音频加载后再播放
    setTimeout(() => {
      console.log('🎬 准备播放音频，状态:', {
        paused: audio.paused,
        readyState: audio.readyState,
        currentTime: audio.currentTime,
        duration: audio.duration
      });

      if (!audio.paused) {
        console.log('✅ 音频已经在播放中');
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      console.log('🎬 调用 audio.play()');
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ audio.play() 成功');
          })
          .catch((err) => {
            console.error('❌ audio.play() 失败:', err);
            setIsPlaying(false);
            setIsLoading(false);

            let hint = '';
            if (err.name === 'NotAllowedError') {
              hint = '浏览器阻止了自动播放，请先与页面交互后再试';
            } else if (err.name === 'NotSupportedError') {
              hint = '音频格式不支持';
            } else {
              hint = '可能原因：\n1. 浏览器阻止了自动播放\n2. 网络连接问题\n3. 音频文件损坏';
            }
            alert(`播放失败: ${err.message}\n\n${hint}`);
          });
      }
    }, 200);
  };

  const resumePlay = () => {
    if (audioRef.current) {
      console.log('▶️ 恢复播放');
      audioRef.current.play()
        .then(() => {
          console.log('✅ 恢复播放成功');
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('❌ 恢复播放失败:', err);
          alert(`恢复播放失败: ${err.message}`);
        });
    }
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

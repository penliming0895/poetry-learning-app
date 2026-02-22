'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, Settings2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoicePlayerProps {
  text: string;
  className?: string;
}

// 音色选项
const SPEAKER_OPTIONS = [
  { value: 'zh_female_xueayi_saturn_bigtts', label: '女声 - 学雅', category: 'female' },
  { value: 'zh_female_zhiuxu_mercury_bigtts', label: '女声 - 知旭', category: 'female' },
  { value: 'zh_female_jingjing_saturn_bigtts', label: '女声 - 晶晶', category: 'female' },
  { value: 'zh_male_m191_uranus_bigtts', label: '男声 - M191', category: 'male' },
  { value: 'zh_male_zhicheng_uranus_bigtts', label: '男声 - 志诚', category: 'male' },
  { value: 'zh_male_yunfei_mars_bigtts', label: '男声 - 云飞', category: 'male' },
  { value: 'zh_child_nannan_saturn_bigtts', label: '童声 - 囡囡', category: 'child' },
  { value: 'zh_child_xiaoxiao_mercury_bigtts', label: '童声 - 小小', category: 'child' },
];

// 语速选项
const SPEECH_RATE_LABELS: Record<string, string> = {
  '-5': '0.5x (很慢)',
  '-3': '0.7x (较慢)',
  '-1': '0.9x (稍慢)',
  '0': '1.0x (正常)',
  '1': '1.1x (稍快)',
  '3': '1.3x (较快)',
  '5': '1.5x (很快)',
};

// 全局音频缓存
const audioCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存

// 清理过期缓存
setInterval(() => {
  const now = Date.now();
  audioCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_DURATION) {
      audioCache.delete(key);
      console.log('🗑️ 清理过期缓存:', key.substring(0, 20) + '...');
    }
  });
}, 5 * 60 * 1000); // 每5分钟清理一次

function VoicePlayer({ text, className = '' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speaker, setSpeaker] = useState('zh_female_xueayi_saturn_bigtts');
  const [speechRate, setSpeechRate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
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

  // 当音色或语速改变时，清除当前音频
  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      setAudioUrl(null);
      setIsPlaying(false);
    }
  }, [speaker, speechRate]);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('=== VoicePlayer ===');
    console.log('状态:', { isPlaying, isLoading, hasAudioUrl: !!audioUrl, speaker, speechRate });

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
      // 检查缓存
      const cacheKey = `${text}-${speaker}-${speechRate}`;
      const cached = audioCache.get(cacheKey);

      if (cached) {
        console.log('⚡ 使用缓存音频');
        setAudioUrl(cached.url);
        await new Promise(resolve => setTimeout(resolve, 100));
        createAndPlayAudio(cached.url);
        return;
      }

      console.log('📡 调用 TTS API...', { speaker, speechRate });
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker, speechRate }),
      });

      console.log('📥 API 响应状态:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ 音频生成成功:', { uri: data.audioUri, size: data.audioSize });

      // 保存到缓存
      audioCache.set(cacheKey, {
        url: data.audioUri,
        timestamp: Date.now()
      });
      console.log('💾 已保存到缓存');

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
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.src = url;

    audio.onloadedmetadata = () => {
      console.log('📊 元数据加载完成，时长:', audio.duration, '秒');
    };

    audio.oncanplaythrough = () => {
      console.log('✅ 音频数据加载完成');
      setIsLoading(false);
    };

    audio.oncanplay = () => {
      console.log('✅ 音频可以播放');
      setIsLoading(false);
    };

    audio.onplay = () => {
      console.log('▶️ 音频开始播放');
      setIsPlaying(true);
      setIsLoading(false);
    };

    audio.onpause = () => {
      console.log('⏸️ 音频暂停');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.onended = () => {
      console.log('🏁 音频播放结束');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.onerror = (e) => {
      console.error('❌ 音频播放错误');
      setIsPlaying(false);
      setIsLoading(false);
      const errorMsg = audio.error?.message || '未知错误';
      alert(`音频播放错误: ${errorMsg}`);
    };

    audio.load();

    setTimeout(() => {
      if (!audio.paused) {
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('✅ audio.play() 成功'))
          .catch((err) => {
            console.error('❌ audio.play() 失败:', err);
            setIsPlaying(false);
            setIsLoading(false);
            alert(`播放失败: ${err.message}`);
          });
      }
    }, 200);
  };

  const resumePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('❌ 恢复播放失败:', err);
          alert(`恢复播放失败: ${err.message}`);
        });
    }
  };

  const getCategorySpeakers = (category: string) => {
    return SPEAKER_OPTIONS.filter(s => s.category === category);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
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

        <Button
          onClick={() => setShowSettings(!showSettings)}
          size="sm"
          variant="ghost"
          className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <Card className="mt-4 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">朗读设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 音色选择 */}
            <div>
              <label className="text-sm font-medium mb-2 block">选择音色</label>
              <Select value={speaker} onValueChange={setSpeaker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-sm font-semibold text-blue-600">女声</div>
                  {getCategorySpeakers('female').map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-sm font-semibold text-blue-600 mt-1">男声</div>
                  {getCategorySpeakers('male').map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-sm font-semibold text-blue-600 mt-1">童声</div>
                  {getCategorySpeakers('child').map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 语速调节 */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                语速: <span className="text-blue-600 font-semibold">{SPEECH_RATE_LABELS[String(speechRate)] || '1.0x'}</span>
              </label>
              <Slider
                value={[speechRate]}
                onValueChange={(values) => setSpeechRate(values[0])}
                min={-5}
                max={5}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>慢</span>
                <span>正常</span>
                <span>快</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default memo(VoicePlayer);

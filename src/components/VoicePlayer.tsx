'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, Settings2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoicePlayerProps {
  text: string;
  className?: string;
}

// 音色选项（根据 coze-coding-dev-sdk 文档的正确列表）
const SPEAKER_OPTIONS = [
  // General Purpose
  { value: 'zh_female_xiaohe_uranus_bigtts', label: '女声 - 小荷（通用）', category: 'female' },
  { value: 'zh_female_vv_uranus_bigtts', label: '女声 - Vivi（中英双语）', category: 'female' },
  { value: 'zh_male_m191_uranus_bigtts', label: '男声 - 云州', category: 'male' },
  { value: 'zh_male_taocheng_uranus_bigtts', label: '男声 - 淘成', category: 'male' },
  // Audiobook/Reading
  { value: 'zh_female_xueayi_saturn_bigtts', label: '女声 - 学雅（故事）', category: 'female' },
  // Video Dubbing
  { value: 'zh_male_dayi_saturn_bigtts', label: '男声 - 达艺', category: 'male' },
  { value: 'zh_female_mizai_saturn_bigtts', label: '女声 - 咪仔', category: 'female' },
  { value: 'zh_female_jitangnv_saturn_bigtts', label: '女声 - 激情', category: 'female' },
  { value: 'zh_female_meilinvyou_saturn_bigtts', label: '女声 - 女友', category: 'female' },
  { value: 'zh_female_santongyongns_saturn_bigtts', label: '女声 - 甜心', category: 'female' },
  { value: 'zh_male_ruyayichen_saturn_bigtts', label: '男声 - 雅辰', category: 'male' },
  // Role Playing
  { value: 'saturn_zh_female_keainvsheng_tob', label: '女声 - 可爱女生', category: 'female' },
  { value: 'saturn_zh_female_tiaopigongzhu_tob', label: '女声 - 调皮公主', category: 'female' },
  { value: 'saturn_zh_male_shuanglangshaonian_tob', label: '男声 - 爽朗少年', category: 'male' },
  { value: 'saturn_zh_male_tiancaitongzhuo_tob', label: '男声 - 天才同桌', category: 'male' },
];

// 语速选项（根据 coze-coding-dev-sdk 文档，范围是 -50 到 100）
const SPEECH_RATE_LABELS: Record<string, string> = {
  '-30': '0.5x (很慢)',
  '-20': '0.7x (较慢)',
  '-10': '0.85x (稍慢)',
  '0': '1.0x (正常)',
  '10': '1.2x (稍快)',
  '20': '1.4x (较快)',
  '30': '1.6x (很快)',
  '50': '2.0x (超快)',
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
  const [currentSpeaker, setCurrentSpeaker] = useState('zh_female_xueayi_saturn_bigtts');
  const [currentSpeechRate, setCurrentSpeechRate] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitializing = useRef(false);

  // 跟踪生成音频时使用的参数
  const generatedSpeakerRef = useRef(currentSpeaker);
  const generatedSpeechRateRef = useRef(currentSpeechRate);

  // 当音色或语速改变时，清除当前音频，强制重新生成
  useEffect(() => {
    // 如果参数改变，清除音频 URL 和播放状态
    if (audioUrl && (generatedSpeakerRef.current !== currentSpeaker || generatedSpeechRateRef.current !== currentSpeechRate)) {
      console.log('🔄 参数改变，清除旧音频:', {
        from: { speaker: generatedSpeakerRef.current, rate: generatedSpeechRateRef.current },
        to: { speaker: currentSpeaker, rate: currentSpeechRate }
      });

      // 清理音频
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
          audioRef.current.src = '';
          audioRef.current.load();
        } catch (e) {
          console.log('清理音频时忽略错误:', e);
        }
        audioRef.current = null;
      }

      setAudioUrl(null);
      setIsPlaying(false);
      setIsLoading(false);
      isInitializing.current = false;
    }

    // 更新当前参数
    generatedSpeakerRef.current = currentSpeaker;
    generatedSpeechRateRef.current = currentSpeechRate;
  }, [currentSpeaker, currentSpeechRate, audioUrl]);

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('=== VoicePlayer ===');
    console.log('状态:', { isPlaying, isLoading, hasAudioUrl: !!audioUrl, speaker: currentSpeaker, speechRate: currentSpeechRate });

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
      const cacheKey = `${text}-${currentSpeaker}-${currentSpeechRate}`;
      const cached = audioCache.get(cacheKey);

      if (cached) {
        console.log('⚡ 使用缓存音频');
        setAudioUrl(cached.url);
        await new Promise(resolve => setTimeout(resolve, 100));
        createAndPlayAudio(cached.url);
        return;
      }

      console.log('📡 调用 TTS API...', { speaker: currentSpeaker, speechRate: currentSpeechRate });
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker: currentSpeaker, speechRate: currentSpeechRate }),
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
      setErrorMessage(`语音播放失败: ${errorMsg}`);
      setIsLoading(false);
    } finally {
      isInitializing.current = false;
    }
  };

  const createAndPlayAudio = (url: string) => {
    console.log('🎵 创建音频对象:', url);

    // 清理之前的音频（静默处理错误）
    if (audioRef.current) {
      try {
        audioRef.current.onloadedmetadata = null;
        audioRef.current.oncanplay = null;
        audioRef.current.onplay = null;
        audioRef.current.onpause = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      } catch (e) {
        // 忽略清理时的错误
        console.log('清理旧音频时忽略错误:', e);
      }
      audioRef.current = null;
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
      setErrorMessage(`音频播放错误: ${errorMsg}`);
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
            setErrorMessage(`播放失败: ${err.message}`);
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
          setErrorMessage(`恢复播放失败: ${err.message}`);
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
              <Select value={currentSpeaker} onValueChange={setCurrentSpeaker}>
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
                语速: <span className="text-blue-600 font-semibold">{SPEECH_RATE_LABELS[String(currentSpeechRate)] || '1.0x'}</span>
              </label>
              <Slider
                value={[currentSpeechRate]}
                onValueChange={(values) => setCurrentSpeechRate(values[0])}
                min={-30}
                max={50}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>很慢</span>
                <span>正常</span>
                <span>很快</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default memo(VoicePlayer);

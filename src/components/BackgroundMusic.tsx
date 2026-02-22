'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Music, Play, Pause, Music2, AlertCircle } from 'lucide-react';

// 背景音乐列表（使用稳定的免费音乐资源）
const BACKGROUND_MUSIC = [
  {
    id: 1,
    name: '雨声',
    artist: '自然声音',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_0871a9478c.mp3',
    cover: '/music-rain.png',
  },
  {
    id: 2,
    name: '森林鸟鸣',
    artist: '自然声音',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_105c70c4bd.mp3',
    cover: '/music-forest.png',
  },
  {
    id: 3,
    name: '流水声',
    artist: '自然声音',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_0625c1535c.mp3',
    cover: '/music-water.png',
  },
  {
    id: 4,
    name: '轻柔钢琴',
    artist: '钢琴曲',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_145a405664.mp3',
    cover: '/music-piano.png',
  },
  {
    id: 5,
    name: '静谧夜晚',
    artist: '环境音',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_46d72a5811.mp3',
    cover: '/music-night.png',
  },
  {
    id: 6,
    name: '微风轻抚',
    artist: '自然声音',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    cover: '/music-wind.png',
  },
];

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30); // 默认音量降低到 30%
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      audioRef.current.crossOrigin = 'anonymous';

      // 添加错误处理
      audioRef.current.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
        setLoadError('音频加载失败，请尝试其他音乐');
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
        setLoadError(null);
      });

      audioRef.current.addEventListener('loadstart', () => {
        setIsLoaded(false);
        setLoadError(null);
      });
    }

    const audio = audioRef.current;

    // 加载用户偏好
    const savedVolume = localStorage.getItem('bgMusicVolume');
    const savedTrackIndex = localStorage.getItem('bgMusicTrackIndex');
    const savedIsPlaying = localStorage.getItem('bgMusicIsPlaying');

    if (savedVolume) {
      const vol = parseInt(savedVolume, 10);
      setVolume(vol);
      audio.volume = vol / 100;
    }

    if (savedTrackIndex !== null) {
      const index = parseInt(savedTrackIndex, 10);
      setCurrentTrackIndex(index);
    }

    // 不自动恢复播放，需要用户手动点击
    setIsPlaying(false);
    loadTrack(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.removeEventListener('error', () => {});
        audio.removeEventListener('canplaythrough', () => {});
        audio.removeEventListener('loadstart', () => {});
      }
    };
  }, []);

  // 保存用户偏好
  useEffect(() => {
    localStorage.setItem('bgMusicVolume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('bgMusicTrackIndex', currentTrackIndex.toString());
    if (audioRef.current) {
      audioRef.current.src = BACKGROUND_MUSIC[currentTrackIndex].url;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('播放失败:', error);
          setLoadError('播放失败，请检查网络连接');
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    localStorage.setItem('bgMusicIsPlaying', isPlaying.toString());
  }, [isPlaying]);

  const loadTrack = (audio: HTMLAudioElement) => {
    const track = BACKGROUND_MUSIC[currentTrackIndex];
    audio.src = track.url;
    setIsLoaded(false);
    setLoadError(null);
  };

  const loadAndPlay = async (audio: HTMLAudioElement) => {
    const track = BACKGROUND_MUSIC[currentTrackIndex];
    audio.src = track.url;
    audio.volume = isMuted ? 0 : volume / 100;

    try {
      await audio.play();
      setIsPlaying(true);
      setLoadError(null);
    } catch (error) {
      console.error('播放失败:', error);
      setLoadError('播放失败，请检查网络连接或点击重试');
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await loadAndPlay(audio);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % BACKGROUND_MUSIC.length);
    setLoadError(null);
  };

  const prevTrack = () => {
    setCurrentTrackIndex(
      (prev) => (prev - 1 + BACKGROUND_MUSIC.length) % BACKGROUND_MUSIC.length
    );
    setLoadError(null);
  };

  const currentTrack = BACKGROUND_MUSIC[currentTrackIndex];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 悬浮按钮 */}
      <Card
        className="p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all"
        onClick={() => setShowControls(!showControls)}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {loadError ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : isPlaying ? (
              <Music2 className="h-5 w-5 text-purple-600 animate-pulse" />
            ) : (
              <Music className="h-5 w-5 text-gray-600" />
            )}
            {isPlaying && !loadError && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            )}
          </Button>
          {showControls && (
            <span className="text-sm font-medium text-gray-700">
              {loadError ? '加载失败' : currentTrack.name}
            </span>
          )}
        </div>
      </Card>

      {/* 控制面板 */}
      {showControls && (
        <Card className="absolute bottom-16 right-0 w-72 p-4 shadow-2xl animate-in slide-in-from-bottom-4">
          {/* 错误提示 */}
          {loadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">{loadError}</p>
              </div>
              <p className="text-xs text-red-600 mt-1">提示：请检查网络连接或尝试其他音乐</p>
            </div>
          )}

          {/* 当前曲目信息 */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {currentTrack.name}
                </h3>
                <p className="text-sm text-gray-500">{currentTrack.artist}</p>
              </div>
            </div>

            {/* 进度条（装饰用，因为是循环播放） */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all ${
                  isPlaying && !loadError ? 'animate-pulse' : ''
                }`}
                style={{ width: (isPlaying && !loadError) ? '100%' : '0%' }}
              />
            </div>
          </div>

          {/* 播放控制按钮 */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTrack}
              className="rounded-full"
            >
              <Music2 className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              onClick={togglePlay}
              size="icon"
              className="rounded-full h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              disabled={loadError !== null}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTrack}
              className="rounded-full"
            >
              <Music2 className="h-4 w-4" />
            </Button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-gray-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-500" />
              )}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-8 text-right">
              {volume}%
            </span>
          </div>

          {/* 音乐列表 */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">播放列表</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {BACKGROUND_MUSIC.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setLoadError(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-purple-100 text-purple-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{track.name}</span>
                    {index === currentTrackIndex && isPlaying && !loadError && (
                      <Music2 className="h-3 w-3 text-purple-600 animate-pulse" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

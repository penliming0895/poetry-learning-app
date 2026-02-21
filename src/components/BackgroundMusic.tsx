'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Music, Play, Pause, Music2 } from 'lucide-react';

// 背景音乐列表（使用免费的古典音乐资源）
const BACKGROUND_MUSIC = [
  {
    id: 1,
    name: '高山流水',
    artist: '古筝',
    url: 'https://music.163.com/song/media/outer/url?id=5234498.mp3',
    cover: '/music-guzheng.png',
  },
  {
    id: 2,
    name: '春江花月夜',
    artist: '琵琶',
    url: 'https://music.163.com/song/media/outer/url?id=347230.mp3',
    cover: '/music-pipa.png',
  },
  {
    id: 3,
    name: '梅花三弄',
    artist: '笛子',
    url: 'https://music.163.com/song/media/outer/url?id=5377636.mp3',
    cover: '/music-flute.png',
  },
  {
    id: 4,
    name: '广陵散',
    artist: '古琴',
    url: 'https://music.163.com/song/media/outer/url?id=28949130.mp3',
    cover: '/music-guqin.png',
  },
];

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化音频
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      audioRef.current.crossOrigin = 'anonymous';
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

    // 恢复播放状态
    if (savedIsPlaying === 'true') {
      setIsPlaying(true);
      loadAndPlay(audio);
    } else {
      setIsPlaying(false);
      loadTrack(audio);
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
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
        audioRef.current.play().catch(console.error);
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
  };

  const loadAndPlay = async (audio: HTMLAudioElement) => {
    const track = BACKGROUND_MUSIC[currentTrackIndex];
    audio.src = track.url;
    audio.volume = isMuted ? 0 : volume / 100;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('播放失败:', error);
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
  };

  const prevTrack = () => {
    setCurrentTrackIndex(
      (prev) => (prev - 1 + BACKGROUND_MUSIC.length) % BACKGROUND_MUSIC.length
    );
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
            {isPlaying ? (
              <Music2 className="h-5 w-5 text-purple-600 animate-pulse" />
            ) : (
              <Music className="h-5 w-5 text-gray-600" />
            )}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            )}
          </Button>
          {showControls && (
            <span className="text-sm font-medium text-gray-700">
              {currentTrack.name}
            </span>
          )}
        </div>
      </Card>

      {/* 控制面板 */}
      {showControls && (
        <Card className="absolute bottom-16 right-0 w-72 p-4 shadow-2xl animate-in slide-in-from-bottom-4">
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
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{ width: isPlaying ? '100%' : '0%' }}
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
              className="rounded-full h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
            <div className="space-y-1">
              {BACKGROUND_MUSIC.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-purple-100 text-purple-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{track.name}</span>
                    {index === currentTrackIndex && isPlaying && (
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

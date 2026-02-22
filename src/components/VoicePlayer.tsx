'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, Settings2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoicePlayerProps {
  text: string;
  className?: string;
}

// 语速选项
const SPEECH_RATE_LABELS: Record<number, string> = {
  0.5: '0.5x (很慢)',
  0.75: '0.75x (较慢)',
  1.0: '1.0x (正常)',
  1.25: '1.25x (稍快)',
  1.5: '1.5x (较快)',
  2.0: '2.0x (很快)',
};

function VoicePlayer({ text, className = '' }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  // 语音设置
  const [currentVoice, setCurrentVoice] = useState<string>('');
  const [currentRate, setCurrentRate] = useState(1.0);
  const [currentPitch, setCurrentPitch] = useState(1.0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 检测浏览器支持
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
      setSupported(supported);
      
      if (!supported) {
        setErrorMessage('您的浏览器不支持语音合成功能');
      }
    }
  }, []);

  // 获取所有语音列表
  const getAllVoices = useCallback(() => {
    if (typeof window === 'undefined') return [];
    return window.speechSynthesis.getVoices();
  }, []);

  // 获取中文语音列表
  const getChineseVoices = useCallback(() => {
    const voices = getAllVoices();
    return voices.filter(voice => voice.lang.startsWith('zh'));
  }, [getAllVoices]);

  // 监听语音列表变化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let timeoutId: NodeJS.Timeout;

      const loadVoices = () => {
        const voices = getAllVoices();
        const chineseVoices = getChineseVoices();
        
        console.log('🎤 语音列表加载:', {
          total: voices.length,
          chinese: chineseVoices.length,
          voices: chineseVoices.map(v => v.name)
        });

        if (voices.length > 0) {
          setVoicesLoaded(true);
          
          if (!currentVoice && chineseVoices.length > 0) {
            // 默认选择第一个中文语音
            setCurrentVoice(chineseVoices[0].name);
            console.log('✅ 默认选择语音:', chineseVoices[0].name);
          } else if (!currentVoice && voices.length > 0) {
            // 如果没有中文语音，使用第一个可用语音
            setCurrentVoice(voices[0].name);
            console.log('✅ 默认选择语音（非中文）:', voices[0].name);
          }
        }
      };

      // 有些浏览器需要等待 voiceschanged 事件
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // 立即尝试加载
      loadVoices();

      // 延迟再次尝试，确保语音列表完全加载
      timeoutId = setTimeout(() => {
        loadVoices();
      }, 500);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (window.speechSynthesis.onvoiceschanged) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, [getAllVoices, getChineseVoices, currentVoice]);

  // 停止当前播放
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, []);

  // 处理播放/暂停
  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!supported) {
      setErrorMessage('您的浏览器不支持语音合成功能');
      return;
    }

    if (!voicesLoaded) {
      setErrorMessage('语音列表正在加载，请稍候...');
      return;
    }

    if (!text || text.trim() === '') {
      setErrorMessage('没有可朗读的内容');
      return;
    }

    if (isPaused) {
      // 从暂停恢复
      resumeSpeaking();
    } else if (isPlaying) {
      // 暂停播放
      pauseSpeaking();
    } else {
      // 开始播放
      startSpeaking();
    }
  }, [isPlaying, isPaused, supported, voicesLoaded, text]);

  // 开始播放
  const startSpeaking = useCallback(() => {
    console.log('🎤 开始播放:', { text: text.substring(0, 30) + '...', voice: currentVoice, rate: currentRate });

    stopSpeaking();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 确保语音合成服务已就绪
      window.speechSynthesis.cancel();
      
      // 尝试恢复服务（解决 Chrome 的中断问题）
      if (!window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }

      // 创建新的 utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // 设置语言为中文
      utterance.lang = 'zh-CN';

      // 设置语音
      const voices = getAllVoices();
      const selectedVoice = voices.find(v => v.name === currentVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ 使用语音:', selectedVoice.name);
      } else {
        console.warn('⚠️ 未找到指定语音，使用默认语音');
      }

      // 设置语速（0.1-10）
      utterance.rate = currentRate;

      // 设置音调（0-2）
      utterance.pitch = currentPitch;

      // 事件监听
      utterance.onstart = () => {
        console.log('▶️ 语音开始播放');
        setIsLoading(false);
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        console.log('🏁 语音播放结束');
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('❌ 语音合成错误:', event);
        console.error('错误类型:', event.error);
        console.error('是否被中断:', event.error === 'interrupted');
        
        setIsLoading(false);
        setIsPlaying(false);
        setIsPaused(false);
        
        const errorMsg = event.error || 'unknown';
        const errorMessages: Record<string, string> = {
          'canceled': '播放被取消',
          'interrupted': '播放被中断',
          'audio-busy': '音频设备忙碌',
          'synthesis-unavailable': '语音合成不可用',
          'not-allowed': '播放被阻止',
          'unknown': '未知错误',
        };
        
        setErrorMessage(`语音播放失败: ${errorMessages[errorMsg] || errorMsg}`);
        utteranceRef.current = null;
      };

      utterance.onpause = () => {
        console.log('⏸️ 语音暂停');
        setIsPaused(true);
      };

      utterance.onresume = () => {
        console.log('▶️ 语音恢复播放');
        setIsPaused(false);
      };

      // 短暂延迟确保语音合成服务已就绪
      setTimeout(() => {
        console.log('🚀 调用 speechSynthesis.speak()');
        
        try {
          window.speechSynthesis.speak(utterance);
          
          // 验证播放状态
          setTimeout(() => {
            if (window.speechSynthesis.speaking) {
              console.log('✅ 语音正在播放');
              setIsLoading(false);
            } else {
              console.warn('⚠️ 语音未开始播放，尝试重试...');
              // 尝试重新播放
              window.speechSynthesis.speak(utterance);
            }
          }, 100);
          
        } catch (speakError) {
          console.error('❌ speak() 调用失败:', speakError);
          setIsLoading(false);
          setErrorMessage('无法播放语音，请重试');
        }
      }, 50);
      
    } catch (error) {
      console.error('❌ 启动语音播放失败:', error);
      setIsLoading(false);
      setIsPlaying(false);
      setIsPaused(false);
      setErrorMessage(`启动失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [text, currentVoice, currentRate, currentPitch, getAllVoices, stopSpeaking]);

  // 暂停播放
  const pauseSpeaking = useCallback(() => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  // 恢复播放
  const resumeSpeaking = useCallback(() => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPaused]);

  // 停止播放（用于设置改变时）
  const handleStop = useCallback(() => {
    stopSpeaking();
  }, [stopSpeaking]);

  // 当设置改变时停止播放
  useEffect(() => {
    if (isPlaying || isPaused) {
      handleStop();
    }
  }, [currentVoice, currentRate, currentPitch, isPlaying, isPaused, handleStop]);

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // 获取当前选择的语音对象
  const voices = getChineseVoices();
  const selectedVoice = voices.find(v => v.name === currentVoice);

  if (!supported) {
    return (
      <div className={className}>
        <Button size="sm" variant="outline" disabled>
          <VolumeX className="h-4 w-4 mr-2" />
          朗读不支持
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          onClick={handlePlayPause}
          disabled={isLoading || !text}
          size="sm"
          variant="outline"
          className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 dark:border-blue-800 transition-all duration-300 hover:scale-105"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : isPlaying || isPaused ? (
            <VolumeX className="h-4 w-4 mr-2" />
          ) : (
            <Volume2 className="h-4 w-4 mr-2" />
          )}
          {isLoading ? '加载中...' : isPaused ? '继续' : isPlaying ? '暂停' : '朗读'}
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

      {/* 错误提示 */}
      {errorMessage && (
        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

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
              <Select 
                value={currentVoice} 
                onValueChange={setCurrentVoice}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择语音" />
                </SelectTrigger>
                <SelectContent>
                  {voices.length === 0 ? (
                    <SelectItem value="none" disabled>
                      暂无可用语音
                    </SelectItem>
                  ) : (
                    voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} {voice.localService ? '(本地)' : '(在线)'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedVoice && (
                <div className="mt-1 text-xs text-gray-500">
                  当前使用: {selectedVoice.name}
                </div>
              )}
            </div>

            {/* 语速调节 */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                语速: <span className="text-blue-600 font-semibold">{SPEECH_RATE_LABELS[currentRate] || `${currentRate}x`}</span>
              </label>
              <Slider
                value={[currentRate]}
                onValueChange={(values) => setCurrentRate(values[0])}
                min={0.5}
                max={2.0}
                step={0.25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* 音调调节 */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                音调: <span className="text-purple-600 font-semibold">{currentPitch.toFixed(2)}</span>
              </label>
              <Slider
                value={[currentPitch]}
                onValueChange={(values) => setCurrentPitch(values[0])}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>低沉</span>
                <span>高亢</span>
              </div>
            </div>

            {/* 使用说明 */}
            <div className="text-xs text-gray-500 border-t pt-3">
              <p>💡 提示：使用浏览器的内置语音合成功能</p>
              <p>• 不同浏览器支持的语音不同</p>
              <p>• 建议使用 Chrome 或 Edge 获得最佳效果</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default memo(VoicePlayer);

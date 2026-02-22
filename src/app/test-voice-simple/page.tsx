'use client';

import { useState, useEffect } from 'react';
import SimpleVoicePlayer from '@/components/SimpleVoicePlayer';

export default function TestSimpleVoicePage() {
  const [browserInfo, setBrowserInfo] = useState({
    hasSpeechSynthesis: false,
    hasUtterance: false,
    userAgent: '',
    platform: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        hasSpeechSynthesis: 'speechSynthesis' in window,
        hasUtterance: 'SpeechSynthesisUtterance' in window,
        userAgent: navigator.userAgent,
        platform: navigator.platform
      });
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🎤 简化版语音播放器测试
      </h1>

      {/* 浏览器信息 */}
      <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #2196f3' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#0d47a1' }}>
          📱 浏览器信息
        </h2>
        <ul style={{ color: '#0d47a1', lineHeight: '1.8', fontSize: '14px' }}>
          <li>支持 SpeechSynthesis: <strong>{browserInfo.hasSpeechSynthesis ? '✅ 是' : '❌ 否'}</strong></li>
          <li>支持 SpeechSynthesisUtterance: <strong>{browserInfo.hasUtterance ? '✅ 是' : '❌ 否'}</strong></li>
          <li>平台: <strong>{browserInfo.platform}</strong></li>
          <li>浏览器: <strong>{browserInfo.userAgent.substring(0, 50)}...</strong></li>
        </ul>
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          测试 1: 短文本
        </h2>
        <p style={{ marginBottom: '10px' }}>
          床前明月光，疑是地上霜。
        </p>
        <SimpleVoicePlayer text="床前明月光，疑是地上霜。" />
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          测试 2: 中等长度文本
        </h2>
        <p style={{ marginBottom: '10px' }}>
          春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。
        </p>
        <SimpleVoicePlayer text="春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。" />
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          测试 3: 长文本（完整诗词）
        </h2>
        <p style={{ marginBottom: '10px' }}>
          蜀道之难，难于上青天！蚕丛及鱼凫，开国何茫然！尔来四万八千岁，不与秦塞通人烟。
        </p>
        <SimpleVoicePlayer text="蜀道之难，难于上青天！蚕丛及鱼凫，开国何茫然！尔来四万八千岁，不与秦塞通人烟。" />
      </div>

      <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ffc107' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>
          测试说明
        </h2>
        <ul style={{ color: '#856404', lineHeight: '1.6' }}>
          <li>点击"朗读"按钮测试语音播放</li>
          <li>点击"停止"按钮可以停止播放</li>
          <li>如果按钮显示"不支持"，说明您的浏览器不支持语音功能</li>
          <li>建议使用 Chrome、Edge 或 Firefox 浏览器获得最佳体验</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          返回首页
        </a>
      </div>
    </div>
  );
}

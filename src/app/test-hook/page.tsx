'use client';

import { useGameProgress } from '@/hooks/useGameProgress';

export default function TestHookPage() {
  const { progress, getAverageAccuracy, mounted } = useGameProgress();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ Hook 测试</h1>
      <hr />
      <p>时间：{new Date().toLocaleString()}</p>

      <div style={{ marginTop: '20px' }}>
        <h2>测试 useGameProgress Hook：</h2>
        <p>Mounted: {mounted ? '✅ 是' : '❌ 否'}</p>
        <p>平均正确率: {getAverageAccuracy()}%</p>
        <p>已学习诗词数: {progress.learnedPoems.length}</p>
        <p>测试次数: {progress.testCount}</p>
        <p>总得分: {progress.totalScore}</p>
        <p>错题数: {progress.wrongPoetryList.length + progress.wrongLineList.length}</p>

        <h3>完整数据：</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
          {JSON.stringify(progress, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          返回首页
        </a>
      </div>
    </div>
  );
}

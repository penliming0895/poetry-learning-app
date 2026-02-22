'use client';

import { useState, useEffect } from 'react';

export default function TestDataPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 测试数据加载
      const testPoetry = {
        id: 'test-1',
        title: '测试诗词',
        author: '测试作者',
        content: '这是一首测试诗词的内容',
        lines: ['第一句', '第二句', '第三句', '第四句'],
      };

      setData(testPoetry);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ 数据加载测试</h1>
      <hr />
      <p>时间：{new Date().toLocaleString()}</p>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h2>❌ 错误：</h2>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h2>✅ 数据加载成功：</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          返回首页
        </a>
      </div>
    </div>
  );
}

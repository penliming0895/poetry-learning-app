'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestUIPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ UI 组件测试成功！</h1>
      <p>如果你能看到这个页面，说明 UI 组件渲染正常。</p>
      <hr />
      <p>时间：{new Date().toLocaleString()}</p>

      {/* 测试 shadcn/ui 组件 */}
      <div style={{ marginTop: '20px' }}>
        <h2>测试 shadcn/ui 组件：</h2>
        <Button>测试按钮</Button>
        <br />
        <br />
        <Badge>测试徽章</Badge>
        <br />
        <br />
        <Card>
          <CardHeader>
            <CardTitle>测试卡片</CardTitle>
          </CardHeader>
          <CardContent>
            <p>这是卡片内容</p>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          返回首页
        </a>
      </div>
    </div>
  );
}

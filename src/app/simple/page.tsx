'use client';

export default function SimpleHome() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue', fontSize: '24px' }}>初三语文古诗词背默</h1>
      <p>✅ 页面加载成功！</p>
      <p>当前时间：{new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>功能模块</h2>
        <ul style={{ lineHeight: '2' }}>
          <li><a href="/daily" style={{ color: 'blue' }}>每日背默5首</a></li>
          <li><a href="/practice" style={{ color: 'blue' }}>背诵练习模式</a></li>
          <li><a href="/test" style={{ color: 'blue' }}>默写测试模式</a></li>
          <li><a href="/wrongbook" style={{ color: 'blue' }}>错题本</a></li>
          <li><a href="/achievements" style={{ color: 'blue' }}>成就系统</a></li>
        </ul>
      </div>
    </div>
  );
}

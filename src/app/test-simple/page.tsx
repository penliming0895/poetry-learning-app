export default function TestSimplePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>✅ 测试页面加载成功！</h1>
      <p>如果你能看到这个页面，说明应用本身是可以正常运行的。</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>
        当前时间：{new Date().toLocaleString()}
      </p>
      <div style={{ marginTop: '20px', padding: '10px', border: '2px solid #ccc' }}>
        <h3>请尝试以下操作：</h3>
        <ul>
          <li><a href="/">返回首页</a></li>
          <li><a href="/practice">去练习模式</a></li>
          <li><a href="/test">去测试模式</a></li>
        </ul>
      </div>
    </div>
  );
}

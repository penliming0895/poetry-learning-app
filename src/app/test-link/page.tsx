export default function TestLinkPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>✅ 测试链接成功！</h1>
      <p>如果你能看到这个页面，说明链接跳转是正常的。</p>
      <p>问题可能出在目标页面上。</p>
      <hr />
      <p>时间：{new Date().toLocaleString()}</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        返回首页
      </a>
    </div>
  );
}

'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">点击测试页面</h1>

      <div className="space-y-4">
        {/* 测试1: 纯HTML a标签 */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">测试1: 纯HTML a标签</h2>
          <a href="/daily" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg">
            点击跳转到每日背默
          </a>
        </div>

        {/* 测试2: 简单的div + onClick */}
        <div
          onClick={() => {
            console.log('点击了div');
            window.location.href = '/practice';
          }}
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-2">测试2: div + onClick</h2>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg">
            点击跳转到练习模式
          </button>
        </div>

        {/* 测试3: 包裹整个卡片的a标签 */}
        <a href="/test" className="block">
          <div className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">测试3: 包裹整个卡片的a标签</h2>
            <p className="text-gray-600">点击卡片任意位置跳转到测试模式</p>
          </div>
        </a>

        {/* 测试4: 使用window.open */}
        <div
          onClick={() => {
            console.log('点击了wrongbook div');
            window.open('/wrongbook', '_self');
          }}
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold mb-2">测试4: window.open</h2>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg">
            点击跳转到错题本
          </button>
        </div>
      </div>
    </div>
  );
}

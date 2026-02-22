'use client';

import Link from 'next/link';

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-12">初三语文古诗词背默</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* 每日背默 */}
        <Link href="/daily" className="block">
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">📅 每日背默5首</h2>
            <p className="text-gray-600">根据日期自动轮换，每天5首新诗词</p>
          </div>
        </Link>

        {/* 练习模式 */}
        <Link href="/practice" className="block">
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">📖 背诵练习模式</h2>
            <p className="text-gray-600">逐句背诵，智能提示，轻松掌握每首诗词</p>
          </div>
        </Link>

        {/* 测试模式 */}
        <Link href="/test" className="block">
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">✍️ 默写测试模式</h2>
            <p className="text-gray-600">完整默写，智能评分，检验学习成果</p>
          </div>
        </Link>

        {/* 错题本 */}
        <Link href="/wrongbook" className="block">
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-red-200 hover:border-red-500 hover:shadow-xl transition-all cursor-pointer">
            <h2 className="text-2xl font-bold text-red-600 mb-2">📋 错题本</h2>
            <p className="text-gray-600">记录错题，重点复习</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

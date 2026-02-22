'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
          <div className="container mx-auto py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-red-600 mb-4">应用加载失败</h1>
              <p className="text-gray-600 mb-4">抱歉，应用遇到了一些问题。请尝试以下操作：</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>刷新页面</li>
                <li>清除浏览器缓存</li>
                <li>使用 Chrome 或 Edge 浏览器</li>
              </ul>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                重新加载
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

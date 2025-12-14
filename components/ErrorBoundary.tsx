import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">应用程序错误</h2>
          <p className="text-slate-600 mb-6 max-w-md">
            应用程序遇到了意外问题，需要关闭。
          </p>
          <div className="bg-slate-100 p-4 rounded-lg text-left w-full max-w-md mb-6 overflow-auto max-h-32 border border-slate-200">
             <code className="text-xs text-red-500 font-mono">
               {this.state.error?.message || '未知错误'}
             </code>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            重启应用程序
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
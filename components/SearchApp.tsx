import React, { useState } from 'react';
import { Search, BookOpen, MessageSquare, BarChart3, GraduationCap, X } from 'lucide-react';

export const SearchApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'OFDM',
    '采样定理',
    'MIMO系统',
    'QAM调制',
  ]);

  const quickActions = [
    { icon: BookOpen, label: 'AI助手', action: 'agent' },
    { icon: MessageSquare, label: '我的考试', action: 'exams' },
    { icon: BarChart3, label: '误解分析', action: 'misconceptions' },
    { icon: GraduationCap, label: '智能练习', action: 'practice' },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 这里可以添加搜索逻辑
      console.log('搜索:', searchQuery);
    }
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Search className="w-8 h-8 text-slate-600" />
            搜索
          </h1>
          <p className="text-slate-600">快速查找功能和内容</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索功能、知识点、考试..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              搜索
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-medium text-slate-700">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">最近搜索</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-medium text-slate-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

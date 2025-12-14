import React, { useState, useEffect } from 'react';
import { CloudSun, Search, Bell, User, BookOpen } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  };

  return (
    <div className="flex justify-between items-start pt-6 px-4 lg:px-8 select-none z-10 relative">
      {/* Left: Time & Weather */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-800 tracking-tight" style={{ fontFamily: 'system-ui' }}>
            {formatTime(time)}
          </h1>
          <div className="hidden lg:flex flex-col justify-center">
            <div className="flex items-center gap-2 text-slate-600">
              <CloudSun className="w-6 h-6 text-blue-500" />
              <span className="font-bold">晴天 22°C</span>
            </div>
            <span className="text-sm text-slate-500 font-medium">12-24°C</span>
          </div>
        </div>
        <p className="text-slate-500 font-medium mt-1 ml-1">{formatDate(time)}</p>
      </div>

      {/* Right: Gamification & Profile */}
      <div className="flex items-center gap-3 lg:gap-6 mt-2">
        {/* Coin Pill */}
        <div className="hidden sm:flex bg-yellow-100 border border-yellow-200 rounded-full px-4 py-2 items-center gap-2 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center text-[10px] font-bold text-yellow-900">
            $
          </div>
          <span className="font-black text-yellow-700 text-lg">13,456</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 lg:gap-4">
          <button className="flex items-center gap-2 glass-card px-2 lg:px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-white hover:scale-105 transition-all">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span className="hidden lg:inline">指南</span>
          </button>
          <button className="flex items-center gap-2 glass-card px-2 lg:px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-white hover:scale-105 transition-all">
            <Bell className="w-5 h-5 text-indigo-500" />
            <span className="hidden lg:inline">消息</span>
          </button>
          <button className="flex items-center gap-2 glass-card px-2 lg:px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-white hover:scale-105 transition-all">
            <User className="w-5 h-5 text-purple-500" />
            <span className="hidden lg:inline">我</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-card rounded-full p-3 hover:bg-white transition-colors cursor-pointer">
          <Search className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </div>
  );
};
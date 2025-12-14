import React, { useState } from 'react';
import { Trophy, Target, TrendingUp, Clock, Flame, Play } from 'lucide-react';

interface TrainingRecord {
  id: string;
  type: string;
  duration: number;
  score?: number;
  date: string;
}

interface TrainingAppProps {
  onStartTraining?: () => void;
}

export const TrainingApp: React.FC<TrainingAppProps> = ({ onStartTraining }) => {
  const [records, setRecords] = useState<TrainingRecord[]>([
    { id: '1', type: 'OFDM练习', duration: 30, score: 85, date: '2024-12-23' },
    { id: '2', type: '采样定理训练', duration: 25, score: 92, date: '2024-12-22' },
    { id: '3', type: 'MIMO综合练习', duration: 45, score: 78, date: '2024-12-21' },
  ]);

  const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0);
  const avgScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + (r.score || 0), 0) / records.length)
    : 0;
  const streak = 7; // 连续训练天数

  return (
    <div className="h-full p-8 bg-gradient-to-br from-violet-50 to-purple-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-violet-900 mb-2">学习训练</h1>
          <p className="text-violet-700">追踪你的训练进度和成就</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-violet-600">总训练时长</span>
              <Clock className="w-5 h-5 text-violet-500" />
            </div>
            <h3 className="text-3xl font-black text-violet-900">{totalMinutes}</h3>
            <p className="text-sm text-violet-600 mt-1">分钟</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-violet-600">平均分数</span>
              <TrendingUp className="w-5 h-5 text-violet-500" />
            </div>
            <h3 className="text-3xl font-black text-violet-900">{avgScore}</h3>
            <p className="text-sm text-violet-600 mt-1">分</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-violet-600">连续训练</span>
              <Flame className="w-5 h-5 text-violet-500" />
            </div>
            <h3 className="text-3xl font-black text-violet-900">{streak}</h3>
            <p className="text-sm text-violet-600 mt-1">天</p>
          </div>
        </div>

        {/* Start Training Button */}
        {onStartTraining && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-200 mb-6">
            <button
              onClick={onStartTraining}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <Play className="w-6 h-6" />
              开始新的训练
            </button>
          </div>
        )}

        {/* Training Records */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-violet-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl font-bold text-violet-900">训练记录</h2>
          </div>

          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{record.type}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                        <span>{record.duration} 分钟</span>
                        {record.score && (
                          <span className="font-bold text-violet-600">得分: {record.score}</span>
                        )}
                        <span>{record.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {records.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>还没有训练记录，开始你的第一次训练吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


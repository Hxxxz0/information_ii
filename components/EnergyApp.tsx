import React, { useState, useEffect } from 'react';
import { Zap, Battery, TrendingUp, Award, Star } from 'lucide-react';

export const EnergyApp: React.FC = () => {
  const [energy, setEnergy] = useState(75);
  const [totalPoints, setTotalPoints] = useState(13456);
  const [level, setLevel] = useState(12);

  useEffect(() => {
    // 模拟能量恢复
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(100, prev + 0.1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const achievements = [
    { id: '1', title: '学习新手', desc: '完成第一次学习', earned: true },
    { id: '2', title: '连续学习者', desc: '连续学习7天', earned: true },
    { id: '3', title: '满分达人', desc: '获得10次满分', earned: false },
    { id: '4', title: '知识大师', desc: '掌握所有知识点', earned: false },
  ];

  return (
    <div className="h-full p-8 bg-gradient-to-br from-blue-50 to-cyan-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-blue-900 mb-2">能量中心</h1>
          <p className="text-blue-700">管理你的学习能量和积分</p>
        </div>

        {/* Energy Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Battery className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-blue-900">当前能量</h2>
                <p className="text-sm text-blue-600">能量会自动恢复</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">{Math.round(energy)}%</div>
              <div className="text-sm text-blue-500">等级 {level}</div>
            </div>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${energy}%` }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-500" />
              <div>
                <h2 className="text-xl font-bold text-blue-900">总积分</h2>
                <p className="text-sm text-blue-600">通过学习和练习获得</p>
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600">{totalPoints.toLocaleString()}</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900">成就系统</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned ? 'bg-amber-400' : 'bg-slate-300'
                    }`}
                  >
                    <Award
                      className={`w-6 h-6 ${
                        achievement.earned ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{achievement.title}</h3>
                    <p className="text-sm text-slate-600">{achievement.desc}</p>
                    {achievement.earned && (
                      <span className="text-xs text-amber-600 font-bold mt-1 block">✓ 已获得</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


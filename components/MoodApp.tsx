import React, { useState } from 'react';
import { Heart, Smile, Frown, Meh, TrendingUp, Calendar } from 'lucide-react';

type MoodType = 'happy' | 'sad' | 'neutral' | 'excited';

interface MoodRecord {
  id: string;
  type: MoodType;
  note: string;
  date: string;
}

const moodConfig = {
  happy: { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100', label: '开心' },
  sad: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100', label: '难过' },
  neutral: { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100', label: '平静' },
  excited: { icon: Heart, color: 'text-red-500', bg: 'bg-red-100', label: '兴奋' },
};

export const MoodApp: React.FC = () => {
  const [moods, setMoods] = useState<MoodRecord[]>([
    { id: '1', type: 'happy', note: '今天学习效率很高！', date: '2024-12-23' },
    { id: '2', type: 'excited', note: '完成了OFDM章节', date: '2024-12-22' },
    { id: '3', type: 'neutral', note: '正常的学习日', date: '2024-12-21' },
  ]);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  const addMood = () => {
    if (!selectedMood) return;
    const newMood: MoodRecord = {
      id: Date.now().toString(),
      type: selectedMood,
      note: note || '今天的心情',
      date: new Date().toISOString().split('T')[0],
    };
    setMoods([newMood, ...moods]);
    setSelectedMood(null);
    setNote('');
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-rose-50 to-pink-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-rose-900 mb-2">心情记录</h1>
          <p className="text-rose-700">记录你的学习心情和感受</p>
        </div>

        {/* Mood Selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-200 mb-6">
          <h2 className="text-lg font-bold text-rose-900 mb-4">今天的心情如何？</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {(Object.keys(moodConfig) as MoodType[]).map((mood) => {
              const config = moodConfig[mood];
              const Icon = config.icon;
              return (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedMood === mood
                      ? `${config.bg} border-rose-400 scale-105`
                      : 'bg-white border-rose-200 hover:border-rose-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${config.color}`} />
                  <p className="text-sm font-bold text-slate-700">{config.label}</p>
                </button>
              );
            })}
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注（可选）..."
              className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
          <button
            onClick={addMood}
            disabled={!selectedMood}
            className="w-full px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            记录心情
          </button>
        </div>

        {/* Mood History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-rose-600" />
            <h2 className="text-xl font-bold text-rose-900">心情历史</h2>
          </div>

          <div className="space-y-4">
            {moods.map((mood) => {
              const config = moodConfig[mood.type];
              const Icon = config.icon;
              return (
                <div
                  key={mood.id}
                  className={`${config.bg} rounded-xl p-4 border border-rose-200`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center border-2 border-rose-300`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-800">{config.label}</span>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {mood.date}
                        </span>
                      </div>
                      <p className="text-slate-600">{mood.note}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {moods.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>还没有心情记录，记录你的第一个心情吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


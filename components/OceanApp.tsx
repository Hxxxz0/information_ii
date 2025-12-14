import React, { useState, useEffect } from 'react';
import { Waves, Play, Pause, Volume2, VolumeX, Anchor, Fish } from 'lucide-react';

export const OceanApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [selectedScene, setSelectedScene] = useState<'ocean' | 'rain' | 'forest'>('ocean');

  const scenes = [
    { id: 'ocean', name: '海洋', icon: Waves, color: 'from-cyan-500 to-blue-600' },
    { id: 'rain', name: '雨声', icon: Anchor, color: 'from-blue-500 to-indigo-600' },
    { id: 'forest', name: '森林', icon: Fish, color: 'from-green-500 to-emerald-600' },
  ];

  useEffect(() => {
    // 模拟音频播放
    if (isPlaying) {
      // 这里可以集成真实的音频播放
    }
  }, [isPlaying]);

  return (
    <div className="h-full p-8 bg-gradient-to-br from-cyan-50 to-blue-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-cyan-900 mb-2">放松海洋</h1>
          <p className="text-cyan-700">沉浸式放松和冥想体验</p>
        </div>

        {/* Scene Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {scenes.map((scene) => {
            const Icon = scene.icon;
            return (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene.id as any)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedScene === scene.id
                    ? `bg-gradient-to-br ${scene.color} border-cyan-400 text-white scale-105`
                    : 'bg-white/80 border-cyan-200 text-slate-700 hover:border-cyan-300'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">{scene.name}</p>
              </button>
            );
          })}
        </div>

        {/* Main Player */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-cyan-200 mb-6">
          <div className="text-center mb-8">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${scenes.find(s => s.id === selectedScene)?.color} flex items-center justify-center shadow-2xl`}>
              <Waves className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {scenes.find(s => s.id === selectedScene)?.name}声音
            </h2>
            <p className="text-slate-600">放松身心，专注当下</p>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Play/Pause */}
            <div className="flex justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                  isPlaying
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:scale-110'
                    : 'bg-gradient-to-br from-cyan-400 to-blue-500 hover:scale-110'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 hover:bg-cyan-100 rounded-lg transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-6 h-6 text-slate-600" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-slate-600" />
                  )}
                </button>
                <div className="flex-1 max-w-xs">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={muted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <span className="text-sm font-bold text-slate-600 w-12 text-right">
                  {muted ? 0 : volume}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">专注计时</h3>
          <div className="text-center">
            <div className="text-5xl font-black text-cyan-600 mb-2">00:00</div>
            <p className="text-slate-600">开始播放以开始计时</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-cyan-50 rounded-xl p-4 border border-cyan-200">
          <p className="text-sm text-cyan-800">
            💡 <strong>提示：</strong> 找一个安静的地方，戴上耳机，闭上眼睛，让声音带你进入放松状态。
          </p>
        </div>
      </div>
    </div>
  );
};


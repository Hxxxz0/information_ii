import React, { useState } from 'react';
import { Settings, Key, Bell, Palette, Info, Save, Check } from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const [settings, setSettings] = useState({
    apiKey: '',
    notifications: true,
    theme: 'light',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // 这里可以添加保存到localStorage或后端的逻辑
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-slate-50 to-gray-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-600" />
            设置
          </h1>
          <p className="text-slate-600">管理你的应用设置和偏好</p>
        </div>

        {/* API Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">API 设置</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gemini API 密钥
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="输入你的 API 密钥..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                密钥将安全存储在本地，不会上传到服务器
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">通知设置</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-slate-800">启用通知</p>
                <p className="text-sm text-slate-500">接收学习提醒和系统通知</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-12 h-6 rounded-full appearance-none bg-slate-300 checked:bg-blue-500 transition-colors relative cursor-pointer"
                style={{
                  background: settings.notifications ? '#3b82f6' : '#cbd5e1',
                }}
              />
            </label>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">主题设置</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {['light', 'dark', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-800 capitalize">{theme === 'auto' ? '自动' : theme === 'light' ? '浅色' : '深色'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">关于</h2>
          </div>
          <div className="space-y-2 text-slate-600">
            <p><strong>应用名称：</strong>TelecomAI - 智能教育助手</p>
            <p><strong>版本：</strong>v1.0.0</p>
            <p><strong>描述：</strong>AI驱动的电信工程教育平台，提供智能考试生成、误解分析和个性化学习路径。</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存设置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

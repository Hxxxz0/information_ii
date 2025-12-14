import React, { useState } from 'react';
import { Settings, Key, Bell, Palette, Info, Save, Check, Cpu } from 'lucide-react';
import { aiService, AIProvider } from '../services/aiService';

export const SettingsApp: React.FC = () => {
  const [settings, setSettings] = useState({
    apiKey: '',
    deepseekApiKey: '',
    aiProvider: aiService.getProvider() as AIProvider,
    notifications: true,
    theme: 'light',
  });
  const [saved, setSaved] = useState(false);

  // 组件加载时从 localStorage 读取设置
  React.useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') as AIProvider;
    const savedGeminiKey = localStorage.getItem('geminiApiKey') || '';
    const savedDeepSeekKey = localStorage.getItem('deepseekApiKey') || '';
    const savedNotifications = localStorage.getItem('notifications');
    const savedTheme = localStorage.getItem('theme');

    setSettings({
      apiKey: savedGeminiKey,
      deepseekApiKey: savedDeepSeekKey,
      aiProvider: savedProvider || 'gemini',
      notifications: savedNotifications ? JSON.parse(savedNotifications) : true,
      theme: savedTheme || 'light',
    });

    // 设置 AI 提供商
    if (savedProvider) {
      aiService.setProvider(savedProvider);
    }
  }, []);

  const handleSave = () => {
    // 检查当前选择的提供商是否有对应的 API key
    const hasProviderKey = settings.aiProvider === 'gemini' 
      ? !!settings.apiKey 
      : !!settings.deepseekApiKey;
    
    if (!hasProviderKey) {
      const providerName = settings.aiProvider === 'gemini' ? 'Gemini' : 'DeepSeek';
      const shouldContinue = window.confirm(
        `⚠️ 警告：您选择了 ${providerName}，但未配置对应的 API Key。\n\n` +
        `是否继续保存？保存后应用将无法正常工作，直到您配置了正确的 API Key。`
      );
      if (!shouldContinue) {
        return;
      }
    }

    // 保存 AI 提供商选择
    aiService.setProvider(settings.aiProvider);
    localStorage.setItem('aiProvider', settings.aiProvider);

    // 保存 API keys（即使为空也保存，以清除旧的 key）
    localStorage.setItem('geminiApiKey', settings.apiKey || '');
    localStorage.setItem('deepseekApiKey', settings.deepseekApiKey || '');

    // 保存其他设置
    localStorage.setItem('notifications', JSON.stringify(settings.notifications));
    localStorage.setItem('theme', settings.theme);

    // 强制重置服务实例，确保使用新的 API key
    aiService.resetInstance();

    // 重新加载页面以应用新的 API keys
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (hasProviderKey) {
        const providerName = settings.aiProvider === 'gemini' ? 'Gemini' : 'DeepSeek';
        alert(`✅ API Key 已保存！\n\n当前使用：${providerName}\n页面将自动刷新以应用配置。`);
        window.location.reload();
      } else {
        alert('⚠️ 设置已保存，但您选择的 AI 提供商缺少 API Key。请配置后刷新页面。');
      }
    }, 1000);
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


        {/* AI Provider Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">AI 提供商</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              选择您想使用的 AI 模型提供商
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiService.getAvailableProviders().map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSettings({ ...settings, aiProvider: provider.id })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${settings.aiProvider === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <p className="font-bold text-slate-800 mb-1">{provider.name}</p>
                  <p className="text-xs text-slate-500">{provider.description}</p>
                  {settings.aiProvider === provider.id && (
                    <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs font-bold">
                      <Check className="w-3 h-3" />
                      当前选择
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">API 密钥</h2>
          </div>
          <div className="space-y-4">
            {/* Gemini API Key */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gemini API 密钥
                {settings.aiProvider === 'gemini' && (
                  <span className="ml-2 text-xs text-blue-600 font-bold">(当前使用)</span>
                )}
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="输入你的 Gemini API 密钥..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                从 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a> 获取
              </p>
              {settings.aiProvider === 'gemini' && !settings.apiKey && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-700">
                    ⚠️ 您选择了 Gemini，但未配置 API Key。请在上方输入您的 Gemini API Key。
                  </p>
                </div>
              )}
            </div>

            {/* DeepSeek API Key */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                DeepSeek API 密钥
                {settings.aiProvider === 'deepseek' && (
                  <span className="ml-2 text-xs text-blue-600 font-bold">(当前使用)</span>
                )}
              </label>
              <input
                type="password"
                value={settings.deepseekApiKey}
                onChange={(e) => setSettings({ ...settings, deepseekApiKey: e.target.value })}
                placeholder="输入你的 DeepSeek API 密钥..."
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-2">
                从 <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">DeepSeek Platform</a> 获取
              </p>
              {settings.aiProvider === 'deepseek' && !settings.deepseekApiKey && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-xs text-red-700">
                    ⚠️ 您选择了 DeepSeek，但未配置 API Key。请在上方输入您的 DeepSeek API Key。
                  </p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <p className="text-xs text-amber-800">
                <strong>⚠️ 安全提示：</strong> API 密钥将存储在浏览器本地，不会上传到服务器。但在生产环境中，建议使用后端代理来保护您的 API 密钥。
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
                  className={`p-4 rounded-xl border-2 transition-all ${settings.theme === theme
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
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${saved
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

import React from 'react';
import { BookOpen, HelpCircle, Lightbulb, Target, GraduationCap, MessageSquare } from 'lucide-react';

export const GuideApp: React.FC = () => {
  const guides = [
    {
      icon: GraduationCap,
      title: '如何使用AI助手',
      description: '学习如何与AI导师对话，生成练习题和考试',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Target,
      title: '误解分析功能',
      description: '了解如何查看和分析你的学习误解',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: MessageSquare,
      title: '考试系统',
      description: '学习如何创建、完成和查看考试',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Lightbulb,
      title: '学习计划',
      description: '管理你的学习任务和目标',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="h-full p-8 bg-gradient-to-br from-indigo-50 to-blue-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-indigo-900 mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            使用指南
          </h1>
          <p className="text-indigo-700">了解如何使用TelecomAI教育平台</p>
        </div>

        {/* Quick Start */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-200 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-indigo-900">快速开始</h2>
          </div>
          <div className="space-y-3 text-slate-700">
            <p>欢迎使用TelecomAI智能教育平台！以下是快速入门指南：</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>点击"作业助手"卡片开始使用AI导师功能</li>
              <li>在AI助手中，你可以提问、生成练习题或创建考试</li>
              <li>查看"仪表板"了解你的学习进度和知识掌握情况</li>
              <li>使用"误解分析"功能找出需要改进的知识点</li>
              <li>通过"学习计划"管理你的学习任务</li>
            </ol>
          </div>
        </div>

        {/* Feature Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${guide.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                    <p className="text-white/90 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
          <p className="text-sm text-indigo-800">
            💡 <strong>提示：</strong> 如果你有任何问题，可以随时点击侧边栏的"设置"按钮查看帮助信息，或使用AI助手提问。
          </p>
        </div>
      </div>
    </div>
  );
};

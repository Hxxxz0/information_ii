import React from 'react';
import { Role, KnowledgePoint } from '../types';
import { KNOWLEDGE_POINTS } from '../constants';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  role: Role;
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  // Prepare data for charts
  const radarData = KNOWLEDGE_POINTS.map(kp => ({
    subject: kp.name,
    A: kp.mastery, // Student / Class average
    fullMark: 100,
  }));

  const performanceData = [
    { name: '周一', score: 65 },
    { name: '周二', score: 70 },
    { name: '周三', score: 68 },
    { name: '周四', score: 85 },
    { name: '周五', score: 82 },
    { name: '周六', score: 90 },
    { name: '周日', score: 88 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {role === Role.STUDENT ? '欢迎回来，亚历克斯！' : '班级仪表板：通信原理'}
          </h2>
          <p className="text-slate-500 mt-1">
            {role === Role.STUDENT 
              ? '本周你在数字调制方面取得了进步。' 
              : '2024-A班表现概览和潜在误解分析。'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-slate-500">当前日期</span>
          <p className="font-medium text-slate-900">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{role === Role.STUDENT ? '平均准确率' : '班级平均'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">78%</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>较上周 +5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{role === Role.STUDENT ? '学习时间' : '待审核'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{role === Role.STUDENT ? '12h' : '5'}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>{role === Role.STUDENT ? '班级前10%' : '等待评分的考试'}</span>
          </div>
        </div>

        <div 
          onClick={() => role === Role.STUDENT && onNavigate && onNavigate('misconceptions')}
          className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow ${
            role === Role.STUDENT && onNavigate ? 'cursor-pointer hover:border-amber-300' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">{role === Role.STUDENT ? '薄弱环节' : '风险提醒'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{role === Role.STUDENT ? 'OFDM' : '3'}</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-amber-600">
            <span>{role === Role.STUDENT ? '掌握度：40%' : '低于60%的学生'}</span>
            {role === Role.STUDENT && onNavigate && (
              <span className="ml-2 text-xs text-amber-500">点击查看详情 →</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">已完成</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>本月练习</span>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Radar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">知识掌握地图</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={role === Role.STUDENT ? "我的掌握度" : "班级平均"}
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">每周表现趋势</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  LogOut,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleRole: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, toggleRole, onOpenSettings }) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表板', icon: LayoutDashboard },
    { id: 'agent', label: 'AI助手', icon: MessageSquare },
    { id: 'exams', label: role === Role.TEACHER ? '考试创建器' : '我的考试', icon: BookOpen },
    { id: 'misconceptions', label: '误解分析', icon: BarChart3 },
  ];

  if (role === Role.STUDENT) {
    menuItems.push({ id: 'practice', label: '智能练习', icon: GraduationCap });
  }

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 text-slate-600 flex flex-col h-full flex-shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
          <Cpu className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">TelecomAI</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">教育助手 v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                  : 'hover:bg-white hover:shadow-md hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
              <span className="font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-200">
        <div className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">当前角色</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">{role === Role.STUDENT ? '学生' : '教师'}</span>
            <button 
              onClick={toggleRole}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition-colors"
            >
              切换
            </button>
          </div>
        </div>
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
};
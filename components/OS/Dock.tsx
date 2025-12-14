import React from 'react';
import { ClipboardList, Dumbbell, Rocket, Heart, MessageCircle, Anchor, Dog, Home } from 'lucide-react';

interface DockProps {
  onAppClick: (appId: string) => void;
  openApps: string[];
}

export const Dock: React.FC<DockProps> = ({ onAppClick, openApps }) => {
  // App icons with IDs
  const items = [
    { id: 'plan', label: '计划', icon: ClipboardList, color: 'bg-emerald-400', shadow: 'shadow-emerald-200' },
    { id: 'training', label: '训练', icon: Dumbbell, color: 'bg-violet-400', shadow: 'shadow-violet-200' },
    { id: 'energy', label: '能量', icon: Rocket, color: 'bg-blue-400', shadow: 'shadow-blue-200' },
    { id: 'mood', label: '心情', icon: Heart, color: 'bg-rose-400', shadow: 'shadow-rose-200' },
    { id: 'message', label: '留言板', icon: MessageCircle, color: 'bg-amber-400', shadow: 'shadow-amber-200' },
    { id: 'ocean', label: '海洋', icon: Anchor, color: 'bg-cyan-400', shadow: 'shadow-cyan-200' },
    { id: 'home', label: '首页', icon: Home, color: 'bg-orange-400', shadow: 'shadow-orange-200' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="glass-panel px-8 py-3 rounded-full flex items-end gap-6 shadow-2xl">
        {items.map((item) => {
          const isOpen = openApps.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onAppClick(item.id)}
              className="group flex flex-col items-center gap-1 cursor-pointer transition-transform hover:-translate-y-2"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg ${item.shadow} border-b-4 border-black/10 relative ${
                isOpen ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
              }`}>
                <item.icon className="w-6 h-6" />
                {isOpen && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
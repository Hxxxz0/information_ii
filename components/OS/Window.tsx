import React from 'react';
import { X } from 'lucide-react';

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'immersive'; // New prop
}

export const Window: React.FC<WindowProps> = ({ title, isOpen, onClose, children, variant = 'default' }) => {
  if (!isOpen) return null;

  const isImmersive = variant === 'immersive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-6 animate-in fade-in zoom-in duration-200">
      <div 
        className={`w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden relative transition-all
          ${isImmersive 
            ? 'bg-black border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] rounded-xl' 
            : 'bg-white rounded-[2rem] shadow-2xl border-4 border-white'
          }`}
        style={!isImmersive ? { boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      >
        {/* Header */}
        <div className={`absolute top-4 right-4 z-50 flex gap-2`}>
          {isImmersive && (
             <div className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded flex items-center">
                实验室模式：在线
             </div>
          )}
          <button 
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm
              ${isImmersive 
                ? 'bg-black/50 hover:bg-red-900/50 text-cyan-500 hover:text-red-500 border border-cyan-900' 
                : 'bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500'
              }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 w-full h-full overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
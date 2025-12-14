import React from 'react';
import { Role } from '../types';
import { MISCONCEPTIONS } from '../constants';
import { AlertCircle, BookOpen, ArrowRight, BrainCircuit } from 'lucide-react';

interface MisconceptionViewProps {
  role: Role;
  onPracticeMisconception?: (topic: string) => void;
}

export const MisconceptionView: React.FC<MisconceptionViewProps> = ({ role, onPracticeMisconception }) => {
  
  const handlePractice = (topic: string) => {
    if (onPracticeMisconception) {
      onPracticeMisconception(`专注于纠正误解的练习题：${topic}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-purple-600" />
          {role === Role.TEACHER ? '班级误解挖掘' : '我的学习诊断'}
        </h2>
        <p className="text-slate-500 mt-1">
          {role === Role.TEACHER 
            ? 'AI分析班级中频繁出现的错误模式。' 
            : '分析您最近的错误，帮助您更快地提高。'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MISCONCEPTIONS.map((misc) => (
          <div key={misc.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                misc.frequency > 40 ? 'bg-red-50 text-red-600' : 
                misc.frequency > 25 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                misc.frequency > 40 ? 'bg-red-100 text-red-700' : 
                misc.frequency > 25 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {misc.frequency}% {role === Role.TEACHER ? '班级占比' : '频率'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {misc.title}
            </h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              {misc.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> 补救策略
              </h4>
              <p className="text-sm text-slate-700 italic">
                "{misc.remediationAdvice}"
              </p>
            </div>

            <button 
              onClick={() => handlePractice(misc.title)}
              className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {role === Role.TEACHER ? '生成练习集' : '练习此主题'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Prompt Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold mb-2">需要更深入的分析？</h3>
          <p className="text-slate-300 text-sm max-w-xl">
            {role === Role.TEACHER 
              ? "助手可以分析特定的作业提交，找出异常误解。" 
              : "上传您的手写笔记或让助手针对这些特定误解对您进行测验。"}
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
          打开诊断聊天
        </button>
      </div>
    </div>
  );
};

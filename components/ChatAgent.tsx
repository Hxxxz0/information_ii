import React, { useState, useRef, useEffect } from 'react';
import { Role, ChatMessage, Question } from '../types';
import { geminiService } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, FileText } from 'lucide-react';

interface ChatAgentProps {
  role: Role;
  onGenerateExam?: (topic: string, questions: Question[]) => void;
}

export const ChatAgent: React.FC<ChatAgentProps> = ({ role, onGenerateExam }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: role === Role.TEACHER 
        ? "您好，教授。我随时准备帮助您设计考试、分析班级表现或生成误解报告。试试问：'创建一个关于MIMO系统的测验'。"
        : "你好！我是你的电信导师。我可以帮助你解决练习题或解释像'采样定理'这样的概念。试试问：'给我3道关于OFDM的练习题'。",
      timestamp: Date.now(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Intelligent Intent Detection (Simple Regex for Demo)
    // In a production app, we would use Gemini's "Function Calling" to detect this intent accurately.
    const examKeywords = ['exam', 'quiz', 'test', 'questions', 'practice'];
    const isExamRequest = examKeywords.some(kw => input.toLowerCase().includes(kw));
    
    try {
      let responseText = "";
      let generatedQuestions: Question[] = [];

      if (isExamRequest && onGenerateExam) {
        // 1. Call specific Exam Generation Logic
        generatedQuestions = await geminiService.generateExamQuestions(input, 3);
        
        if (generatedQuestions.length > 0) {
          responseText = `我已经基于"${input}"生成了一个包含${generatedQuestions.length}道题的练习集。你可以在'我的考试'标签页中找到它。`;
          
          // Trigger App-level state update
          onGenerateExam(input, generatedQuestions);
        } else {
           // Fallback if generation fails or API key is missing
           responseText = await geminiService.sendMessage(input); 
        }
      } else {
        // 2. Normal Conversation
        responseText = await geminiService.sendMessage(input);
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "抱歉，我遇到了连接错误。请检查您的API密钥。",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">电信AI导师</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              在线 • 由 Gemini 2.5 驱动
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          清除历史
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-slate-500">思考中并生成...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={role === Role.TEACHER 
              ? "例如：生成一个涵盖采样和QAM的期中考试..." 
              : "例如：给我一些关于OFDM循环前缀的练习题..."
            }
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 max-h-32 p-2"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-lg transition-colors ${
              !input.trim() || isLoading 
                ? 'text-slate-300 bg-slate-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          提示：询问特定主题即可立即生成交互式练习考试。
        </p>
      </div>
    </div>
  );
};

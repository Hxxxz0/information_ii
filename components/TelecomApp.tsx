import React, { useState, useEffect } from 'react';
import { Role, Exam, Question, ChatMessage } from '../types';
import { MOCK_QUESTIONS } from '../constants';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ChatAgent } from './ChatAgent';
import { ExamView } from './ExamView';
import { MisconceptionView } from './MisconceptionView';
import { SmartExamBuilder } from './SmartExamBuilder';
import { aiService } from '../services/aiService';
import { Menu, X } from 'lucide-react';

interface TelecomAppProps {
  initialTab?: string;
  onOpenSettings?: () => void;
}

const TelecomApp: React.FC<TelecomAppProps> = ({ initialTab, onOpenSettings }) => {
  // State for navigation and role simulation
  const [currentRole, setCurrentRole] = useState<Role>(Role.STUDENT);
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const createWelcomeMessage = (roleToUse: Role): ChatMessage => ({
    id: 'welcome',
    role: 'model',
    text: roleToUse === Role.TEACHER
      ? "您好，教授。我随时准备帮助您设计考试、分析班级表现或生成误解报告。试试问：'创建一个关于MIMO系统的测验'。"
      : "你好！我是你的电信导师。我可以帮助你解决练习题或解释像'采样定理'这样的概念。试试问：'给我3道关于OFDM的练习题'。",
    timestamp: Date.now(),
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([createWelcomeMessage(Role.STUDENT)]);

  // Update activeTab when initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // State for generated exams (simulating data persistence)
  const [generatedExams, setGeneratedExams] = useState<Exam[]>([]);

  const toggleRole = () => {
    setCurrentRole(prev => {
      const next = prev === Role.STUDENT ? Role.TEACHER : Role.STUDENT;
      setChatMessages([createWelcomeMessage(next)]);
      return next;
    });
    setActiveTab('dashboard'); // Reset to dashboard on switch
  };

  // Handler: When Agent generates a new exam structure
  const handleGenerateExam = (topic: string, questions: Question[]) => {
    const newExam: Exam = {
      id: `auto-${Date.now()}`,
      title: `练习：${topic.length > 25 ? topic.slice(0, 25) + '...' : topic}`,
      totalScore: 100,
      durationMinutes: questions.length * 5, // Approx 5 mins per question
      status: 'draft',
      questions: questions.length > 0 ? questions : MOCK_QUESTIONS // Fallback only if empty
    };

    setGeneratedExams(prev => [newExam, ...prev]);
  };

  // Handler: When user wants to practice a misconception
  const handlePracticeMisconception = async (topic: string) => {
    // 1. Switch to Chat to show we are working on it
    setActiveTab('agent');

    // 2. Trigger Gemini service to generate questions
    try {
      // Note: In a real React app, this side-effect might be better in useEffect or a Thunk
      const questions = await aiService.generateExamQuestions(topic, 3);
      handleGenerateExam(topic, questions);

      // 3. Navigate to Exams to show the result
      setActiveTab('exams');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteExam = (examId: string, score: number) => {
    setGeneratedExams(prev => prev.map(e =>
      e.id === examId ? { ...e, status: 'completed', score } : e
    ));
  };

  const handleSaveSmartExam = (exam: Exam) => {
    setGeneratedExams(prev => [exam, ...prev]);
    setActiveTab('exams');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 在移动端切换标签后自动关闭侧边栏
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={currentRole} onNavigate={setActiveTab} />;
      case 'agent':
        return (
          <ChatAgent
            role={currentRole}
            onGenerateExam={handleGenerateExam}
            messages={chatMessages}
            onMessagesChange={setChatMessages}
          />
        );
      case 'exams':
      case 'practice':
        return (
          <ExamView
            role={currentRole}
            exams={generatedExams}
            onCompleteExam={handleCompleteExam}
          />
        );
      case 'misconceptions':
        return <MisconceptionView role={currentRole} onPracticeMisconception={handlePracticeMisconception} />;
      case 'smart-exam':
        return (
          <SmartExamBuilder
            role={currentRole}
            chatHistory={chatMessages}
            existingExams={generatedExams}
            onSaveExam={handleSaveSmartExam}
          />
        );
      default:
        return <Dashboard role={currentRole} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-xl shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        aria-label="切换菜单"
      >
        {sidebarOpen ? (
          <X className="w-6 h-6 text-slate-700" />
        ) : (
          <Menu className="w-6 h-6 text-slate-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          role={currentRole}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          toggleRole={toggleRole}
          onOpenSettings={onOpenSettings}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 h-full overflow-y-auto bg-white/50 w-full lg:w-auto">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TelecomApp;

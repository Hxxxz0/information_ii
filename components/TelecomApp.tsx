import React, { useState } from 'react';
import { Role, Exam, Question } from '../types';
import { MOCK_QUESTIONS } from '../constants';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { ChatAgent } from './ChatAgent';
import { ExamView } from './ExamView';
import { MisconceptionView } from './MisconceptionView';
import { geminiService } from '../services/geminiService';

const TelecomApp: React.FC = () => {
  // State for navigation and role simulation
  const [currentRole, setCurrentRole] = useState<Role>(Role.STUDENT);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for generated exams (simulating data persistence)
  const [generatedExams, setGeneratedExams] = useState<Exam[]>([]);

  const toggleRole = () => {
    setCurrentRole(prev => prev === Role.STUDENT ? Role.TEACHER : Role.STUDENT);
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
        const questions = await geminiService.generateExamQuestions(topic, 3);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={currentRole} />;
      case 'agent':
        return <ChatAgent role={currentRole} onGenerateExam={handleGenerateExam} />;
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
      default:
        return <Dashboard role={currentRole} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        role={currentRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        toggleRole={toggleRole}
      />
      
      <main className="flex-1 p-8 h-full overflow-y-auto bg-white/50">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TelecomApp;
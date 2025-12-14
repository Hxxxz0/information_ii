import React, { useState } from 'react';
import { Role, Exam, Question, QuestionType } from '../types';
import { MOCK_QUESTIONS } from '../constants';
import { FileText, Clock, BarChart2, Plus, CheckCircle, MoreVertical, ArrowLeft, Play, Check, X, AlertTriangle } from 'lucide-react';

interface ExamViewProps {
  role: Role;
  exams: Exam[];
  onStartExam?: (examId: string) => void;
  onCompleteExam?: (examId: string, score: number) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ role, exams, onStartExam, onCompleteExam }) => {
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const translateQuestionType = (type: QuestionType): string => {
    const typeMap: Record<QuestionType, string> = {
      [QuestionType.CHOICE]: '选择题',
      [QuestionType.FILL_IN]: '填空题',
      [QuestionType.CALCULATION]: '计算题',
      [QuestionType.COMPREHENSIVE]: '综合题',
    };
    return typeMap[type] || type;
  };

  const translateExamStatus = (status: 'draft' | 'published' | 'completed'): string => {
    const statusMap = {
      'draft': '草稿',
      'published': '已发布',
      'completed': '已完成',
    };
    return statusMap[status] || status;
  };

  // Default mock exams if list is empty
  const displayExams = exams.length > 0 ? exams : [
    {
      id: 'mock-1',
      title: '期中考试：信号处理与调制',
      totalScore: 100,
      durationMinutes: 90,
      questions: MOCK_QUESTIONS,
      status: 'published' as const,
    },
    {
      id: 'mock-2',
      title: '测验：信息论基础',
      totalScore: 20,
      durationMinutes: 15,
      questions: MOCK_QUESTIONS.slice(0, 2),
      status: 'completed' as const,
      score: 18
    }
  ];

  const activeExam = displayExams.find(e => e.id === activeExamId);

  const handleStartExam = (examId: string) => {
    setActiveExamId(examId);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    if (onStartExam) onStartExam(examId);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    let calculatedScore = 0;
    const pointsPerQuestion = 100 / activeExam.questions.length;

    activeExam.questions.forEach(q => {
      const userAnswer = answers[q.id];
      // Simple string matching for demo purposes. Real app needs fuzzy match or AI grading.
      const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) calculatedScore += pointsPerQuestion;
    });

    setScore(Math.round(calculatedScore));
    setShowResults(true);
    if (onCompleteExam) onCompleteExam(activeExam.id, Math.round(calculatedScore));
  };

  // -- RENDER: ACTIVE EXAM MODE --
  if (activeExamId && activeExam) {
    return (
      <div className="space-y-4 lg:space-y-6 animate-fade-in max-w-3xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button 
              onClick={() => setActiveExamId(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900 text-base lg:text-lg break-words">{activeExam.title}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3" /> {activeExam.durationMinutes} 分钟
              </p>
            </div>
          </div>
          {!showResults && (
             <button 
               onClick={handleSubmitExam}
               className="bg-blue-600 text-white px-4 lg:px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all w-full sm:w-auto"
             >
               提交考试
             </button>
          )}
          {showResults && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold text-base lg:text-lg text-center sm:text-left">
              分数：{score}/100
            </div>
          )}
        </header>

        <div className="space-y-4 lg:space-y-6 pb-12">
          {activeExam.questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            // Simple grading check
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={q.id} className={`bg-white p-4 lg:p-6 rounded-2xl border shadow-sm transition-all ${
                showResults 
                  ? (isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30') 
                  : 'border-slate-100'
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">问题 {idx + 1} • {translateQuestionType(q.type)}</span>
                  {showResults && (
                    isCorrect 
                      ? <div className="flex items-center gap-1 text-green-600 text-sm font-bold"><Check className="w-4 h-4"/> 正确</div>
                      : <div className="flex items-center gap-1 text-red-600 text-sm font-bold"><X className="w-4 h-4"/> 错误</div>
                  )}
                </div>
                
                <h3 className="text-base lg:text-lg font-medium text-slate-800 mb-4 lg:mb-6 leading-relaxed break-words">{q.content}</h3>
                
                {/* OPTIONS RENDER */}
                {q.type === QuestionType.CHOICE && q.options ? (
                  <div className="space-y-2 lg:space-y-3">
                    {q.options.map((opt) => (
                      <label 
                        key={opt} 
                        className={`flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-xl border cursor-pointer transition-all ${
                          showResults 
                            ? (opt === q.correctAnswer 
                                ? 'bg-green-100 border-green-300 ring-1 ring-green-400' 
                                : (userAnswer === opt ? 'bg-red-100 border-red-300' : 'bg-white border-slate-100 opacity-50'))
                            : (userAnswer === opt 
                                ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-400 shadow-sm' 
                                : 'bg-white border-slate-200 hover:bg-slate-50')
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={q.id} 
                          value={opt} 
                          checked={userAnswer === opt}
                          onChange={() => !showResults && handleAnswerChange(q.id, opt)}
                          disabled={showResults}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          userAnswer === opt ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {userAnswer === opt && <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm lg:text-base text-slate-700 break-words flex-1">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  // TEXT INPUT RENDER
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={userAnswer || ''}
                      onChange={(e) => !showResults && handleAnswerChange(q.id, e.target.value)}
                      disabled={showResults}
                      placeholder="在此输入您的答案..."
                      className={`w-full p-3 lg:p-4 rounded-xl border bg-slate-50 focus:bg-white outline-none transition-all text-sm lg:text-base ${
                        showResults 
                           ? (isCorrect ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700')
                           : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                )}

                {/* EXPLANATION RENDER */}
                {showResults && (
                  <div className="mt-4 lg:mt-6 pt-4 border-t border-slate-200/50 animate-fade-in">
                    <div className="flex items-start gap-2 text-xs lg:text-sm text-slate-600 bg-slate-100 p-3 lg:p-4 rounded-xl">
                       <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                       <div className="min-w-0 flex-1">
                         <span className="font-bold block text-slate-700 mb-1">解释：</span>
                         <span className="break-words">{q.explanation}</span>
                         {!isCorrect && (
                           <div className="mt-2 text-xs font-semibold text-slate-500">
                             正确答案：<span className="text-slate-800 break-words">{q.correctAnswer}</span>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -- RENDER: LIST MODE --
  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
            {role === Role.TEACHER ? '考试管理' : '我的考试与练习'}
          </h2>
          <p className="text-sm lg:text-base text-slate-500 mt-1">
            {role === Role.TEACHER 
              ? '创建、编辑和发布评估。' 
              : '即将到来的测试和过去的结果。'}
          </p>
        </div>
        {role === Role.TEACHER && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-200 transition-all w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            新建考试
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4">
        {displayExams.map((exam) => (
          <div key={exam.id} className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
              <div className={`p-2.5 lg:p-3 rounded-xl flex-shrink-0 ${
                exam.status === 'completed' || exam.score !== undefined ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-base lg:text-lg break-words">{exam.title}</h3>
                <div className="flex flex-wrap gap-2 lg:gap-4 mt-2 text-xs lg:text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" /> {exam.durationMinutes} 分钟
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3 lg:w-4 lg:h-4" /> {exam.totalScore} 分
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" /> {exam.questions.length} 题
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
               {role === Role.STUDENT ? (
                  (exam.status === 'completed' || exam.score !== undefined) ? (
                    <button className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-100">
                      分数：{exam.score ?? 88}/100
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStartExam(exam.id)}
                      className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                    >
                      开始 <Play className="w-4 h-4 fill-current" />
                    </button>
                  )
               ) : (
                 // Teacher Actions
                 <>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                     exam.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                   }`}>
                     {translateExamStatus(exam.status)}
                   </span>
                   <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                     <MoreVertical className="w-5 h-5" />
                   </button>
                 </>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

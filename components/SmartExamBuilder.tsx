import React, { useMemo, useRef, useState } from 'react';
import { aiService } from '../services/aiService';
import { KNOWLEDGE_POINTS } from '../constants';
import { ChatMessage, Difficulty, Exam, Question, QuestionType, Role, SmartQuestionConfig } from '../types';
import { Wand2, Loader2, Download, RefreshCw, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface SmartExamBuilderProps {
  role: Role;
  chatHistory?: ChatMessage[];
  existingExams?: Exam[];
  onSaveExam?: (exam: Exam) => void;
}

type TypeKey = 'choice' | 'fill' | 'calculation' | 'comprehensive';

const typeMap: Record<TypeKey, { label: string; type: QuestionType }> = {
  choice: { label: '选择题', type: QuestionType.CHOICE },
  fill: { label: '填空题', type: QuestionType.FILL_IN },
  calculation: { label: '计算题', type: QuestionType.CALCULATION },
  comprehensive: { label: '综合题', type: QuestionType.COMPREHENSIVE },
};
const typeLabelByValue: Record<QuestionType, string> = {
  [QuestionType.CHOICE]: '选择题',
  [QuestionType.FILL_IN]: '填空题',
  [QuestionType.CALCULATION]: '计算题',
  [QuestionType.COMPREHENSIVE]: '综合题',
};

export const SmartExamBuilder: React.FC<SmartExamBuilderProps> = ({
  role,
  chatHistory = [],
  existingExams = [],
  onSaveExam,
}) => {
  const [config, setConfig] = useState({
    title: role === Role.TEACHER ? '班级智能卷' : '我的智能练习卷',
    topic: '通信系统综合复习',
    durationMinutes: 60,
    difficulty: Difficulty.MEDIUM as Difficulty,
    includeChatContext: true,
    includeHistory: true,
    typeCounts: {
      choice: 3,
      fill: 2,
      calculation: 2,
      comprehensive: 1,
    } as Record<TypeKey, number>,
    knowledgeSelected: KNOWLEDGE_POINTS.slice(0, 3).map(k => k.id),
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const stopFlag = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const totalQuestions = useMemo(
    () => Object.values(config.typeCounts).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [config.typeCounts]
  );

  const recentChat = useMemo(() => {
    if (!config.includeChatContext || !chatHistory.length) return [];
    return chatHistory.slice(-6).map(msg => `${msg.role === 'user' ? '学生' : 'AI'}: ${msg.text}`); // keep brief context
  }, [chatHistory, config.includeChatContext]);

  const avoidTopics = useMemo(() => {
    if (!config.includeHistory || !existingExams.length) return [];
    return existingExams
      .slice(0, 2)
      .flatMap(exam => exam.questions.slice(0, 3).map(q => q.content.slice(0, 80)));
  }, [config.includeHistory, existingExams]);

  const knowledgePool = useMemo(
    () => (config.knowledgeSelected.length ? config.knowledgeSelected : KNOWLEDGE_POINTS.map(k => k.id)),
    [config.knowledgeSelected]
  );

  const pickKnowledgePoints = (index: number) => {
    if (!knowledgePool.length) return [];
    const picked = knowledgePool[index % knowledgePool.length];
    return [picked];
  };

  const appendLog = (entry: string) => setLog(prev => [...prev.slice(-5), entry]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (totalQuestions === 0) {
      appendLog('请至少选择 1 道题目数量');
      return;
    }

    setIsGenerating(true);
    stopFlag.current = false;
    setQuestions([]);
    setProgress(0);
    setLog([]);

    const tasks: QuestionType[] = [];
    (Object.keys(config.typeCounts) as TypeKey[]).forEach(key => {
      const count = Number(config.typeCounts[key]) || 0;
      for (let i = 0; i < count; i++) {
        tasks.push(typeMap[key].type);
      }
    });

    for (let i = 0; i < tasks.length; i++) {
      if (stopFlag.current) break;
      const targetType = tasks[i];
      appendLog(`正在生成第 ${i + 1} / ${tasks.length} 题 (${typeLabelByValue[targetType]})`);

      const payload: SmartQuestionConfig = {
        topic: config.topic,
        knowledgePoints: pickKnowledgePoints(i),
        type: targetType,
        difficulty: config.difficulty,
        chatHistory: recentChat,
        avoidTopics,
      };

      const question = await aiService.generateQuestion(payload);
      if (question) {
        const materialized: Question = {
          ...question,
          id: question.id || `smart-${Date.now()}-${i}`,
          options: question.options || [],
          knowledgePoints: question.knowledgePoints || payload.knowledgePoints,
        };
        setQuestions(prev => [...prev, materialized]);
      } else {
        appendLog(`第 ${i + 1} 题生成失败，已跳过`);
      }
      setProgress(Math.round(((i + 1) / tasks.length) * 100));
    }

    setIsGenerating(false);
  };

  const handleStop = () => {
    stopFlag.current = true;
    setIsGenerating(false);
    appendLog('已停止生成');
  };

  const handleSaveExam = () => {
    if (!onSaveExam || !questions.length) return;
    const exam: Exam = {
      id: `smart-${Date.now()}`,
      title: config.title || '智能组卷',
      totalScore: 100,
      durationMinutes: config.durationMinutes || totalQuestions * 5,
      questions,
      status: 'draft',
    };
    onSaveExam(exam);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExportPDF = () => {
    if (!previewRef.current) return;
    const printWindow = window.open('', 'PRINT', 'height=900,width=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${config.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 12px; }
            h3 { margin: 12px 0 4px; }
            ol { padding-left: 18px; }
            .meta { color: #475569; font-size: 12px; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          ${previewRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const toggleKnowledge = (id: string) => {
    setConfig(prev => ({
      ...prev,
      knowledgeSelected: prev.knowledgeSelected.includes(id)
        ? prev.knowledgeSelected.filter(k => k !== id)
        : [...prev.knowledgeSelected, id],
    }));
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Smart Exam Builder</p>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              智能组卷
            </h2>
            <p className="text-sm text-slate-500">
              结合对话上下文与历史练习，逐题生成个性化试卷，并支持导出 PDF。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={!questions.length}
              className={`px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border ${
                questions.length ? 'text-blue-600 border-blue-200 hover:bg-blue-50' : 'text-slate-300 border-slate-200'
              }`}
            >
              <Download className="w-4 h-4" /> 导出PDF
            </button>
            <button
              onClick={handleSaveExam}
              disabled={!questions.length || !onSaveExam}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                questions.length ? 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              保存到我的考试
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧配置 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">卷面信息</label>
            <input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="智能卷标题"
            />
            <input
              value={config.topic}
              onChange={(e) => setConfig({ ...config, topic: e.target.value })}
              className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="出题主题（如：MIMO + OFDM 综合）"
            />
            <div className="flex items-center gap-3 mt-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <input
                type="number"
                min={20}
                value={config.durationMinutes}
                onChange={(e) => setConfig({ ...config, durationMinutes: Number(e.target.value) })}
                className="w-24 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">分钟</span>
              <span className="text-xs text-slate-400">总题量：{totalQuestions} 题</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">题型与数量</label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {(Object.keys(typeMap) as TypeKey[]).map(key => (
                <div key={key} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{typeMap[key].label}</span>
                  <input
                    type="number"
                    min={0}
                    value={config.typeCounts[key]}
                    onChange={(e) => setConfig({
                      ...config,
                      typeCounts: { ...config.typeCounts, [key]: Number(e.target.value) },
                    })}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">难度</label>
            <div className="flex gap-2 mt-2">
              {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.EXPERT].map((d) => (
                <button
                  key={d}
                  onClick={() => setConfig({ ...config, difficulty: d })}
                  className={`px-3 py-2 rounded-xl text-sm font-bold border ${
                    config.difficulty === d ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">知识点</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {KNOWLEDGE_POINTS.map(kp => (
                <button
                  key={kp.id}
                  onClick={() => toggleKnowledge(kp.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                    config.knowledgeSelected.includes(kp.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {kp.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={config.includeChatContext}
                onChange={(e) => setConfig({ ...config, includeChatContext: e.target.checked })}
                className="w-4 h-4"
              />
              引入近期对话
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={config.includeHistory}
                onChange={(e) => setConfig({ ...config, includeHistory: e.target.checked })}
                className="w-4 h-4"
              />
              避免重复近期练习
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 disabled:opacity-60"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {isGenerating ? '生成中...' : '开始生成'}
            </button>
            <button
              onClick={handleStop}
              disabled={!isGenerating}
              className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2 border border-slate-200 disabled:opacity-60"
            >
              <RefreshCw className="w-4 h-4" />
              停止
            </button>
          </div>

          {log.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200">
              {log.map((l, idx) => (
                <p key={idx} className="truncate">{l}</p>
              ))}
            </div>
          )}
        </div>

        {/* 右侧预览 */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                试卷预览
              </h3>
              <p className="text-xs text-slate-500">已生成 {questions.length} / {totalQuestions} 题</p>
            </div>
            <div className="text-xs text-slate-500">
              进度：<span className="font-bold text-slate-800">{progress}%</span>
            </div>
          </div>

          <div className="flex-1 bg-slate-50/70 rounded-xl p-4 overflow-y-auto custom-scrollbar" ref={previewRef}>
            <h1 className="text-xl font-black text-slate-900 mb-1">{config.title}</h1>
            <p className="meta">主题：{config.topic} ｜ 难度：{config.difficulty} ｜ 用时：{config.durationMinutes} 分钟</p>
            {questions.length === 0 ? (
              <div className="text-slate-400 text-sm py-8 text-center">
                {isGenerating ? '正在生成题目...' : '点击开始生成，题目将实时出现在这里'}
              </div>
            ) : (
              <ol className="space-y-4 list-decimal list-inside">
                {questions.map((q, idx) => (
                  <li key={q.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">{q.type}</span>
                      <span className="text-xs text-slate-400">难度：{q.difficulty}</span>
                    </div>
                    <p className="font-bold text-slate-900 mb-2">{idx + 1}. {q.content}</p>
                    {q.options && q.options.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-2">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-emerald-700 font-bold mb-1">答案：{q.correctAnswer}</p>
                    <p className="text-xs text-slate-500">解析：{q.explanation}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {saved && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              已保存到“我的考试”。
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

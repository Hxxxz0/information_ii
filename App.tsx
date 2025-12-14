import React, { useState, useEffect } from 'react';
import { MenuBar } from './components/OS/MenuBar';
import { Dock } from './components/OS/Dock';
import { Window } from './components/OS/Window';
import TelecomApp from './components/TelecomApp';
import { BeamformingLab } from './components/BeamformingLab';
import { PlanApp } from './components/PlanApp';
import { TrainingApp } from './components/TrainingApp';
import { EnergyApp } from './components/EnergyApp';
import { MoodApp } from './components/MoodApp';
import { MessageBoardApp } from './components/MessageBoardApp';
import { OceanApp } from './components/OceanApp';
import { SettingsApp } from './components/SettingsApp';
import { GuideApp } from './components/GuideApp';
import { SearchApp } from './components/SearchApp';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArrowRight, CheckCircle2, Clock, Calendar, GraduationCap, PenTool, BarChart3, Star, Wifi, Wand2 } from 'lucide-react';
import { aiService, AIProvider } from './services/aiService';
import { SmartExamBuilder } from './components/SmartExamBuilder';
import { Role } from './types';

const App: React.FC = () => {
  // 应用启动时从 localStorage 读取 AI 提供商设置
  useEffect(() => {
    try {
      const savedProvider = localStorage.getItem('aiProvider') as AIProvider;
      if (savedProvider) {
        aiService.setProvider(savedProvider);
        console.log('🚀 应用启动 - AI 提供商已设置为:', savedProvider);
      } else {
        console.log('🚀 应用启动 - 使用默认 AI 提供商: gemini');
      }
    } catch (error) {
      console.error('读取 AI 提供商设置失败:', error);
    }
  }, []);

  const [appState, setAppState] = useState({
    telecomOpen: false,
    signalLabOpen: false,
    planOpen: false,
    trainingOpen: false,
    energyOpen: false,
    moodOpen: false,
    messageBoardOpen: false,
    oceanOpen: false,
    settingsOpen: false,
    guideOpen: false,
    searchOpen: false,
    smartExamOpen: false,
  });
  const [telecomInitialTab, setTelecomInitialTab] = useState<string | undefined>(undefined);
  type PlanCardItem = {
    title: string;
    time: string;
    tag: string;
    tone: 'blue' | 'purple' | 'amber';
  };
  type PlanForm = {
    goal: string;
    timeframe: string;
    daily: string;
    focus: string;
  };
  const defaultPlanItems: PlanCardItem[] = [
    { title: '14天正念计划', time: '16:50', tag: '系统提醒', tone: 'blue' },
    { title: '情绪管理计划', time: '10:30', tag: '自定义通知', tone: 'purple' },
  ];
  const [planItems, setPlanItems] = useState<PlanCardItem[]>(defaultPlanItems);
  const [planLoading, setPlanLoading] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState<PlanForm>({
    goal: '备考本周小测',
    timeframe: '本周',
    daily: '30 分钟/天',
    focus: 'OFDM + MIMO',
  });

  const openTelecomApp = (initialTab?: string) => {
    if (initialTab) {
      setTelecomInitialTab(initialTab);
    }
    setAppState(prev => ({ ...prev, telecomOpen: true }));
  };
  const closeTelecomApp = () => {
    setAppState(prev => ({ ...prev, telecomOpen: false }));
    setTelecomInitialTab(undefined);
  };
  
  const openSettingsWindow = () => setAppState(prev => ({ ...prev, settingsOpen: true }));
  const closeSettingsWindow = () => setAppState(prev => ({ ...prev, settingsOpen: false }));
  
  const openGuideWindow = () => setAppState(prev => ({ ...prev, guideOpen: true }));
  const closeGuideWindow = () => setAppState(prev => ({ ...prev, guideOpen: false }));
  
  const openSearchWindow = () => setAppState(prev => ({ ...prev, searchOpen: true }));
  const closeSearchWindow = () => setAppState(prev => ({ ...prev, searchOpen: false }));

  const openSignalLab = () => setAppState(prev => ({ ...prev, signalLabOpen: true }));
  const closeSignalLab = () => setAppState(prev => ({ ...prev, signalLabOpen: false }));

  const openSmartExam = () => setAppState(prev => ({ ...prev, smartExamOpen: true }));
  const closeSmartExam = () => setAppState(prev => ({ ...prev, smartExamOpen: false }));

  const toneStyles: Record<PlanCardItem['tone'], { icon: string; badge: string }> = {
    blue: { icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-50 text-blue-600' },
    purple: { icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-50 text-purple-600' },
    amber: { icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-50 text-amber-600' },
  };

  const handleGeneratePlan = async (form: PlanForm) => {
    if (planLoading) return;
    setPlanLoading(true);
    try {
      const existingTitles = planItems.map(p => p.title).slice(0, 5).join('；') || '无';
      const prompt = `你是学习教练，请生成 ${form.timeframe} 的 3-4 条学习计划，面向电信专业学生。
目标：${form.goal}
重点：${form.focus || '通信基础'}
每日可用时长：${form.daily || '30 分钟'}
避免与这些计划重复：${existingTitles}
输出要求：只返回 JSON 数组，每项包含：
- title: 任务标题（<=20字）
- time: 建议时间或时间段（如 "16:50" 或 "晚间30分钟"）
- tag: 提醒或类型（如 "系统提醒"、"复习"、"练习"）
不要多余说明，不要 markdown 代码块。`;
      const response = await aiService.sendMessage(prompt);
      const cleaned = response.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      let parsed: any[] = [];
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error('Plan parse failed, fallback to default', parseErr, cleaned);
        parsed = [];
      }
      const tones: PlanCardItem['tone'][] = ['blue', 'purple', 'amber'];
      const mapped = parsed.slice(0, 4).map((item, idx) => ({
        title: item.title || `任务 ${idx + 1}`,
        time: item.time || item.dueTime || '待定',
        tag: item.tag || 'AI生成',
        tone: tones[idx % tones.length],
      }));
      if (mapped.length) {
        setPlanItems(mapped);
      } else {
        setPlanItems(defaultPlanItems);
      }
    } catch (error) {
      console.error('Generate plan failed', error);
      setPlanItems(defaultPlanItems);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleDockClick = (appId: string) => {
    switch (appId) {
      case 'plan':
        setAppState(prev => ({ ...prev, planOpen: !prev.planOpen }));
        break;
      case 'training':
        setAppState(prev => ({ ...prev, trainingOpen: !prev.trainingOpen }));
        break;
      case 'energy':
        setAppState(prev => ({ ...prev, energyOpen: !prev.energyOpen }));
        break;
      case 'mood':
        setAppState(prev => ({ ...prev, moodOpen: !prev.moodOpen }));
        break;
      case 'message':
        setAppState(prev => ({ ...prev, messageBoardOpen: !prev.messageBoardOpen }));
        break;
      case 'ocean':
        setAppState(prev => ({ ...prev, oceanOpen: !prev.oceanOpen }));
        break;
      case 'home':
        // 关闭所有窗口
        setAppState({
          telecomOpen: false,
          signalLabOpen: false,
          planOpen: false,
          trainingOpen: false,
          energyOpen: false,
          moodOpen: false,
          messageBoardOpen: false,
          oceanOpen: false,
          settingsOpen: false,
          guideOpen: false,
          searchOpen: false,
        });
        setTelecomInitialTab(undefined);
        break;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans text-slate-900 relative">
      {/* Top Bar */}
      <MenuBar 
        onOpenGuide={openGuideWindow}
        onOpenMessages={() => setAppState(prev => ({ ...prev, messageBoardOpen: true }))}
        onOpenProfile={openSettingsWindow}
        onOpenSearch={openSearchWindow}
      />

      {/* Main Content Grid - Responsive: Stacked on Mobile, 12-Col Grid on Desktop */}
      <div className="absolute inset-0 z-0 overflow-y-auto overflow-x-hidden pointer-events-auto scroll-smooth
        pt-24 pb-32 px-4 gap-8 flex flex-col
        lg:pt-28 lg:pb-32 lg:px-12 lg:grid lg:grid-cols-12 lg:gap-8 lg:block"
      >

        {/* LEFT COLUMN: Avatar & Pet */}
        <div className="flex flex-col justify-end items-center relative
           lg:col-span-3 lg:h-full lg:justify-end"
        >
          {/* Avatar Container */}
          <div className="relative w-full flex justify-center 
             h-64 mb-4
             lg:h-[60%] lg:mb-10"
          >
            <img
              src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1709123456~exp=1709124056~hmac=123"
              alt="3D 头像"
              className="h-full object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
            />

            {/* Name Tag */}
            <div className="absolute bottom-4 lg:bottom-10 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 transform scale-90 lg:scale-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-bold text-slate-700">学生 亚历克斯</span>
            </div>
          </div>

          {/* Pet Dog */}
          <div className="relative w-24 h-24 transform translate-x-4
             lg:absolute lg:bottom-0 lg:right-0 lg:w-32 lg:h-32"
          >
            <img
              src="https://img.freepik.com/free-psd/3d-rendering-shiba-inu-dog_23-2149953922.jpg"
              alt="宠物狗"
              className="w-full h-full object-contain drop-shadow-xl hover:rotate-6 transition-transform cursor-pointer"
            />
          </div>
        </div>

        {/* CENTER COLUMN: Schedule/Treasure */}
        <div className="flex flex-col w-full
          lg:col-span-5 lg:h-full"
        >
          <div className="glass-panel w-full rounded-[2.5rem] p-6 lg:p-8 flex flex-col relative overflow-hidden h-[400px] lg:h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">.. 今日宝藏 ..</h2>
                <h3 className="text-2xl font-black text-slate-800">我的学习计划</h3>
              </div>
              <button
                onClick={() => setPlanModalOpen(true)}
                disabled={planLoading}
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                  planLoading
                    ? 'bg-slate-200 text-slate-400'
                    : 'bg-white/70 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {planLoading ? '生成中...' : 'AI 生成计划'}
              </button>
            </div>

            {/* Timeline Items */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {planLoading && (
                <div className="bg-white/70 p-4 rounded-2xl border border-slate-100 animate-pulse text-slate-400 text-sm">
                  正在生成个性化学习计划...
                </div>
              )}
              {planItems.map((item, idx) => {
                const tone = toneStyles[item.tone] || toneStyles.blue;
                const Icon = item.tone === 'purple' ? Star : Calendar;
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    className="bg-white/80 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${tone.icon} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1">
                          <Clock className="w-3 h-3" /> {item.time}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${tone.badge}`}>
                      {item.tag}
                    </span>
                  </div>
                );
              })}
              {planItems.length === 0 && !planLoading && (
                <div className="border-2 border-dashed border-slate-300/50 rounded-2xl flex-1 flex items-center justify-center text-slate-400 font-medium text-sm min-h-[100px]">
                  暂无计划，点击“AI 生成计划”开始
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Cards */}
        <div className="flex flex-col gap-6 w-full
          lg:col-span-4 lg:h-full lg:mb-0 mb-4"
        >

          {/* BIG CARD: Homework Companion */}
          <div
            onClick={openTelecomApp}
            className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200 cursor-pointer transform hover:scale-[1.02] transition-all group shrink-0"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-black tracking-tight leading-tight">
                  作业<br />助手
                </h2>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <PenTool className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-blue-100 font-medium mb-8 max-w-[80%]">
                高效专注，分析误解，生成练习考试。
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg group-hover:shadow-xl transition-all">
                开始学习 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Grid - Replaced middle card with Signal Lab */}
          <div className="flex-1 grid grid-cols-2 gap-4 shrink-0">
            {/* Card 1 */}
            <div 
              onClick={() => openTelecomApp('agent')}
              className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/90 cursor-pointer transition-colors group min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">魔法<br />盒子</h4>
                <p className="text-[10px] text-slate-500 mt-1">专家导师</p>
              </div>
            </div>

            {/* Card 2: SIGNAL LAB (NEW) */}
            <div
              onClick={openSignalLab}
              className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-slate-900 hover:text-white cursor-pointer transition-all group relative overflow-hidden min-h-[160px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/0 to-cyan-900/0 group-hover:to-cyan-900/50 transition-all"></div>
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition-all z-10">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="z-10">
                <h4 className="font-bold text-slate-800 group-hover:text-cyan-200 leading-tight transition-colors">Signal<br />Lab</h4>
                <p className="text-[10px] text-slate-500 group-hover:text-cyan-400 mt-1 transition-colors">波束成形模拟</p>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => openTelecomApp('exams')}
              className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/90 cursor-pointer transition-colors group min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">复习<br />小屋</h4>
                <p className="text-[10px] text-slate-500 mt-1">自我检查</p>
              </div>
            </div>

            {/* Card 4: Smart Exam Builder */}
            <div
              onClick={openSmartExam}
              className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/90 cursor-pointer transition-colors group min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">智能<br />组卷</h4>
                <p className="text-[10px] text-slate-500 mt-1">个性化试卷</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dock */}
      <Dock
        onAppClick={handleDockClick}
        openApps={[
          ...(appState.telecomOpen ? ['telecom'] : []),
          ...(appState.signalLabOpen ? ['lab'] : []),
          ...(appState.planOpen ? ['plan'] : []),
          ...(appState.trainingOpen ? ['training'] : []),
          ...(appState.energyOpen ? ['energy'] : []),
          ...(appState.moodOpen ? ['mood'] : []),
          ...(appState.messageBoardOpen ? ['message'] : []),
          ...(appState.oceanOpen ? ['ocean'] : []),
        ]}
      />

      {/* PLAN MODAL */}
      {planModalOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold text-slate-400">AI 生成计划</p>
                <h3 className="text-xl font-black text-slate-900">个性化学习计划</h3>
              </div>
              <button
                onClick={() => setPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                关闭
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">目标</label>
                <input
                  value={planForm.goal}
                  onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：备考周五通信原理小测"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">时间范围</label>
                  <input
                    value={planForm.timeframe}
                    onChange={(e) => setPlanForm({ ...planForm, timeframe: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="本周 / 3天 / 今日"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">每日时长</label>
                  <input
                    value={planForm.daily}
                    onChange={(e) => setPlanForm({ ...planForm, daily: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30 分钟/天"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">重点/知识点</label>
                <input
                  value={planForm.focus}
                  onChange={(e) => setPlanForm({ ...planForm, focus: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="如：OFDM 循环前缀 + MIMO 基础"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setPlanModalOpen(false);
                  handleGeneratePlan(planForm);
                }}
                disabled={planLoading}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {planLoading ? '生成中...' : '生成计划'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WINDOW 1: Telecom App */}
      <Window
        title="电信AI"
        isOpen={appState.telecomOpen}
        onClose={closeTelecomApp}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <TelecomApp initialTab={telecomInitialTab} onOpenSettings={openSettingsWindow} />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 2: Signal Lab (Immersive Mode) */}
      <Window
        title="相控阵模拟"
        isOpen={appState.signalLabOpen}
        onClose={closeSignalLab}
        onMinimize={() => { }}
        variant="immersive"
      >
        <ErrorBoundary>
          <BeamformingLab />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 3: Plan App */}
      <Window
        title="学习计划"
        isOpen={appState.planOpen}
        onClose={() => setAppState(prev => ({ ...prev, planOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <PlanApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 4: Training App */}
      <Window
        title="学习训练"
        isOpen={appState.trainingOpen}
        onClose={() => setAppState(prev => ({ ...prev, trainingOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <TrainingApp onStartTraining={() => openTelecomApp('practice')} />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 5: Energy App */}
      <Window
        title="能量中心"
        isOpen={appState.energyOpen}
        onClose={() => setAppState(prev => ({ ...prev, energyOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <EnergyApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 6: Mood App */}
      <Window
        title="心情记录"
        isOpen={appState.moodOpen}
        onClose={() => setAppState(prev => ({ ...prev, moodOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <MoodApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 7: Message Board App */}
      <Window
        title="留言板"
        isOpen={appState.messageBoardOpen}
        onClose={() => setAppState(prev => ({ ...prev, messageBoardOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <MessageBoardApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 8: Ocean App */}
      <Window
        title="放松海洋"
        isOpen={appState.oceanOpen}
        onClose={() => setAppState(prev => ({ ...prev, oceanOpen: false }))}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <OceanApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 9: Settings App */}
      <Window
        title="设置"
        isOpen={appState.settingsOpen}
        onClose={closeSettingsWindow}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <SettingsApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 10: Guide App */}
      <Window
        title="使用指南"
        isOpen={appState.guideOpen}
        onClose={closeGuideWindow}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <GuideApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 11: Search App */}
      <Window
        title="搜索"
        isOpen={appState.searchOpen}
        onClose={closeSearchWindow}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <SearchApp />
        </ErrorBoundary>
      </Window>

      {/* WINDOW 12: Smart Exam Builder */}
      <Window
        title="智能组卷"
        isOpen={appState.smartExamOpen}
        onClose={closeSmartExam}
        onMinimize={() => { }}
      >
        <ErrorBoundary>
          <SmartExamBuilder 
            role={Role.STUDENT}
            chatHistory={[]}
            existingExams={[]}
            onSaveExam={(exam) => {
              console.log('保存试卷:', exam);
              // 可以在这里添加保存逻辑，比如打开 TelecomApp 的 exams 标签页
            }}
          />
        </ErrorBoundary>
      </Window>

    </div>
  );
};

export default App;

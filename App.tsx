import React, { useState } from 'react';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { ArrowRight, CheckCircle2, Clock, Calendar, GraduationCap, PenTool, BarChart3, Star, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState({
    telecomOpen: false,
    signalLabOpen: false,
    planOpen: false,
    trainingOpen: false,
    energyOpen: false,
    moodOpen: false,
    messageBoardOpen: false,
    oceanOpen: false,
  });

  const openTelecomApp = () => setAppState(prev => ({ ...prev, telecomOpen: true }));
  const closeTelecomApp = () => setAppState(prev => ({ ...prev, telecomOpen: false }));
  
  const openSignalLab = () => setAppState(prev => ({ ...prev, signalLabOpen: true }));
  const closeSignalLab = () => setAppState(prev => ({ ...prev, signalLabOpen: false }));

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
        });
        break;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans text-slate-900 relative">
       {/* Top Bar */}
      <MenuBar />

      {/* Main Desktop Content Grid */}
      <div className="absolute inset-0 pt-28 pb-32 px-12 z-0 grid grid-cols-12 gap-8 pointer-events-none">
        
        {/* LEFT COLUMN: Avatar & Pet */}
        <div className="col-span-3 flex flex-col justify-end items-center relative pointer-events-auto">
           {/* Placeholder for 3D Girl Avatar */}
           <div className="relative w-full h-[60%] mb-10 flex justify-center">
             <img 
               src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1709123456~exp=1709124056~hmac=123" 
               alt="3D 头像"
               className="h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
               style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
             />
             
             {/* Name Tag */}
             <div className="absolute bottom-10 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-bold text-slate-700">学生 亚历克斯</span>
             </div>
           </div>
           
           {/* Pet Dog */}
           <div className="absolute bottom-0 right-0 w-32 h-32 transform translate-x-4">
              <img 
               src="https://img.freepik.com/free-psd/3d-rendering-shiba-inu-dog_23-2149953922.jpg" 
               alt="宠物狗"
               className="w-full h-full object-contain drop-shadow-xl hover:rotate-6 transition-transform cursor-pointer"
             />
           </div>
        </div>

        {/* CENTER COLUMN: Schedule/Treasure */}
        <div className="col-span-5 flex flex-col pointer-events-auto">
          <div className="glass-panel w-full h-full rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">.. 今日宝藏 ..</h2>
                 <h3 className="text-2xl font-black text-slate-800">我的学习计划</h3>
               </div>
               <button className="text-xs font-bold text-slate-500 bg-white/50 px-3 py-1 rounded-full">家庭任务</button>
             </div>

             {/* Timeline Items */}
             <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {/* Item 1 */}
                <div className="bg-white/80 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">14天正念计划</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1">
                          <Clock className="w-3 h-3" /> 16:50
                        </div>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">系统提醒</button>
                </div>

                {/* Item 2 */}
                <div className="bg-white/80 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Star className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">情绪管理计划</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1">
                          <Clock className="w-3 h-3" /> 10:30
                        </div>
                      </div>
                   </div>
                   <button className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">自定义通知</button>
                </div>
                
                 {/* Empty State / Filler */}
                 <div className="border-2 border-dashed border-slate-300/50 rounded-2xl flex-1 flex items-center justify-center text-slate-400 font-medium text-sm">
                    今天没有更多任务了！
                 </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Cards */}
        <div className="col-span-4 flex flex-col gap-6 pointer-events-auto">
          
          {/* BIG CARD: Homework Companion */}
          <div 
             onClick={openTelecomApp}
             className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200 cursor-pointer transform hover:scale-[1.02] transition-all group"
          >
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                 <h2 className="text-3xl font-black tracking-tight leading-tight">
                   作业<br/>助手
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
          <div className="flex-1 grid grid-cols-2 gap-4">
             {/* Card 1 */}
             <div className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/90 cursor-pointer transition-colors group">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                   <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 leading-tight">魔法<br/>盒子</h4>
                   <p className="text-[10px] text-slate-500 mt-1">专家导师</p>
                </div>
             </div>

              {/* Card 2: SIGNAL LAB (NEW) */}
             <div 
               onClick={openSignalLab}
               className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-slate-900 hover:text-white cursor-pointer transition-all group relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/0 to-cyan-900/0 group-hover:to-cyan-900/50 transition-all"></div>
                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 transition-all z-10">
                   <Wifi className="w-5 h-5" />
                </div>
                <div className="z-10">
                   <h4 className="font-bold text-slate-800 group-hover:text-cyan-200 leading-tight transition-colors">Signal<br/>Lab</h4>
                   <p className="text-[10px] text-slate-500 group-hover:text-cyan-400 mt-1 transition-colors">波束成形模拟</p>
                </div>
             </div>

              {/* Card 3 */}
             <div className="glass-card rounded-[2rem] p-5 flex flex-col justify-between hover:bg-white/90 cursor-pointer transition-colors group">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                   <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 leading-tight">复习<br/>小屋</h4>
                   <p className="text-[10px] text-slate-500 mt-1">自我检查</p>
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

      {/* WINDOW 1: Telecom App */}
      <Window 
          title="电信AI" 
          isOpen={appState.telecomOpen} 
          onClose={closeTelecomApp}
          onMinimize={() => {}}
        >
          <ErrorBoundary>
            <TelecomApp />
          </ErrorBoundary>
      </Window>

      {/* WINDOW 2: Signal Lab (Immersive Mode) */}
      <Window 
          title="相控阵模拟" 
          isOpen={appState.signalLabOpen} 
          onClose={closeSignalLab}
          onMinimize={() => {}}
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
          onMinimize={() => {}}
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
          onMinimize={() => {}}
        >
          <ErrorBoundary>
            <TrainingApp />
          </ErrorBoundary>
      </Window>

      {/* WINDOW 5: Energy App */}
      <Window 
          title="能量中心" 
          isOpen={appState.energyOpen} 
          onClose={() => setAppState(prev => ({ ...prev, energyOpen: false }))}
          onMinimize={() => {}}
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
          onMinimize={() => {}}
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
          onMinimize={() => {}}
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
          onMinimize={() => {}}
        >
          <ErrorBoundary>
            <OceanApp />
          </ErrorBoundary>
      </Window>

    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Check, 
  Sparkles, 
  Settings, 
  Plus
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'chat' | 'quizzes' | 'notes' | 'planner' | 'progress'>('dashboard');
  
  // Interactive mini robot state
  const [miniRobotText, setMiniRobotText] = useState("Ask me anything!");
  const [miniRobotBouncing, setMiniRobotBouncing] = useState(false);

  const handleMiniRobotClick = () => {
    setMiniRobotBouncing(true);
    const tips = [
      "You got this! ⭐",
      "Quiz ready in 5 mins! 📝",
      "7-day streak active! 🔥",
      "Review Mitosis today! 💡",
      "Ready to solve problems? 🚀"
    ];
    setMiniRobotText(tips[Math.floor(Math.random() * tips.length)]);
    setTimeout(() => setMiniRobotBouncing(false), 700);
  };

  // Interactive goals
  const [goals, setGoals] = useState([
    { id: 1, title: 'Math - Chapter 4', tag: '1/3', completed: true },
    { id: 2, title: 'Web Development - Practice', hasProgress: true, completed: true },
    { id: 3, title: 'Read 30 mins', completed: true }
  ]);

  const toggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progressPercent = Math.round((completedCount / goals.length) * 75);

  return (
    <section id="how-it-works" className="landing-section relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="mb-14">
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-3 block animate-pulse">
              ✦ HOW IT WORKS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your Journey to <br />
              Success in 3 Simple Steps
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: 3 Steps + CTA Button */}
          <div className="lg:col-span-5 flex flex-col space-y-6 relative">
            {/* Glowing connecting guideline line between steps */}
            <div className="absolute left-[26px] top-6 bottom-16 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 -z-1 opacity-40" />

            {/* Step 1 */}
            <ScrollReveal animation="fade-right" delay={100}>
              <div 
                onClick={() => setActiveStep(1)}
                className={`flex items-start gap-5 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group ${
                  activeStep === 1 
                    ? 'bg-cyan-500/15 border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.3)] transform translate-x-1.5' 
                    : 'hover:bg-slate-900/50 border border-transparent hover:translate-x-1'
                }`}
              >
                <div className={`relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-heading text-lg font-bold text-white transition-all duration-300 ${
                  activeStep === 1
                    ? 'bg-cyan-500 shadow-[0_0_24px_rgba(6,182,212,0.9)] scale-110'
                    : 'bg-[#05112e] border border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                }`}>
                  {activeStep === 1 && (
                    <span className="absolute inset-0 rounded-full border border-cyan-300 animate-ping opacity-60" />
                  )}
                  1
                </div>
                <div className="pt-0.5">
                  <h3 className={`font-heading text-xl font-bold mb-1.5 transition-colors ${
                    activeStep === 1 ? 'text-cyan-300' : 'text-white'
                  }`}>
                    Choose Your Goal
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Set your learning goals and pick your subjects.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal animation="fade-right" delay={200}>
              <div 
                onClick={() => setActiveStep(2)}
                className={`flex items-start gap-5 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group ${
                  activeStep === 2 
                    ? 'bg-blue-500/15 border border-blue-400/60 shadow-[0_0_30px_rgba(59,130,246,0.3)] transform translate-x-1.5' 
                    : 'hover:bg-slate-900/50 border border-transparent hover:translate-x-1'
                }`}
              >
                <div className={`relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-heading text-lg font-bold text-white transition-all duration-300 ${
                  activeStep === 2
                    ? 'bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.9)] scale-110'
                    : 'bg-[#05112e] border border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                }`}>
                  {activeStep === 2 && (
                    <span className="absolute inset-0 rounded-full border border-blue-300 animate-ping opacity-60" />
                  )}
                  2
                </div>
                <div className="pt-0.5">
                  <h3 className={`font-heading text-xl font-bold mb-1.5 transition-colors ${
                    activeStep === 2 ? 'text-blue-300' : 'text-white'
                  }`}>
                    Learn with AI
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ask questions, get explanations, create quizzes and more.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal animation="fade-right" delay={300}>
              <div 
                onClick={() => setActiveStep(3)}
                className={`flex items-start gap-5 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative group ${
                  activeStep === 3 
                    ? 'bg-indigo-500/15 border border-indigo-400/60 shadow-[0_0_30px_rgba(99,102,241,0.3)] transform translate-x-1.5' 
                    : 'hover:bg-slate-900/50 border border-transparent hover:translate-x-1'
                }`}
              >
                <div className={`relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-heading text-lg font-bold text-white transition-all duration-300 ${
                  activeStep === 3
                    ? 'bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.9)] scale-110'
                    : 'bg-[#05112e] border border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                }`}>
                  {activeStep === 3 && (
                    <span className="absolute inset-0 rounded-full border border-indigo-300 animate-ping opacity-60" />
                  )}
                  3
                </div>
                <div className="pt-0.5">
                  <h3 className={`font-heading text-xl font-bold mb-1.5 transition-colors ${
                    activeStep === 3 ? 'text-indigo-300' : 'text-white'
                  }`}>
                    Track & Achieve
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Monitor your progress and reach your goals faster.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Interactive Step Guide Tip */}
            <ScrollReveal animation="fade-right" delay={400}>
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-300 bg-[#040e24]/80 p-3 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block flex-shrink-0" />
                <span>Step <strong className="text-cyan-300">{activeStep} of 3 selected:</strong> Click any step above to see dynamic changes</span>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: StudyBuddy Dashboard Showcase Window */}
          <ScrollReveal animation="fade-left" delay={200} className="lg:col-span-7 relative">
            {/* 3D Faceted Violet Crystal Shard jutting out behind top-right of Dashboard */}
            <div className="absolute -top-16 -right-8 sm:-right-10 w-44 sm:w-56 h-56 pointer-events-none z-0 opacity-90 drop-shadow-[0_12px_35px_rgba(147,51,234,0.7)] animate-card-float">
              {/* Shimmer reflection sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-200/35 to-transparent animate-crystal-sweep" />
              </div>
              <svg viewBox="0 0 220 240" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="hw-crystal-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#3b0764" />
                  </linearGradient>
                  <linearGradient id="hw-crystal-2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e9d5ff" />
                    <stop offset="40%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#581c87" />
                  </linearGradient>
                  <linearGradient id="hw-crystal-3" x1="0%" y1="50%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7e22ce" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
                {/* Crystal facet 1: Central Angle */}
                <polygon points="120,10 190,60 150,170 50,130" fill="url(#hw-crystal-1)" />
                {/* Crystal facet 2: Top Refraction */}
                <polygon points="120,10 50,40 50,130" fill="url(#hw-crystal-2)" />
                {/* Crystal facet 3: Right Angle */}
                <polygon points="190,60 215,120 150,170" fill="url(#hw-crystal-3)" />
                {/* Crisp Specular Edges */}
                <line x1="120" y1="10" x2="150" y2="170" stroke="#f3e8ff" strokeWidth="1.8" strokeOpacity="0.8" />
                <line x1="120" y1="10" x2="50" y2="130" stroke="#e9d5ff" strokeWidth="1.5" strokeOpacity="0.75" />
                <line x1="190" y1="60" x2="150" y2="170" stroke="#d8b4fe" strokeWidth="1.5" strokeOpacity="0.7" />
                <line x1="120" y1="10" x2="50" y2="40" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />
              </svg>
            </div>

            {/* Glowing Cyan/Blue Ribbon Wave behind Dashboard */}
            <div className="absolute -top-12 -left-14 -right-10 -bottom-12 pointer-events-none z-0 overflow-visible">
              <svg viewBox="0 0 700 500" className="w-full h-full overflow-visible animate-ribbon-glow">
                <defs>
                  <linearGradient id="ribbonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                  <filter id="ribbonBlur" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="18" />
                  </filter>
                </defs>
                {/* Soft diffused neon aura path */}
                <path 
                  d="M -60 320 Q 10 100 240 130 T 600 50 T 740 260" 
                  fill="none" 
                  stroke="url(#ribbonGlow)" 
                  strokeWidth="36" 
                  filter="url(#ribbonBlur)" 
                />
                {/* Crisp neon core line */}
                <path 
                  d="M -60 320 Q 10 100 240 130 T 600 50 T 740 260" 
                  fill="none" 
                  stroke="#38bdf8" 
                  strokeWidth="3.5" 
                  opacity="0.9" 
                />
              </svg>
            </div>

            {/* Ambient Blue Backlight */}
            <div className="absolute inset-0 bg-blue-600/22 rounded-3xl blur-2xl pointer-events-none" />

            {/* Dashboard Container Window */}
            <div className="relative z-10 rounded-2xl bg-[#040b1e]/90 border border-blue-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden animate-holographic">
              
              <div className="grid grid-cols-12 min-h-[440px]">
                
                {/* Sidebar */}
                <div className="col-span-3 sm:col-span-4 bg-[#030919] border-r border-blue-500/20 p-4 flex flex-col justify-between">
                  <div>
                    {/* Brand in Sidebar */}
                    <div className="flex items-center gap-2 mb-6 px-1">
                      <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-400 fill-current">
                          <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-white tracking-tight">StudyBuddy</span>
                    </div>

                    {/* Nav Items */}
                    <nav className="space-y-1.5 text-xs">
                      <button 
                        onClick={() => setActiveNav('dashboard')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'dashboard'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                        <span className="hidden sm:inline">Dashboard</span>
                      </button>
                      <button 
                        onClick={() => setActiveNav('chat')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'chat'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">AI Chat</span>
                      </button>
                      <button 
                        onClick={() => setActiveNav('quizzes')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'quizzes'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">Quizzes</span>
                      </button>
                      <button 
                        onClick={() => setActiveNav('notes')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'notes'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">Notes</span>
                      </button>
                      <button 
                        onClick={() => setActiveNav('planner')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'planner'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">Planner</span>
                      </button>
                      <button 
                        onClick={() => setActiveNav('progress')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                          activeNav === 'progress'
                            ? 'bg-blue-600/30 text-cyan-300 border border-cyan-400/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="hidden sm:inline">Progress</span>
                      </button>
                    </nav>
                  </div>

                  {/* Settings at bottom */}
                  <div className="pt-4 border-t border-slate-800/60">
                    <button className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors text-xs px-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Body */}
                <div className="col-span-9 sm:col-span-8 p-6 flex flex-col justify-between relative bg-gradient-to-b from-[#05112e] to-[#030a1b]">
                  
                  <div>
                    {/* Greeting */}
                    <div className="mb-5">
                      <h4 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        Good Morning, Muhammad <span className="text-base animate-bounce">👏</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Keep going! You&apos;re doing great!
                      </p>
                    </div>

                    {/* Goals & Progress Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mb-5">
                      
                      {/* Today's Goals (Left) */}
                      <div className="sm:col-span-7 bg-[#071536] rounded-xl p-3.5 border border-blue-500/20">
                        <span className="text-xs font-semibold text-slate-200 block mb-2.5">
                          Today&apos;s Goals
                        </span>

                        <div className="space-y-2">
                          {goals.map(goal => (
                            <div 
                              key={goal.id}
                              onClick={() => toggleGoal(goal.id)}
                              className="flex items-center gap-2.5 p-2 rounded-lg bg-[#040e24]/80 hover:bg-[#06183e] cursor-pointer transition-colors border border-blue-900/30 group"
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                                goal.completed ? 'bg-cyan-500 text-[#020817] shadow-[0_0_8px_rgba(6,182,212,0.9)] scale-105' : 'border border-slate-600'
                              }`}>
                                {goal.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs truncate transition-colors ${goal.completed ? 'text-slate-200' : 'text-slate-400 line-through'}`}>
                                  {goal.title}
                                </p>
                                {goal.hasProgress && (
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-2/3 rounded-full animate-pulse" />
                                  </div>
                                )}
                              </div>
                              {goal.tag && (
                                <span className="text-[9px] text-cyan-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono">
                                  {goal.tag}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Radial Progress Chart (Right: 75% Daily Progress) */}
                      <div className="sm:col-span-5 bg-[#071536] rounded-xl p-3.5 border border-blue-500/20 flex flex-col items-center justify-center text-center group hover:border-cyan-400/40 transition-colors">
                        <div className="relative w-20 h-20 flex items-center justify-center mb-1.5">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-800"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.95)]"
                              strokeDasharray={`${progressPercent || 75}, 100`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-heading text-lg font-bold text-white tabular-nums">
                              {progressPercent || 75}%
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-300">Daily Progress</span>
                      </div>

                    </div>

                    {/* Quick Actions Row */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Quick Actions
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button className="flex flex-col items-center p-2.5 rounded-xl bg-[#071536] hover:bg-blue-600/25 border border-blue-500/20 hover:border-cyan-400/50 transition-all group cursor-pointer hover:scale-105 active:scale-95">
                          <Sparkles className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                          <span className="text-[11px] text-slate-200 font-medium">Ask AI</span>
                        </button>
                        <button className="flex flex-col items-center p-2.5 rounded-xl bg-[#071536] hover:bg-purple-600/25 border border-purple-500/20 hover:border-purple-400/50 transition-all group cursor-pointer hover:scale-105 active:scale-95">
                          <HelpCircle className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                          <span className="text-[11px] text-slate-200 font-medium">Create Quiz</span>
                        </button>
                        <button className="flex flex-col items-center p-2.5 rounded-xl bg-[#071536] hover:bg-indigo-600/25 border border-indigo-500/20 hover:border-indigo-400/50 transition-all group cursor-pointer hover:scale-105 active:scale-95">
                          <Plus className="w-4 h-4 text-indigo-400 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                          <span className="text-[11px] text-slate-200 font-medium">Add Notes</span>
                        </button>
                        <button className="flex flex-col items-center p-2.5 rounded-xl bg-[#071536] hover:bg-emerald-600/25 border border-emerald-500/20 hover:border-emerald-400/50 transition-all group cursor-pointer hover:scale-105 active:scale-95">
                          <Calendar className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform" />
                          <span className="text-[11px] text-slate-200 font-medium">Plan Study</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attached Peeking Mini 3D Robot Buddy with animated speech bubble and visor glow */}
                  <div 
                    onClick={handleMiniRobotClick}
                    className={`absolute -bottom-6 -right-6 flex items-end z-30 pointer-events-auto cursor-pointer group select-none transition-transform ${
                      miniRobotBouncing ? 'animate-bounce-quick' : ''
                    }`}
                  >
                    {/* Floating Spark particles */}
                    <div className="absolute -top-3 left-1 text-cyan-300 text-xs pointer-events-none animate-spark-1">
                      ✨
                    </div>
                    <div className="absolute -top-6 right-8 text-purple-300 text-xs pointer-events-none animate-spark-2">
                      ✦
                    </div>

                    <div className="bg-[#05112e]/95 px-3 py-1.5 rounded-2xl rounded-br-none border border-cyan-400/80 text-[11px] font-semibold text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.7)] mr-1 mb-8 group-hover:scale-105 transition-transform animate-card-float flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                      <span>{miniRobotText}</span>
                    </div>

                    {/* 3D Mini Robot Avatar with gentle peeking wobble and visor glow */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.75)] group-hover:scale-115 transition-transform duration-300 bg-[#05112e] animate-peek-wobble">
                      {/* Antenna Energy Halo */}
                      <div className="absolute inset-0 rounded-full border border-cyan-300/40 animate-visor-glow pointer-events-none" />
                      <img
                        src="/landing/mini_peeking_robot_1790178277543.jpg"
                        alt="Mini 3D Robot Assistant"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

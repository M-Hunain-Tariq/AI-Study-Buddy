import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Copy, 
  Volume2, 
  Check, 
  Send, 
  RotateCcw, 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const SeeItInAction: React.FC = () => {
  const topicAnswers: Record<string, string> = {
    "Explain the difference between HTML and CSS?": "HTML is used to structure the content of a webpage, while CSS is used to style and design it. HTML tells the browser what to show, and CSS tells it how to show it.",
    "How does Photosynthesis work?": "Photosynthesis is the process where plants convert water, carbon dioxide, and sunlight into oxygen and glucose energy using chlorophyll inside chloroplasts.",
    "What is the Pythagorean Theorem?": "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a² + b² = c²."
  };

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [userQuery, setUserQuery] = useState("Explain the difference between HTML and CSS?");

  useEffect(() => {
    let index = 0;
    setIsTyping(true);
    setDisplayedText("");
    const targetResponse = topicAnswers[userQuery] || "Here is a personalized explanation tailored to your learning goals. Step-by-step breakdown makes mastering any subject effortless!";

    const interval = setInterval(() => {
      if (index <= targetResponse.length) {
        setDisplayedText(targetResponse.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [userQuery]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(displayedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setUserQuery(customInput.trim());
    setCustomInput("");
  };

  return (
    <section id="see-it-in-action" className="relative py-20 px-6 overflow-hidden">
      {/* 3D Folded Crystal Origami Wings matching image.png */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Central Diffused Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-r from-cyan-600/15 via-indigo-600/20 to-purple-600/15 rounded-full blur-[160px] animate-pulse-glow" />

        {/* LEFT 3D ELECTRIC CYAN FOLDED CRYSTAL WING */}
        <div className="absolute top-1/3 -left-12 sm:-left-6 lg:-left-2 w-[180px] sm:w-[240px] lg:w-[320px] h-[440px] opacity-90 drop-shadow-[0_20px_45px_rgba(6,182,212,0.65)] animate-crystal-shift">
          {/* Shimmer reflection sweep */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-crystal-sweep" />
          </div>
          <svg viewBox="0 0 320 440" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="s4-c-left-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="s4-c-left-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="s4-c-left-3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#0369a1" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
              </linearGradient>
            </defs>
            {/* Main Crystal Wing Facet */}
            <polygon points="0,90 200,140 290,290 80,380 0,320" fill="url(#s4-c-left-1)" />
            {/* Top Shimmer Facet */}
            <polygon points="0,90 160,40 260,90 200,140" fill="url(#s4-c-left-2)" />
            {/* Bottom Dark Facet */}
            <polygon points="80,380 290,290 240,410 50,430" fill="url(#s4-c-left-3)" />
            {/* Specular Crisp Lines */}
            <line x1="0" y1="90" x2="200" y2="140" stroke="#a5f3fc" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="200" y1="140" x2="290" y2="290" stroke="#67e8f9" strokeWidth="2" strokeOpacity="0.85" />
            <line x1="200" y1="140" x2="260" y2="90" stroke="#cffafe" strokeWidth="1.5" strokeOpacity="0.75" />
          </svg>
        </div>

        {/* RIGHT 3D ELECTRIC VIOLET FOLDED CRYSTAL WING */}
        <div className="absolute top-1/3 -right-12 sm:-right-6 lg:-right-2 w-[180px] sm:w-[240px] lg:w-[320px] h-[440px] opacity-90 drop-shadow-[0_20px_45px_rgba(168,85,247,0.65)] animate-crystal-shift">
          {/* Shimmer reflection sweep */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-crystal-sweep" style={{ animationDelay: '2.5s' }} />
          </div>
          <svg viewBox="0 0 320 440" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="s4-c-right-1" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#3b0764" stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="s4-c-right-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="s4-c-right-3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
              </linearGradient>
            </defs>
            {/* Main Crystal Wing Facet */}
            <polygon points="320,90 120,140 30,290 240,380 320,320" fill="url(#s4-c-right-1)" />
            {/* Top Shimmer Facet */}
            <polygon points="320,90 160,40 60,90 120,140" fill="url(#s4-c-right-2)" />
            {/* Bottom Dark Facet */}
            <polygon points="240,380 30,290 80,410 270,430" fill="url(#s4-c-right-3)" />
            {/* Specular Crisp Lines */}
            <line x1="320" y1="90" x2="120" y2="140" stroke="#f3e8ff" strokeWidth="2" strokeOpacity="0.8" />
            <line x1="120" y1="140" x2="30" y2="290" stroke="#d8b4fe" strokeWidth="2" strokeOpacity="0.85" />
            <line x1="120" y1="140" x2="60" y2="90" stroke="#f5d0fe" strokeWidth="1.5" strokeOpacity="0.75" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-3 block animate-pulse">
              ✦ SEE IT IN ACTION
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white animate-text-shimmer">
                A Smarter Way to Learn
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Everything you need in one beautiful, easy-to-use platform.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Layout: Left Cards (Ask AI / Quizzes) | Center Chat Window | Right Cards (Notes / Planner) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Cards */}
          <div className="lg:col-span-3 flex flex-col gap-5 order-2 lg:order-1">
            {/* Ask AI Card */}
            <ScrollReveal animation="fade-right" delay={150}>
              <div className="bg-[#05112e]/90 p-6 rounded-2xl border border-blue-500/20 hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(6,182,212,0.25)] group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_24px_rgba(6,182,212,0.8)] transition-all">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  Ask AI
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get instant, accurate answers to any question.
                </p>
              </div>
            </ScrollReveal>

            {/* Create Quizzes Card */}
            <ScrollReveal animation="fade-right" delay={300}>
              <div className="bg-[#05112e]/90 p-6 rounded-2xl border border-blue-500/20 hover:border-purple-400/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(168,85,247,0.25)] group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.8)] transition-all">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  Create Quizzes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Turn your notes into interactive quizzes.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Center Main Chat Window */}
          <ScrollReveal animation="zoom-in" delay={180} className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative rounded-2xl bg-[#040b1e]/95 border border-blue-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden animate-holographic">
              
              {/* Window Header with Animated AI Mascot Indicator */}
              <div className="px-4 py-3 bg-[#030919] border-b border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* Mini Robot Avatar with visor glow */}
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.7)]">
                    <img 
                      src="/landing/mini_peeking_robot_1790178277543.jpg" 
                      alt="AI Tutor" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">StudyBuddy AI</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                    </span>
                  </div>
                  {/* Live audio wave indicators when typing */}
                  {isTyping && (
                    <div className="flex items-end gap-0.5 h-3 ml-1.5">
                      <div className="w-0.5 bg-cyan-400 rounded-full animate-wave-bar-1" />
                      <div className="w-0.5 bg-sky-400 rounded-full animate-wave-bar-2" />
                      <div className="w-0.5 bg-indigo-400 rounded-full animate-wave-bar-3" />
                      <div className="w-0.5 bg-purple-400 rounded-full animate-wave-bar-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsTyping(true);
                      setDisplayedText("");
                      let i = 0;
                      const activeText = topicAnswers[userQuery] || "Here is a personalized explanation tailored to your learning goals. Step-by-step breakdown makes mastering any subject effortless!";
                      const intv = setInterval(() => {
                        if (i <= activeText.length) {
                          setDisplayedText(activeText.slice(0, i));
                          i++;
                        } else {
                          setIsTyping(false);
                          clearInterval(intv);
                        }
                      }, 18);
                    }}
                    title="Replay animation" 
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer hover:rotate-180 duration-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Body with mini sidebar */}
              <div className="grid grid-cols-12 min-h-[340px]">
                
                {/* Mini Sidebar */}
                <div className="col-span-3 bg-[#030816] border-r border-blue-500/20 p-2.5 hidden sm:flex flex-col space-y-1 text-[11px]">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-600/30 text-cyan-300 font-medium border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Chat</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Notes</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Planner</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Progress</span>
                  </div>
                </div>

                {/* Conversation View */}
                <div className="col-span-12 sm:col-span-9 p-4 flex flex-col justify-between bg-[#040e24]/90 space-y-4">
                  
                  <div className="space-y-3.5">
                    {/* User Prompt (Right) */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs font-medium shadow-[0_2px_15px_rgba(37,99,235,0.45)]">
                        {userQuery}
                      </div>
                    </div>

                    {/* AI Response (Left) */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex-shrink-0 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      
                      <div className="max-w-[90%] bg-[#061433] border border-blue-500/35 rounded-2xl rounded-tl-xs p-3.5 text-xs leading-relaxed text-slate-200 shadow-md">
                        <p>
                          {displayedText}
                          {isTyping && <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse align-middle" />}
                        </p>

                        {/* Actions */}
                        <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-slate-400">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={handleCopy}
                              className="flex items-center gap-1 hover:text-cyan-300 transition-colors text-[10px] cursor-pointer"
                            >
                              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-cyan-300 transition-colors text-[10px] cursor-pointer">
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">0.4s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Topic Chips for Interactive Typing Animation */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none pt-2">
                    {Object.keys(topicAnswers).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setUserQuery(q)}
                        className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          userQuery === q
                            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.45)] scale-105'
                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {q.length > 25 ? q.slice(0, 25) + '...' : q}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendPrompt} className="relative mt-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Ask something..."
                      className="w-full bg-[#030919] border border-blue-500/30 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none pr-10 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 p-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#020817] transition-all shadow-[0_0_10px_rgba(6,182,212,0.6)] cursor-pointer hover:scale-110 active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>

                </div>

              </div>

            </div>
          </ScrollReveal>

          {/* Right Cards */}
          <div className="lg:col-span-3 flex flex-col gap-5 order-3">
            {/* Smart Notes Card */}
            <ScrollReveal animation="fade-left" delay={150}>
              <div className="bg-[#05112e]/90 p-6 rounded-2xl border border-blue-500/20 hover:border-cyan-400/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(6,182,212,0.25)] group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_24px_rgba(6,182,212,0.8)] transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  Smart Notes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Capture, organize and find your notes easily.
                </p>
              </div>
            </ScrollReveal>

            {/* Study Planner Card with Schedule list */}
            <ScrollReveal animation="fade-left" delay={300}>
              <div className="relative bg-[#05112e]/90 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-400/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(59,130,246,0.25)] group cursor-pointer overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-[0_0_24px_rgba(59,130,246,0.8)] transition-all">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                  Study Planner
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Plan your study schedule and never miss a goal.
                </p>

                {/* Study Plan Subcard */}
                <div className="relative bg-[#071536] p-3 rounded-xl border border-blue-500/25">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                    <span>Study Plan</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Math</span>
                      <span className="text-cyan-400 font-mono text-[11px]">2h 30m</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Web Dev</span>
                      <span className="text-blue-400 font-mono text-[11px]">2h 00m</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Reading</span>
                      <span className="text-indigo-400 font-mono text-[11px]">1h 00m</span>
                    </div>
                  </div>

                  {/* Floating Purple Calendar Icon with floating animation */}
                  <div className="absolute -right-3 -top-3 w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-[0_0_18px_rgba(168,85,247,0.85)] animate-card-float">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};

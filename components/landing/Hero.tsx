import React, { useState } from 'react';
import { 
  CheckCircle2, 
  BookOpen, 
  BarChart2, 
  LineChart, 
  Sparkles, 
  HelpCircle
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const Hero: React.FC = () => {
  const [bubbleMessageIndex, setBubbleMessageIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const speechMessages = [
    { line1: "Hey! I'm your", line2: "AI Study Buddy 🌟", line3: "Ready to learn?" },
    { line1: "Let's crush", line2: "Today's Study Goals! 🚀", line3: "Pick any subject!" },
    { line1: "Need a quick quiz?", line2: "Master Any Topic 📝", line3: "Ask me anything!" },
    { line1: "You're doing great!", line2: "100K+ Learners ⭐", line3: "Keep going strong!" },
  ];

  const handleBubbleClick = () => {
    setIsBouncing(true);
    setBubbleMessageIndex((prev) => (prev + 1) % speechMessages.length);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const currentSpeech = speechMessages[bubbleMessageIndex];

  return (
    <section className="relative min-h-[680px] lg:min-h-[820px] flex items-center pt-20 sm:pt-24 pb-20 px-6 overflow-hidden">
      {/* 1. Cinematic Robot Scene Background Picture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="w-full h-full">
          <img
            src="/landing/hero_scene_full_1790180757625.jpg"
            alt="StudyBuddy AI Study Companion"
            className="w-full h-full object-cover object-[78%_center] lg:object-[72%_center] opacity-95 filter contrast-[1.04]"
          />
        </div>

        {/* Left Dark Gradient Wash: Ensures Left Typography is 100% High-Contrast & Crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020717] via-[#020717]/85 sm:via-[#020717]/60 md:via-[#020717]/35 to-transparent w-full lg:w-[65%]" />

        {/* Bottom Fade into Section 2 */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#020717] via-[#020717]/80 to-transparent" />

        {/* Top Fade under Navbar */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#020717]/90 via-[#020717]/40 to-transparent" />
      </div>

      {/* 2. Hero Foreground Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: High-Impact Typography & Interactive CTAs */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start pt-4 lg:pt-0">
          
          {/* Badge: ✦ Your AI-Powered Study Companion */}
          <ScrollReveal animation="fade-down" delay={100}>
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#061433]/85 backdrop-blur-md mb-6 border border-cyan-400/50 text-xs font-medium text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.45)] group hover:border-cyan-300 transition-all duration-300 cursor-default">
              {/* Shimmer sweep on badge */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" />
              </div>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="relative z-10 font-semibold tracking-wide">Your AI-Powered Study Companion</span>
            </div>
          </ScrollReveal>

          {/* Heading: Learn Smarter / Not Harder */}
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              <span className="text-white block">
                Learn Smarter
              </span>
              <span className="block mt-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] animate-text-shimmer">
                  Not
                </span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)] animate-text-shimmer">
                  Harder
                </span>
              </span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal animation="fade-up" delay={300}>
            <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-xl leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              AI StudyBuddy helps you learn faster, stay organized, and achieve your goals — with personalized learning, smart quizzes, and 24/7 support.
            </p>
          </ScrollReveal>

          {/* Trust Indicators */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-200 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] p-3 rounded-2xl bg-[#030d24]/65 border border-cyan-500/25 backdrop-blur-md mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-cyan-400/50 transition-colors">
              <div className="flex items-center gap-2 group hover:text-cyan-300 transition-colors cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] group-hover:scale-120 group-hover:rotate-12 transition-transform drop-shadow-[0_0_6px_#38bdf8]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-cyan-300 transition-colors cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] group-hover:scale-120 group-hover:rotate-12 transition-transform drop-shadow-[0_0_6px_#38bdf8]" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 group hover:text-cyan-300 transition-colors cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] group-hover:scale-120 group-hover:rotate-12 transition-transform drop-shadow-[0_0_6px_#38bdf8]" />
                <span>Loved by 100K+ students</span>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* Right Column: Floating Holographic Cards & Animated Speech Bubble around 3D Robot */}
        <div className="lg:col-span-6 xl:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] flex items-center justify-center pointer-events-auto select-none">
          
          {/* Floating Card 1: Top-Left (Open Book) */}
          <ScrollReveal animation="zoom-in" delay={300} className="absolute top-4 sm:top-8 left-4 sm:left-12 lg:left-6 z-20">
            <div 
              className="bg-[#071330]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-cyan-400/60 shadow-[0_0_28px_rgba(6,182,212,0.5)] animate-card-float hover:scale-115 hover:-rotate-3 transition-all duration-300 cursor-pointer group"
              title="Smart Learning Library"
            >
              {/* Ambient Aura Ring */}
              <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:text-white group-hover:bg-cyan-500/30 transition-all">
                <BookOpen className="w-5 h-5 drop-shadow-[0_0_12px_rgba(6,182,212,0.95)]" />
              </div>
            </div>
          </ScrollReveal>

          {/* Floating Card 2: Mid-Left (Bar Chart / Analytics) */}
          <ScrollReveal animation="zoom-in" delay={450} className="absolute top-36 sm:top-48 left-2 sm:left-6 lg:left-2 z-20">
            <div 
              className="bg-[#071330]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-blue-400/60 shadow-[0_0_28px_rgba(59,130,246,0.5)] animate-card-float-alt hover:scale-115 hover:rotate-3 transition-all duration-300 cursor-pointer group"
              title="Progress Analytics"
            >
              <div className="absolute -inset-1 rounded-2xl bg-blue-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 group-hover:text-white group-hover:bg-blue-500/30 transition-all">
                <BarChart2 className="w-5 h-5 drop-shadow-[0_0_12px_rgba(59,130,246,0.95)]" />
              </div>
            </div>
          </ScrollReveal>

          {/* Floating Speech Bubble: Top-Right of Robot */}
          <ScrollReveal animation="fade-down" delay={250} className="absolute top-2 sm:top-6 right-2 sm:right-10 lg:right-6 z-30">
            <div 
              onClick={handleBubbleClick}
              className={`bg-[#06122e]/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-3xl border border-cyan-400/70 shadow-[0_0_35px_rgba(6,182,212,0.55)] cursor-pointer hover:border-cyan-300 hover:scale-105 active:scale-95 transition-all duration-300 group ${
                isBouncing ? 'animate-bounce-quick' : 'animate-card-float'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                    {currentSpeech.line1}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
                    {currentSpeech.line2}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
                    <span>{currentSpeech.line3}</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </p>
                </div>
              </div>

              {/* Pointer triangle downwards pointing towards robot head */}
              <div className="absolute -bottom-2.5 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-cyan-400/70" />
              <div className="absolute -bottom-2 left-[33px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-[#06122e]" />
            </div>
          </ScrollReveal>

          {/* Floating Card 3: Upper-Right (Line Chart / Study Streak) */}
          <ScrollReveal animation="zoom-in" delay={350} className="absolute top-28 sm:top-36 right-1 sm:right-4 lg:right-2 z-20">
            <div 
              className="bg-[#071330]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-cyan-400/60 shadow-[0_0_28px_rgba(6,182,212,0.5)] animate-card-float hover:scale-115 hover:-rotate-3 transition-all duration-300 cursor-pointer group"
              title="Study Streak"
            >
              <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:text-white group-hover:bg-cyan-500/30 transition-all">
                <LineChart className="w-5 h-5 drop-shadow-[0_0_12px_rgba(6,182,212,0.95)]" />
              </div>
            </div>
          </ScrollReveal>

          {/* Floating Card 4: Lower-Right (Quiz & Practice) */}
          <ScrollReveal animation="zoom-in" delay={500} className="absolute top-52 sm:top-64 right-4 sm:right-8 lg:right-6 z-20">
            <div 
              className="bg-[#071330]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-purple-400/60 shadow-[0_0_28px_rgba(168,85,247,0.5)] animate-card-float-alt hover:scale-115 hover:rotate-3 transition-all duration-300 cursor-pointer group"
              title="Interactive Quizzes"
            >
              <div className="absolute -inset-1 rounded-2xl bg-purple-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:text-white group-hover:bg-purple-500/30 transition-all">
                <HelpCircle className="w-5 h-5 drop-shadow-[0_0_12px_rgba(168,85,247,0.95)]" />
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

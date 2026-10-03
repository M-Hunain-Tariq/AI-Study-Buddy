import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FinalCTAProps {
  onStartFree: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartFree }) => {
  return (
    <section id="final-cta" className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center py-24 px-6 overflow-hidden bg-[#020817]">
      
      {/* Background Cinematic Mountain Sunset Scene */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/landing/sunset_mountain_student_1790178300240.jpg"
          alt="Student looking over mountains at sunset"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        {/* Cinematic Vignette & Twilight Sky Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-[#020817]/75" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#020817]/25 to-[#020817]/65" />
      </div>

      {/* Atmospheric Twinkling Stars in Twilight Sky & Floating Fireflies */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff] twinkle-1" />
        <div className="absolute top-20 right-1/3 w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_12px_#38bdf8] twinkle-2" />
        <div className="absolute top-36 left-1/6 w-1.5 h-1.5 bg-pink-300 rounded-full shadow-[0_0_10px_#f472b6] twinkle-3" />
        <div className="absolute top-16 right-1/5 w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_10px_#fde68a] twinkle-1" />
        <div className="absolute top-28 left-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full shadow-[0_0_10px_#93c5fd] twinkle-2" />
        {/* Twilight Fireflies Rising */}
        <div className="absolute bottom-28 left-[22%] w-1.5 h-1.5 rounded-full bg-amber-300/80 blur-[0.5px] shadow-[0_0_8px_#f59e0b] animate-stardust-1" />
        <div className="absolute bottom-36 right-[28%] w-1.5 h-1.5 rounded-full bg-cyan-300/80 blur-[0.5px] shadow-[0_0_8px_#38bdf8] animate-stardust-2" />
        <div className="absolute bottom-20 right-[18%] w-1 h-1 rounded-full bg-pink-300/80 blur-[0.5px] shadow-[0_0_6px_#ec4899] animate-stardust-3" />
      </div>

      {/* Left Handwritten Note: Better Learning Brighter Future with subtle floating */}
      <ScrollReveal animation="fade-right" delay={150} className="absolute left-6 md:left-14 lg:left-24 top-16 sm:top-24 z-20 pointer-events-none select-none">
        <div className="animate-card-float">
          <div className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight transform -rotate-12 drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]">
            Better<br />
            Learning<br />
            Brighter<br />
            Future
          </div>
          {/* Hand-drawn Arrow pointing down */}
          <svg 
            viewBox="0 0 100 120" 
            className="w-16 h-20 text-white transform translate-x-12 translate-y-2 drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          >
            <path d="M 20 10 Q 50 40 40 85" />
            <path d="M 28 75 L 40 85 L 52 70" />
          </svg>
        </div>
      </ScrollReveal>

      {/* Right Handwritten Note: Small Steps Big Dreams with subtle floating reverse */}
      <ScrollReveal animation="fade-left" delay={250} className="absolute right-6 md:right-14 lg:right-24 top-20 sm:top-28 z-20 pointer-events-none select-none">
        <div className="animate-card-float-alt">
          <div className="font-handwriting text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight transform rotate-6 drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)]">
            Small<br />
            Steps<br />
            Big Dreams
          </div>
          {/* Hand-drawn Arrow pointing down-left */}
          <svg 
            viewBox="0 0 100 120" 
            className="w-16 h-20 text-white transform -translate-x-6 translate-y-2 drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          >
            <path d="M 70 15 Q 45 45 25 80" />
            <path d="M 20 62 L 25 80 L 42 75" />
          </svg>
        </div>
      </ScrollReveal>

      {/* Center Main Card / Text Content */}
      <ScrollReveal animation="fade-up" delay={100} className="relative z-20 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Small uppercase label */}
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] mb-3 block animate-pulse">
          ✦ READY TO GET STARTED?
        </span>

        {/* Headline */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white animate-text-shimmer">
            Your Future Self
          </span> <br />
          Will Thank You
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Start your free learning journey today and unlock your full potential with AI StudyBuddy.
        </p>

        {/* The One & Only Final CTA Button Down */}
        <div className="relative mb-6 group">
          {/* Ambient Outer Pulsing Aura Ring */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 opacity-75 blur-xl group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse-glow" />
          
          <button
            onClick={onStartFree}
            id="last-cta-btn"
            className="relative inline-flex items-center gap-3.5 px-10 py-4.5 rounded-full text-lg font-bold text-white bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#38bdf8] hover:from-[#7c3aed] hover:to-[#0ea5e9] shadow-[0_0_35px_rgba(139,92,246,0.85)] hover:shadow-[0_0_55px_rgba(56,189,248,1)] transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.04] active:translate-y-0 cursor-pointer overflow-hidden border border-white/40"
          >
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
            <span className="relative z-10 tracking-wide">Start Learning Free</span>
            <ArrowRight className="w-5 h-5 text-cyan-100 group-hover:translate-x-2 transition-transform duration-200 relative z-10" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-200 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>No credit card required</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Free forever</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Join 100K+ students</span>
          </div>
        </div>

      </ScrollReveal>

    </section>
  );
};

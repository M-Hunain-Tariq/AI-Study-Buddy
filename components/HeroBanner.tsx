'use client';

import React from 'react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onContinueLearning: () => void;
  onAskAiTutor: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onContinueLearning, onAskAiTutor }) => {
  return (
    <section className="home-hero home-hero-photo relative isolate overflow-hidden rounded-[28px] border border-white/[0.10] shadow-[0_28px_90px_rgba(0,0,0,.40)]">
      <img
        src="/images/hero_study_desk_exact.jpg"
        alt="Study space"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,24,.96)_0%,rgba(5,12,26,.82)_36%,rgba(5,12,26,.25)_68%,rgba(5,12,26,.10)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,20,.12),rgba(4,9,20,.42))]" />
      <div className="home-hero-photo-glow absolute -left-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="home-hero-photo-glow absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-[340px] items-center p-6 sm:min-h-[390px] sm:p-8 lg:min-h-[410px] lg:p-11">
        <div className="max-w-[620px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-[#071326]/65 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 shadow-lg backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> Study Dashboard
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.45rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,.55)]">
            Welcome to your <span className="bg-gradient-to-r from-cyan-200 via-violet-300 to-indigo-300 bg-clip-text text-transparent">Study Space</span>
          </h1>
          <p className="mt-4 max-w-[510px] text-sm leading-6 text-slate-200/85 sm:text-[15px]">
            Your new study workspace is ready. Start with one small step and let StudyBuddy keep your learning on track.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <button onClick={onContinueLearning} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(34,211,238,.22)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0">
              Start Learning <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onAskAiTutor} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#071326]/65 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#0b1b33]/80 active:translate-y-0">
              <Bot className="h-4 w-4 text-cyan-300" /> Ask AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Bot, CheckCircle2, Clock3, Sparkles, Target } from 'lucide-react';

interface HeroBannerProps {
  onContinueLearning: () => void;
  onAskAiTutor: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onContinueLearning, onAskAiTutor }) => {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(135deg,#101a2d_0%,#0b1322_58%,#11152b_100%)] p-5 sm:p-7 lg:p-8 shadow-[0_24px_70px_rgba(0,0,0,.24)]">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[1fr_360px]">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" /> Your study space
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-white">
            Make today a little<br className="hidden sm:block" /> <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">smarter.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
            Pick one thing to focus on, get help when you are stuck, and let StudyBuddy keep the rest organized.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <button onClick={onContinueLearning} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-cyan-50 active:translate-y-0">
              Start a session <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onAskAiTutor} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]">
              <Bot className="h-4 w-4 text-cyan-300" /> Ask your AI tutor
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[360px]">
          <div className="absolute -inset-5 rounded-[30px] bg-gradient-to-br from-cyan-400/10 to-violet-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1220]/90 p-3 shadow-2xl">
            <div className="relative h-36 overflow-hidden rounded-[16px] border border-white/10">
              <Image src="/images/hero_study_desk_exact.jpg" alt="Study desk" fill unoptimized sizes="360px" className="object-cover object-center opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09111e] via-[#09111e]/20 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 backdrop-blur-md">
                <Target className="h-4 w-4 text-cyan-300" /><span className="text-[11px] font-semibold text-white">Today's focus</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-1 pt-3">
              <div className="rounded-xl bg-white/[0.04] p-3"><div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"><Clock3 className="h-3 w-3" /> Focus</div><p className="mt-1 text-lg font-extrabold text-white">25 min</p></div>
              <div className="rounded-xl bg-white/[0.04] p-3"><div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"><CheckCircle2 className="h-3 w-3" /> Progress</div><p className="mt-1 text-lg font-extrabold text-white">Ready</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

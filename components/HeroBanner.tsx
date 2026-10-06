'use client';

import React from 'react';
import { ArrowRight, Bot, CheckCircle2, Clock3, FileText, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';

interface HeroBannerProps {
  onContinueLearning: () => void;
  onAskAiTutor: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onContinueLearning, onAskAiTutor }) => {
  return (
    <section className="home-hero relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[linear-gradient(135deg,#0d1b31_0%,#091426_48%,#11152d_100%)] p-5 sm:p-7 lg:p-8 shadow-[0_24px_70px_rgba(0,0,0,.28)]">
      <div className="home-hero-orb home-hero-orb-a" />
      <div className="home-hero-orb home-hero-orb-b" />
      <div className="home-hero-grid" />
      <div className="home-hero-shimmer" />

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)]">
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

        <div className="home-dashboard-preview relative mx-auto w-full max-w-[430px] lg:ml-auto">
          <div className="home-preview-aura" />
          <div className="home-preview-window relative overflow-hidden rounded-[22px] border border-white/12 bg-[#08111f]/90 shadow-[0_28px_80px_rgba(0,0,0,.45)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-400/20 ring-1 ring-white/10"><Sparkles className="h-3.5 w-3.5 text-cyan-200" /></div>
                <div><p className="text-[11px] font-bold text-white">StudyBuddy</p><p className="text-[9px] text-slate-500">Today&apos;s dashboard</p></div>
              </div>
              <div className="flex gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" /><span className="h-1.5 w-1.5 rounded-full bg-violet-300/70" /><span className="h-1.5 w-1.5 rounded-full bg-white/20" /></div>
            </div>

            <div className="grid grid-cols-[1.18fr_.82fr] gap-3 p-3">
              <div className="relative overflow-hidden rounded-[16px] border border-white/[0.08] bg-gradient-to-br from-[#112746] via-[#0d1c34] to-[#10152c] p-3.5">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-cyan-200/80">Today&apos;s focus</span><Target className="h-3.5 w-3.5 text-cyan-300" /></div>
                  <p className="mt-2 text-sm font-extrabold text-white">Linear Equations</p>
                  <p className="mt-1 text-[9px] leading-4 text-slate-500">Lesson 3 of 5 · Algebra</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" /></div>
                  <div className="mt-1.5 flex justify-between text-[8px] text-slate-500"><span>68% complete</span><span>25 min</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.035] p-3"><div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-500"><Flame className="h-3 w-3 text-orange-300" /> Streak</div><p className="mt-1 text-lg font-extrabold text-white">7 days</p></div>
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.035] p-3"><div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-slate-500"><TrendingUp className="h-3 w-3 text-emerald-300" /> Progress</div><p className="mt-1 text-lg font-extrabold text-white">+18%</p></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-3 pb-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5"><Clock3 className="h-3.5 w-3.5 text-cyan-300" /><p className="mt-1 text-[10px] font-bold text-white">25 min</p><span className="text-[8px] text-slate-500">focus</span></div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /><p className="mt-1 text-[10px] font-bold text-white">8 / 10</p><span className="text-[8px] text-slate-500">quiz</span></div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5"><FileText className="h-3.5 w-3.5 text-violet-300" /><p className="mt-1 text-[10px] font-bold text-white">12</p><span className="text-[8px] text-slate-500">notes</span></div>
            </div>
          </div>
          <div className="home-preview-float home-preview-float-top"><Bot className="h-3.5 w-3.5 text-cyan-200" /><span>AI tutor ready</span></div>
          <div className="home-preview-float home-preview-float-bottom"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /><span>Great progress</span></div>
        </div>
      </div>
    </section>
  );
};

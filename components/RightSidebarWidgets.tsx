'use client';

import React from 'react';
import { Calendar, Flame, Target, ArrowRight, Plus } from 'lucide-react';
import { useToast } from './Toast';

export const RightSidebarWidgets: React.FC = () => {
  const { showToast } = useToast();
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg flex items-center gap-3.5"><div className="w-12 h-12 rounded-full bg-[#17213D] flex items-center justify-center text-slate-400 shrink-0"><Flame className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 font-medium">Study Streak</p><h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">0 days</h4><p className="text-[11px] text-slate-500 mt-0.5">Start your first session</p></div></div>
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#132347] flex items-center justify-center text-blue-400 shrink-0"><Target className="w-5 h-5" /></div><div><p className="text-xs text-slate-400 font-medium">Today&apos;s Goal</p><h4 className="text-xs sm:text-[13px] font-semibold text-white mt-0.5">No goal set</h4></div></div><div className="mt-4 h-2 w-full rounded-full bg-[#172544]" /><p className="mt-2 text-[11px] text-slate-500">0% complete · Add a goal when you&apos;re ready.</p></div>
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg"><div className="flex items-center justify-between pb-3 border-b border-[#142240]"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" /><h4 className="text-sm font-bold text-white tracking-tight">Today&apos;s Study Plan</h4></div><button onClick={() => showToast('Open Study Planner from the navigation to create your plan.', 'info')} className="text-xs font-semibold text-blue-400 hover:text-blue-300">Open <ArrowRight className="inline h-3 w-3" /></button></div><div className="flex flex-col items-center py-7 text-center"><Calendar className="h-6 w-6 text-slate-500" /><p className="mt-3 text-xs font-semibold text-slate-200">Nothing planned yet</p><p className="mt-1 text-[11px] leading-5 text-slate-500">Your study sessions will appear here after you add them.</p><button onClick={() => showToast('Open Study Planner from the navigation to add your first session.', 'info')} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-200"><Plus size={13} /> Add a session</button></div></div>
      <div className="relative overflow-hidden rounded-2xl border border-[#162544] bg-gradient-to-br from-[#101B35] to-[#15172F] p-5 shadow-lg"><p className="text-sm font-bold text-white">One step at a time</p><p className="mt-2 text-[11px] leading-relaxed text-slate-400">Your workspace is ready. Add your own tasks and goals whenever you&apos;re ready to begin.</p></div>
    </div>
  );
};

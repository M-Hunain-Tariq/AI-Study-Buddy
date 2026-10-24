'use client';

import React from 'react';
import { Activity, BookOpen, CalendarDays, CheckSquare, Clock3, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-white/[0.075] bg-[#0B1427]/85 shadow-[0_18px_45px_rgba(0,0,0,.16)] backdrop-blur-xl ${className}`}>{children}</section>;
}

const stats = [
  { label: 'Overall progress', value: '0%', hint: 'No activity recorded', icon: TrendingUp, tint: 'text-cyan-200 bg-cyan-300/10' },
  { label: 'Study time', value: '0h 00m', hint: 'Start your first session', icon: Clock3, tint: 'text-violet-200 bg-violet-300/10' },
  { label: 'Study streak', value: '0 days', hint: 'Your journey starts here', icon: Flame, tint: 'text-amber-200 bg-amber-300/10' },
  { label: 'Tasks completed', value: '0', hint: 'Nothing completed yet', icon: CheckSquare, tint: 'text-emerald-200 bg-emerald-300/10' },
];

export const MyProgressWorkspace: React.FC = () => (
  <div className="mx-auto w-full max-w-[1480px] space-y-5 pb-2 sm:space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-semibold text-cyan-200"><Sparkles size={13} /> YOUR LEARNING SPACE</div>
        <h1 className="text-[27px] font-extrabold tracking-[-.045em] text-white sm:text-3xl lg:text-[36px]">My <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">Progress</span></h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">Your progress will build here as you study, complete tasks, and practise.</p>
      </div>
      <div className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2.5 text-xs font-medium text-slate-300 md:self-auto"><CalendarDays size={15} className="text-slate-400" /> No study activity yet</div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, hint, icon: Icon, tint }) => (
      <Panel key={label} className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-3 text-2xl font-extrabold tracking-tight text-white">{value}</p><p className="mt-1 text-[11px] text-slate-500">{hint}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={18} /></span></div></Panel>
    ))}</div>

    <Panel className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/[0.07] blur-3xl" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-violet-300/10 text-cyan-200"><Activity size={27} /></div>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">Your learning journey starts here</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">There is no progress to show yet. Once you add tasks, create study goals, or complete practice quizzes, your real activity can appear here. Nothing has been pre-filled.</p>
        <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
          {[{ title: 'Create a task', desc: 'Add your first study task', icon: CheckSquare }, { title: 'Make a note', desc: 'Save something to revise', icon: BookOpen }, { title: 'Set a goal', desc: 'Plan what you want to learn', icon: Target }].map(({ title, desc, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-slate-300"><Icon size={17} /></span><p className="mt-3 text-xs font-bold text-slate-200">{title}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{desc}</p></div>
          ))}
        </div>
      </div>
    </Panel>

    <div className="grid gap-5 lg:grid-cols-2">
      <Panel className="p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-cyan-300/10 text-cyan-200"><TrendingUp size={18} /></span><div><h2 className="text-sm font-bold text-white">Study activity</h2><p className="mt-0.5 text-[11px] text-slate-500">Last 7 days</p></div></div><div className="mt-6 flex h-28 items-end justify-around gap-3 border-b border-white/[0.08] px-2">{['M','T','W','T','F','S','S'].map((day, i) => <div key={`${day}-${i}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-7 rounded-t-md bg-white/[0.045]" style={{ height: '4px' }} /><span className="pb-2 text-[10px] text-slate-500">{day}</span></div>)}</div><p className="mt-4 text-center text-xs text-slate-500">No sessions recorded yet</p></Panel>
      <Panel className="p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-violet-300/10 text-violet-200"><Target size={18} /></span><div><h2 className="text-sm font-bold text-white">Learning goals</h2><p className="mt-0.5 text-[11px] text-slate-500">Your own goals will appear here</p></div></div><div className="mt-5 flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-4 text-center"><Target size={20} className="text-slate-500" /><p className="mt-2 text-xs font-semibold text-slate-300">No goals added</p><p className="mt-1 text-[11px] text-slate-500">Create a goal in Study Planner to get started.</p></div></Panel>
    </div>
  </div>
);

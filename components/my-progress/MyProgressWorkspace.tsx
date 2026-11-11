'use client';

import React, { useEffect, useState } from 'react';
import { Activity, BookOpen, CalendarDays, CheckSquare, Clock3, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import { toLocalDateString } from '@/lib/date';
import { getCurrentStudyStreak } from '@/lib/streak';

interface ProgressSnapshot {
  percent: number;
  minutes: number;
  streak: number;
  tasksDone: number;
  notes: number;
  quizzes: number;
  hasData: boolean;
  activity: { label: string; date: string; count: number }[];
  goals: { id: string; title: string; subject: string; completed: boolean; completedSessions: number; targetSessions: number }[];
}

const EMPTY: ProgressSnapshot = {
  percent: 0,
  minutes: 0,
  streak: 0,
  tasksDone: 0,
  notes: 0,
  quizzes: 0,
  hasData: false,
  activity: [],
  goals: [],
};

function readList<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function computeProgress(): ProgressSnapshot {
  try {
    const tasks = readList<{ id: string; status?: string; completed?: boolean }>('study_tasks_v4');
    const sessions = readList<{ id: string; completed?: boolean; durationMinutes?: number; date?: string }>('study_planner_tasks');
    const notes = readList<{ id: string }>('study_notes_v5');
    const quizzes = readList<{ id: string }>('study_quiz_history_v1');
    const goals = readList<{ id: string; title?: string; subject?: string; completed?: boolean; completedSessions?: number; targetSessions?: number }>('study_planner_goals');
    const doneTasks = tasks.filter((task) => task.status === 'Completed' || task.completed === true).length;
    const doneSessions = sessions.filter((session) => session.completed === true);
    const total = tasks.length + sessions.length;
    const today = new Date();
    const activity = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setHours(12, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));
      const date = toLocalDateString(day);
      return {
        date,
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day),
        count: doneSessions.filter((session) => session.date === date).length,
      };
    });

    return {
      percent: total ? Math.round(((doneTasks + doneSessions.length) / total) * 100) : 0,
      minutes: doneSessions.reduce((sum, session) => sum + Math.max(0, Number(session.durationMinutes) || 0), 0),
      streak: getCurrentStudyStreak(),
      tasksDone: doneTasks + doneSessions.length,
      notes: notes.length,
      quizzes: quizzes.length,
      hasData: total + notes.length + quizzes.length > 0,
      activity,
      goals: goals.filter((goal) => goal && typeof goal.id === 'string').map((goal) => ({
        id: goal.id,
        title: typeof goal.title === 'string' ? goal.title : 'Untitled goal',
        subject: typeof goal.subject === 'string' ? goal.subject : 'General',
        completed: goal.completed === true,
        completedSessions: Math.max(0, Number(goal.completedSessions) || 0),
        targetSessions: Math.max(1, Number(goal.targetSessions) || 1),
      })),
    };
  } catch {
    return EMPTY;
  }
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-white/[0.075] bg-[#0B1427]/85 shadow-[0_18px_45px_rgba(0,0,0,.16)] backdrop-blur-xl ${className}`}>{children}</section>;
}

export const MyProgressWorkspace: React.FC = () => {
  const [stats, setStats] = useState<ProgressSnapshot>(EMPTY);

  useEffect(() => {
    const refresh = () => setStats(computeProgress());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const hours = Math.floor(stats.minutes / 60);
  const minutes = stats.minutes % 60;
  const maxActivity = Math.max(1, ...stats.activity.map((day) => day.count));
  const completedGoals = stats.goals.filter((goal) => goal.completed).length;
  const cards = [
    { label: 'Overall progress', value: `${stats.percent}%`, hint: stats.hasData ? 'Across your tasks and study sessions' : 'No activity recorded', icon: TrendingUp, tint: 'text-cyan-200 bg-cyan-300/10' },
    { label: 'Study time', value: `${hours}h ${String(minutes).padStart(2, '0')}m`, hint: stats.minutes ? 'From completed planner sessions' : 'Complete a study session to begin', icon: Clock3, tint: 'text-blue-200 bg-blue-300/10' },
    { label: 'Study streak', value: `${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`, hint: stats.streak ? 'Keep your daily learning habit going' : 'Study today to start a streak', icon: Flame, tint: 'text-blue-200 bg-blue-300/10' },
    { label: 'Tasks completed', value: String(stats.tasksDone), hint: stats.tasksDone ? 'Tasks and planner sessions' : 'Nothing completed yet', icon: CheckSquare, tint: 'text-blue-200 bg-blue-300/10' },
  ];

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-5 pb-2 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-semibold text-cyan-200"><Sparkles size={13} /> YOUR LEARNING SPACE</div>
          <h1 className="text-[27px] font-extrabold tracking-[-.045em] text-white sm:text-3xl lg:text-[36px]">My <span className="bg-gradient-to-r from-cyan-200 via-blue-300 to-blue-300 bg-clip-text text-transparent">Progress</span></h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">A live summary of your saved tasks, study sessions, notes, goals and quizzes.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 py-2.5 text-xs font-medium text-slate-300 md:self-auto"><CalendarDays size={15} className="text-slate-400" /> {stats.hasData ? 'Based on your saved activity' : 'No study activity yet'}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, hint, icon: Icon, tint }) => (
        <Panel key={label} className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-400">{label}</p><p className="mt-3 text-2xl font-extrabold tracking-tight text-white">{value}</p><p className="mt-1 text-[11px] text-slate-500">{hint}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={18} /></span></div></Panel>
      ))}</div>

      <Panel className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/[0.07] blur-3xl" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 text-cyan-200"><Activity size={27} /></div>
          <h2 className="mt-5 text-xl font-bold tracking-tight text-white sm:text-2xl">{stats.hasData ? 'Your learning journey is in progress' : 'Your learning journey starts here'}</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{stats.hasData ? `You have saved ${stats.notes} notes and completed ${stats.tasksDone} tasks or study sessions. Keep going at your own pace.` : 'There is no progress to show yet. Once you add tasks, create study goals, or complete practice quizzes, your real activity will appear here.'}</p>
          {!stats.hasData && <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
            {[{ title: 'Create a task', desc: 'Add your first study task', icon: CheckSquare }, { title: 'Make a note', desc: 'Save something to revise', icon: BookOpen }, { title: 'Set a goal', desc: 'Plan what you want to learn', icon: Target }].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-slate-300"><Icon size={17} /></span><p className="mt-3 text-xs font-bold text-slate-200">{title}</p><p className="mt-1 text-[11px] text-slate-500">{desc}</p></div>
            ))}
          </div>}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-cyan-300/10 text-cyan-200"><TrendingUp size={18} /></span><div><h2 className="text-sm font-bold text-white">Study activity</h2><p className="mt-0.5 text-[11px] text-slate-500">Completed planner sessions · Last 7 days</p></div></div>
          <div className="mt-6 flex h-28 items-end justify-around gap-3 border-b border-white/[0.08] px-2">{stats.activity.map((day) => <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full max-w-7 rounded-t-md bg-cyan-300/70" style={{ height: `${Math.max(day.count ? 8 : 3, day.count / maxActivity * 100)}%` }} title={`${day.count} completed sessions`} /><span className="pb-2 text-[10px] text-slate-500">{day.label}</span></div>)}</div>
          <p className="mt-4 text-center text-xs text-slate-500">{stats.activity.reduce((sum, day) => sum + day.count, 0)} completed sessions in the last 7 days</p>
        </Panel>
        <Panel className="p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-blue-300/10 text-blue-200"><Target size={18} /></span><div><h2 className="text-sm font-bold text-white">Learning goals</h2><p className="mt-0.5 text-[11px] text-slate-500">{completedGoals} of {stats.goals.length} goals completed</p></div></div>
          {stats.goals.length ? <div className="mt-5 space-y-3">{stats.goals.slice(0, 4).map((goal) => {
            const progress = Math.min(100, Math.round(goal.completedSessions / goal.targetSessions * 100));
            return <div key={goal.id}><div className="flex justify-between gap-3 text-xs"><span className="truncate font-semibold text-slate-200">{goal.title}</span><span className="shrink-0 text-slate-400">{goal.completed ? 'Complete' : `${progress}%`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#172544]"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${goal.completed ? 100 : progress}%` }} /></div><p className="mt-1 text-[10px] text-slate-500">{goal.subject} · {goal.completedSessions}/{goal.targetSessions} sessions</p></div>;
          })}</div> : <div className="mt-5 flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-4 text-center"><Target size={20} className="text-slate-500" /><p className="mt-2 text-xs font-semibold text-slate-300">No goals added</p><p className="mt-1 text-[11px] text-slate-500">Create a goal in Study Planner to get started.</p></div>}
        </Panel>
      </div>
    </div>
  );
};

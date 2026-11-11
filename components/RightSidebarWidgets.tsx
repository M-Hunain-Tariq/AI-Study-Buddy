'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Flame, Target, ArrowRight, Plus, CheckCircle2 } from 'lucide-react';
import { getCurrentStudyStreak } from '@/lib/streak';
import { toLocalDateString } from '@/lib/date';
import type { StudyGoal, StudyTask } from '@/types/study-planner';

const TASKS_KEY = 'study_planner_tasks';
const GOALS_KEY = 'study_planner_goals';

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

interface RightSidebarWidgetsProps {
  onNavigatePlanner: () => void;
}

export const RightSidebarWidgets: React.FC<RightSidebarWidgetsProps> = ({ onNavigatePlanner }) => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [streak, setStreak] = useState(0);

  const refresh = useCallback(() => {
    setTasks(readList<StudyTask>(TASKS_KEY).filter((task) => task && typeof task.id === 'string' && typeof task.subject === 'string' && typeof task.topic === 'string'));
    setGoals(readList<StudyGoal>(GOALS_KEY).filter((goal) => goal && typeof goal.id === 'string' && typeof goal.title === 'string' && typeof goal.subject === 'string'));
    setStreak(getCurrentStudyStreak());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  const todayTasks = useMemo(() => {
    const today = toLocalDateString();
    return tasks.filter((task) => task.date === today);
  }, [tasks]);
  const completedToday = todayTasks.filter((task) => task.completed === true).length;
  const activeGoal = goals.find((goal) => goal.completed !== true);
  const goalTarget = activeGoal ? Math.max(1, Number(activeGoal.targetSessions) || 4) : 0;
  const goalDone = activeGoal ? Math.max(0, Number(activeGoal.completedSessions) || 0) : 0;
  const goalPercent = activeGoal ? Math.min(100, Math.round((goalDone / goalTarget) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#17213D] flex items-center justify-center text-slate-400 shrink-0"><Flame className="w-6 h-6" /></div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Study Streak</p>
          <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">{streak} {streak === 1 ? 'day' : 'days'}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{streak > 0 ? 'Keep your daily momentum going' : 'Complete a study session to start'}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#132347] flex items-center justify-center text-blue-400 shrink-0"><Target className="w-5 h-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400 font-medium">Learning Goal</p>
            <h4 className="text-xs sm:text-[13px] font-semibold text-white mt-0.5 truncate">{activeGoal?.title ?? (goals.length ? 'All goals completed' : 'No goal set')}</h4>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-[#172544] overflow-hidden"><div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${activeGoal ? goalPercent : goals.length ? 100 : 0}%` }} /></div>
        <p className="mt-2 text-[11px] text-slate-500">{activeGoal ? `${goalDone}/${goalTarget} sessions · ${goalPercent}% complete` : goals.length ? 'Great work — you completed every saved goal.' : 'Add a goal in Study Planner to track progress.'}</p>
        <button type="button" onClick={onNavigatePlanner} className="mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300">View goals <ArrowRight className="inline h-3 w-3" /></button>
      </div>

      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#142240]">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /><h4 className="text-sm font-bold text-white tracking-tight">Today&apos;s Study Plan</h4></div>
          <button type="button" onClick={onNavigatePlanner} className="text-xs font-semibold text-blue-400 hover:text-blue-300">Open <ArrowRight className="inline h-3 w-3" /></button>
        </div>
        {todayTasks.length === 0 ? (
          <div className="flex flex-col items-center py-7 text-center">
            <Calendar className="h-6 w-6 text-slate-500" />
            <p className="mt-3 text-xs font-semibold text-slate-200">Nothing planned for today</p>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">Add a session to see your daily plan here.</p>
            <button type="button" onClick={onNavigatePlanner} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-200"><Plus size={13} /> Add a session</button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-[11px] text-slate-400">{completedToday}/{todayTasks.length} sessions completed</p>
            <div className="mt-2 flex flex-col gap-2">
              {todayTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-start gap-2 rounded-lg bg-[#101d37] px-3 py-2">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${task.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="min-w-0"><p className={`text-xs font-semibold truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>{task.subject}</p><p className="text-[11px] text-slate-500 truncate">{task.topic}{task.time ? ` · ${task.time}` : ''}</p></div>
                </div>
              ))}
              {todayTasks.length > 4 && <p className="text-[11px] text-slate-500">+{todayTasks.length - 4} more sessions</p>}
            </div>
            <button type="button" onClick={onNavigatePlanner} className="mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300">Manage study plan <ArrowRight className="inline h-3 w-3" /></button>
          </>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#162544] bg-gradient-to-br from-[#101B35] to-[#15172F] p-5 shadow-lg"><p className="text-sm font-bold text-white">One step at a time</p><p className="mt-2 text-[11px] leading-relaxed text-slate-400">Small, consistent study sessions help build lasting progress.</p></div>
    </div>
  );
};

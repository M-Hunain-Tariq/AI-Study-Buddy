'use client';

import React from 'react';
import { Zap, ChevronRight, CheckCircle2, Circle, Plus, Sigma, Atom, BookOpen, FlaskConical, Target } from 'lucide-react';
import { StudyGoal } from '@/types/study-planner';

interface StudyGoalsCardProps {
  goals: StudyGoal[];
  onToggleGoal: (goalId: string) => void;
  onCreateGoal: () => void;
  onViewAll?: () => void;
}

export const StudyGoalsCard: React.FC<StudyGoalsCardProps> = ({
  goals,
  onToggleGoal,
  onCreateGoal,
  onViewAll,
}) => {
  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Active highlighted goal
  const activeGoal = goals.find((g) => !g.completed) || goals[0];
  const activeGoalCompletedSessions = activeGoal?.completedSessions ?? (activeGoal?.completed ? (activeGoal?.targetSessions || 4) : 0);
  const activeGoalTargetSessions = activeGoal?.targetSessions || 4;
  const activeGoalPercent = Math.min(100, Math.round((activeGoalCompletedSessions / activeGoalTargetSessions) * 100));

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return Sigma;
      case 'physics':
        return Atom;
      case 'english':
        return BookOpen;
      case 'chemistry':
        return FlaskConical;
      default:
        return Zap;
    }
  };

  const getSubjectColorClasses = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
      case 'physics':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'english':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'chemistry':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
      default:
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/30 shadow-[0_20px_50px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.14)] p-6 sm:p-7 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Your Study Goals
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer group/link"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </button>
      </div>

      {goals.length > 0 ? (
        <>
          {/* Circular Progress & Focus Banner matching Image Reference */}
          <div className="flex items-center gap-4 py-4 px-2">
            {/* Circular Progress Ring */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#132345"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="url(#goalRingGrad)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * percentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="goalRingGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#2563EB" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-xs font-bold text-white leading-none">
                  {completedCount}/{totalCount}
                </span>
                <span className="text-[9px] text-slate-400 leading-tight mt-0.5">
                  Completed
                </span>
              </div>
            </div>

            {/* Priority Goal Mini Status */}
            {activeGoal && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {activeGoal.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {activeGoal.subject} • {activeGoalCompletedSessions}/{activeGoalTargetSessions} sessions
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-[#121B35] rounded-full overflow-hidden border border-[#1A2C52]">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeGoalPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300">
                    {activeGoalPercent}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Goal Items List */}
          <div className="divide-y divide-[#121F3B] mt-1">
            {goals.map((goal) => {
              const Icon = getSubjectIcon(goal.subject);
              const colorClass = getSubjectColorClasses(goal.subject);

              return (
                <div
                  key={goal.id}
                  className="py-3 flex items-center justify-between gap-3 group/goal hover:bg-[#0C1630]/40 px-2 -mx-2 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorClass} shadow-inner`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold tracking-tight truncate transition-colors ${
                          goal.completed ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {goal.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        Due: {goal.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Goal Completion Checkbox */}
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    aria-label={`Toggle goal ${goal.title}`}
                    className="p-1 text-slate-400 hover:text-teal-400 transition-transform active:scale-95 cursor-pointer shrink-0"
                  >
                    {goal.completed ? (
                      <div className="w-5 h-5 rounded-full bg-teal-500/25 border border-teal-500/80 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.6)]">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-teal-400/20" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#233866] hover:border-teal-400/80 flex items-center justify-center transition-colors">
                        <Circle className="w-3.5 h-3.5 text-transparent hover:text-teal-400/30" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Empty State matching user instructions */
        <div className="py-8 text-center flex flex-col items-center justify-center space-y-2 text-slate-400">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-white">No goals yet</p>
          <p className="text-xs text-slate-400 max-w-[220px]">
            Create a goal and start working toward it.
          </p>
          <button
            onClick={onCreateGoal}
            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      )}

      {/* Create New Goal Button */}
      {goals.length > 0 && (
        <button
          onClick={onCreateGoal}
          className="mt-4 w-full py-2 px-3 rounded-xl bg-[#0B1530] hover:bg-[#12224A] border border-[#192B50] hover:border-indigo-500/40 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-[0.99]"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Create New Goal</span>
        </button>
      )}
    </div>
  );
};

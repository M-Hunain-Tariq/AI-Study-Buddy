'use client';

import React from 'react';
import { Target, ChevronRight } from 'lucide-react';
import { useToast } from '../Toast';

interface GoalItem {
  id: string;
  title: string;
  percentage: number;
  progressDesc: string;
  strokeColor: string;
  textColor: string;
  glow: string;
}

const LEARNING_GOALS: GoalItem[] = [
  {
    id: 'g1',
    title: 'Complete Mathematics Syllabus',
    percentage: 68,
    progressDesc: '13/20 lessons',
    strokeColor: '#A855F7',
    textColor: 'text-purple-400',
    glow: 'drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]',
  },
  {
    id: 'g2',
    title: 'Improve Problem Solving Skills',
    percentage: 45,
    progressDesc: '9/20 practice sets',
    strokeColor: '#06B6D4',
    textColor: 'text-cyan-400',
    glow: 'drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]',
  },
  {
    id: 'g3',
    title: 'Get 90% in Exams',
    percentage: 32,
    progressDesc: '6/20 mock tests',
    strokeColor: '#10B981',
    textColor: 'text-emerald-400',
    glow: 'drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]',
  },
];

export const LearningGoalsCard: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 h-full min-h-[350px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Learning Goals
          </h3>
        </div>

        <button
          onClick={() => showToast('Opening comprehensive target goal manager...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* 3 Goals matching Image 1 */}
      <div className="divide-y divide-[#132242] mt-1">
        {LEARNING_GOALS.map((goal) => {
          const r = 16;
          const circ = 2 * Math.PI * r;
          const dash = (goal.percentage / 100) * circ;

          return (
            <div
              key={goal.id}
              onClick={() => showToast(`Goal: "${goal.title}" (${goal.percentage}% • ${goal.progressDesc})`, 'info')}
              className="group py-3 flex items-center gap-3 cursor-pointer hover:bg-[#0B1736]/40 px-1 rounded-xl transition-all"
            >
              {/* Mini Circular Progress Ring */}
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r={r}
                    stroke="#0E1B38"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={r}
                    stroke={goal.strokeColor}
                    strokeWidth="3.5"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    fill="none"
                    className={`${goal.glow} transition-all duration-700`}
                  />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-white">
                  {goal.percentage}%
                </span>
              </div>

              {/* Goal Title & Progress Subtitle */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold text-white tracking-tight truncate group-hover:text-blue-200 transition-colors">
                  {goal.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-bold ${goal.textColor} tabular-nums`}>
                    {goal.percentage}%
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {goal.progressDesc}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

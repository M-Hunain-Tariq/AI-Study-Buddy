'use client';

import React from 'react';
import { BookOpen, CheckSquare, Brain, Star } from 'lucide-react';

interface StatCardsProps {
  completedTasksCount?: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ completedTasksCount = 5 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Card 1: Total Study Time */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-3 sm:p-5 shadow-lg hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300 h-full min-h-[145px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#171F42] text-indigo-400 flex items-center justify-center shadow-inner">
            <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">Total Study Time</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              0h 00m
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">vs 7d</span>
          </div>
        </div>

        {/* Violet Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="violetGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,26 Q25,28 42,16 T78,18 T102,6 T120,4"
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,26 Q25,28 42,16 T78,18 T102,6 T120,4 L120,32 L0,32 Z"
              fill="url(#violetGrad1)"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Completed Tasks */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-3 sm:p-5 shadow-lg hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 h-full min-h-[145px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0D2E3E] text-cyan-400 flex items-center justify-center shadow-inner">
            <CheckSquare className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            Start
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">Tasks Done</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              0/0
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">—</span>
          </div>
        </div>

        {/* Cyan Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="cyanGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,28 Q20,24 45,22 T80,10 T105,12 T120,4"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,28 Q20,24 45,22 T80,10 T105,12 T120,4 L120,32 L0,32 Z"
              fill="url(#cyanGrad2)"
            />
          </svg>
        </div>
      </div>

      {/* Card 3: AI Questions Asked */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-3 sm:p-5 shadow-lg hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 h-full min-h-[145px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#281546] text-purple-400 flex items-center justify-center shadow-inner">
            <Brain className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">AI Questions</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              18
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">to begin</span>
          </div>
        </div>

        {/* Purple Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="purpleGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,22 Q30,12 55,20 T90,8 T110,14 T120,2"
              stroke="#A855F7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,22 Q30,12 55,20 T90,8 T110,14 T120,2 L120,32 L0,32 Z"
              fill="url(#purpleGrad3)"
            />
          </svg>
        </div>
      </div>

      {/* Card 4: Quiz Accuracy */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-3 sm:p-5 shadow-lg hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all duration-300 h-full min-h-[145px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#36270B] text-amber-400 flex items-center justify-center shadow-inner">
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 truncate">Quiz Accuracy</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              88%
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">No data</span>
          </div>
        </div>

        {/* Amber Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="amberGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,25 Q35,28 60,14 T95,16 T115,8 T120,6"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,25 Q35,28 60,14 T95,16 T115,8 T120,6 L120,32 L0,32 Z"
              fill="url(#amberGrad4)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

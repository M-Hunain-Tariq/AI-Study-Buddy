'use client';

import React from 'react';
import { BookOpen, CheckSquare, Brain, Star } from 'lucide-react';

interface StatCardsProps {
  completedTasksCount?: number;
  totalTasksCount?: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ completedTasksCount = 0, totalTasksCount = 0 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Card 1: Total Study Time */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 h-full min-h-[158px] sm:min-h-[165px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#171F42] text-blue-400 flex items-center justify-center shadow-inner">
            <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-xs font-semibold text-blue-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-xs sm:text-xs font-medium text-slate-400 truncate">Total Study Time</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              0h 00m
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">vs 7d</span>
          </div>
        </div>

        {/* Violet Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="blueGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,30 L120,30"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,26 Q25,28 42,16 T78,18 T102,6 T120,4 L120,32 L0,32 Z"
              fill="url(#blueGrad1)"
            />
          </svg>
        </div>
      </div>

      {/* Card 2: Completed Tasks */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300 h-full min-h-[158px] sm:min-h-[165px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0D2E3E] text-cyan-400 flex items-center justify-center shadow-inner">
            <CheckSquare className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-xs font-semibold text-blue-400 flex items-center gap-0.5">
            Start
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-xs sm:text-xs font-medium text-slate-400 truncate">Tasks Done</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              {completedTasksCount}/{totalTasksCount}
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">—</span>
          </div>
        </div>

        {/* Cyan Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="cyanGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,30 L120,30"
              stroke="#38BDF8"
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
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 h-full min-h-[158px] sm:min-h-[165px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#281546] text-blue-400 flex items-center justify-center shadow-inner">
            <Brain className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-xs font-semibold text-blue-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-xs sm:text-xs font-medium text-slate-400 truncate">AI Questions</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              0
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">No activity yet</span>
          </div>
        </div>

        {/* Purple Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="blueGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,30 L120,30"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,30 L120,30 L120,32 L0,32 Z"
              fill="url(#blueGrad3)"
            />
          </svg>
        </div>
      </div>

      {/* Card 4: Quiz Accuracy */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#0A132C] border border-[#162544] p-4 sm:p-5 shadow-lg hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all duration-300 h-full min-h-[158px] sm:min-h-[165px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#36270B] text-blue-400 flex items-center justify-center shadow-inner">
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-xs font-semibold text-blue-400 flex items-center gap-0.5">
            New
          </span>
        </div>

        <div className="mt-2 sm:mt-3.5">
          <p className="text-xs sm:text-xs font-medium text-slate-400 truncate">Quiz Accuracy</p>
          <div className="flex items-baseline justify-between mt-0.5 sm:mt-1">
            <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight tabular-nums">
              0%
            </h3>
            <span className="hidden sm:inline text-[11px] text-slate-400">No quiz data</span>
          </div>
        </div>

        {/* Amber Glowing Spline Chart */}
        <div className="mt-1.5 sm:mt-3 h-6 sm:h-10 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 32" fill="none">
            <defs>
              <linearGradient id="blueGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,30 L120,30"
              stroke="#60A5FA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0,30 L120,30 L120,32 L0,32 Z"
              fill="url(#blueGrad4)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

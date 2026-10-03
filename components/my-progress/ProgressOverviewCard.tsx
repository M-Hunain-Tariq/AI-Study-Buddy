'use client';

import React from 'react';
import { Home } from 'lucide-react';

interface ProgressOverviewCardProps {
  completedPct?: number;
  inProgressPct?: number;
  notStartedPct?: number;
}

export const ProgressOverviewCard: React.FC<ProgressOverviewCardProps> = ({
  completedPct = 68,
  inProgressPct = 22,
  notStartedPct = 10,
}) => {
  const circumference = 2 * Math.PI * 42;
  const completedDash = (completedPct / 100) * circumference;
  const inProgressDash = (inProgressPct / 100) * circumference;
  const notStartedDash = (notStartedPct / 100) * circumference;

  const inProgressOffset = -completedDash;
  const notStartedOffset = -(completedDash + inProgressDash);

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 h-full min-h-[220px] sm:min-h-[235px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-[#142345]">
        <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
          <Home className="w-4 h-4" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Your Progress Overview
        </h3>
      </div>

      {/* Donut Chart + Legend */}
      <div className="flex items-center justify-between gap-4 py-1">
        {/* Multi-Segment Glowing Donut Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-[#0E1B38]"
              strokeWidth="9"
              stroke="currentColor"
              fill="none"
            />

            {/* Segment 1: Completed (Cyan) */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#06B6D4"
              strokeWidth="9"
              strokeDasharray={`${completedDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.85)] transition-all duration-700"
            />

            {/* Segment 2: In Progress (Blue) */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#3B82F6"
              strokeWidth="9"
              strokeDasharray={`${inProgressDash} ${circumference}`}
              strokeDashoffset={inProgressOffset}
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.85)] transition-all duration-700"
            />

            {/* Segment 3: Not Started (Magenta) */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#D946EF"
              strokeWidth="9"
              strokeDasharray={`${notStartedDash} ${circumference}`}
              strokeDashoffset={notStartedOffset}
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(217,70,239,0.85)] transition-all duration-700"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              {completedPct}%
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-0.5">
              Overall<br />Progress
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 sm:space-y-2.5 min-w-0 pr-1">
          {/* Completed */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] shrink-0" />
              <span className="text-slate-300 font-medium truncate">Completed</span>
            </div>
            <span className="font-bold text-white tabular-nums">{completedPct}%</span>
          </div>

          {/* In Progress */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)] shrink-0" />
              <span className="text-slate-300 font-medium truncate">In Progress</span>
            </div>
            <span className="font-bold text-white tabular-nums">{inProgressPct}%</span>
          </div>

          {/* Not Started */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.9)] shrink-0" />
              <span className="text-slate-300 font-medium truncate">Not Started</span>
            </div>
            <span className="font-bold text-white tabular-nums">{notStartedPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

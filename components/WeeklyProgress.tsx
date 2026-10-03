'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';

export const WeeklyProgress: React.FC = () => {
  const daysData = [
    { day: 'Mon', height: 60 },
    { day: 'Tue', height: 75 },
    { day: 'Wed', height: 65 },
    { day: 'Thu', height: 90 },
    { day: 'Fri', height: 68 },
    { day: 'Sat', height: 82 },
    { day: 'Sun', height: 75 },
  ];

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300 h-full min-h-[300px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#142240]">
        <div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center shadow-inner">
          <BarChart2 className="w-4 h-4" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Weekly Progress
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        {/* Bar Chart (Left) matching Image 1 */}
        <div className="flex-1 flex items-end justify-between gap-2 h-32 pt-2">
          {daysData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full max-w-[18px] bg-[#0E1834] rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                <div
                  style={{ height: `${item.height}%` }}
                  className="w-full rounded-t-md bg-gradient-to-t from-[#2563EB] to-[#8B5CF6] shadow-[0_0_12px_rgba(59,130,246,0.4)] group-hover:brightness-125 transition-all"
                />
              </div>
              <span className="mt-2 text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Circular Gauge: 68% Overall Progress (Right) with glowing stroke matching Image 1 */}
        <div className="flex flex-col items-center justify-center pl-4 border-l border-[#142240] shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 72 72">
              <defs>
                <linearGradient id="progressGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="gaugeGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.6" />
                </filter>
              </defs>
              <circle
                cx="36"
                cy="36"
                r="30"
                className="stroke-[#0E1834]"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                stroke="url(#progressGrad1)"
                strokeWidth="6"
                strokeDasharray="188.4"
                strokeDashoffset={188.4 * (1 - 0.68)}
                strokeLinecap="round"
                fill="none"
                filter="url(#gaugeGlow)"
              />
            </svg>
            <span className="absolute text-base font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              68%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1.5">
            Overall Progress
          </span>
        </div>
      </div>
    </div>
  );
};

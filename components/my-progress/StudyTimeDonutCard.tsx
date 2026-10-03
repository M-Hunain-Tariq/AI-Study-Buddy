'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useToast } from '../Toast';

interface SubjectTime {
  name: string;
  hours: number;
  color: string;
  glow: string;
}

const SUBJECT_TIMES: SubjectTime[] = [
  { name: 'Mathematics', hours: 3.5, color: '#A855F7', glow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]' },
  { name: 'Physics', hours: 2.8, color: '#3B82F6', glow: 'shadow-[0_0_8px_rgba(59,130,246,0.8)]' },
  { name: 'Chemistry', hours: 2.1, color: '#14B8A6', glow: 'shadow-[0_0_8px_rgba(20,184,166,0.8)]' },
  { name: 'English', hours: 1.8, color: '#F59E0B', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.8)]' },
  { name: 'Computer Science', hours: 1.3, color: '#06B6D4', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.8)]' },
];

export const StudyTimeDonutCard: React.FC = () => {
  const { showToast } = useToast();
  const totalHours = 12.5;

  // Donut circumference for r=40
  const circumference = 2 * Math.PI * 40;

  // Pure functional calculation of strokeDash and offset
  const segments = SUBJECT_TIMES.map((sub, idx) => {
    const fraction = sub.hours / totalHours;
    const strokeDash = fraction * circumference;
    const priorHours = SUBJECT_TIMES.slice(0, idx).reduce((sum, item) => sum + item.hours, 0);
    const offset = -((priorHours / totalHours) * circumference);
    return { ...sub, strokeDash, offset };
  });

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 h-full min-h-[172px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Study Time
          </h3>
        </div>

        <button
          onClick={() => showToast('Viewing hourly study log across all subjects...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View Details →
        </button>
      </div>

      {/* Donut Chart + Subject Hours Legend */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Glowing Donut Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#0E1B38"
              strokeWidth="9"
              fill="none"
            />

            {/* Segments */}
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx="50"
                cy="50"
                r="40"
                stroke={seg.color}
                strokeWidth="9"
                strokeDasharray={`${seg.strokeDash} ${circumference}`}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                fill="none"
                style={{ filter: `drop-shadow(0 0 6px ${seg.color})` }}
                className="transition-all duration-700"
              />
            ))}
          </svg>

          {/* Center Hours Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              {totalHours}h
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-0.5">
              Total Study Time
            </span>
          </div>
        </div>

        {/* 5 Subjects Legend matching screenshot */}
        <div className="flex-1 space-y-1.5 min-w-0 pr-1">
          {SUBJECT_TIMES.map((sub) => (
            <div
              key={sub.name}
              onClick={() => showToast(`${sub.name}: ${sub.hours} hours logged this week`, 'info')}
              className="flex items-center justify-between text-xs cursor-pointer group hover:bg-[#0B1736]/40 p-1 rounded-lg transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  style={{ backgroundColor: sub.color }}
                  className={`w-2 h-2 rounded-full shrink-0 ${sub.glow}`}
                />
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                  {sub.name}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white tabular-nums pl-1">
                {sub.hours}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { BarChart3, ChevronRight } from 'lucide-react';
import { useToast } from '../Toast';

interface SubjectItem {
  id: string;
  name: string;
  symbol: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
  iconBg: string;
  barGradient: string;
  barGlow: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  {
    id: 'math',
    name: 'Mathematics',
    symbol: 'π',
    percentage: 85,
    completedCount: 17,
    totalCount: 20,
    iconBg: 'bg-[#2A1550] border-purple-500/40 text-purple-400',
    barGradient: 'from-purple-500 to-pink-500',
    barGlow: 'shadow-[0_0_10px_rgba(168,85,247,0.7)]',
  },
  {
    id: 'physics',
    name: 'Physics',
    symbol: '⚛',
    percentage: 65,
    completedCount: 13,
    totalCount: 20,
    iconBg: 'bg-[#11244E] border-blue-500/40 text-blue-400',
    barGradient: 'from-cyan-400 to-blue-500',
    barGlow: 'shadow-[0_0_10px_rgba(6,182,212,0.7)]',
  },
  {
    id: 'chem',
    name: 'Chemistry',
    symbol: '🧪',
    percentage: 58,
    completedCount: 11,
    totalCount: 19,
    iconBg: 'bg-[#0B2C38] border-teal-500/40 text-teal-400',
    barGradient: 'from-teal-400 to-emerald-500',
    barGlow: 'shadow-[0_0_10px_rgba(20,184,166,0.7)]',
  },
  {
    id: 'eng',
    name: 'English',
    symbol: '📖',
    percentage: 72,
    completedCount: 14,
    totalCount: 20,
    iconBg: 'bg-[#38260F] border-amber-500/40 text-amber-400',
    barGradient: 'from-amber-400 to-yellow-500',
    barGlow: 'shadow-[0_0_10px_rgba(245,158,11,0.7)]',
  },
  {
    id: 'cs',
    name: 'Computer Science',
    symbol: '</>',
    percentage: 48,
    completedCount: 9,
    totalCount: 19,
    iconBg: 'bg-[#0A2A38] border-cyan-500/40 text-cyan-400 font-mono font-bold text-xs',
    barGradient: 'from-cyan-400 to-sky-500',
    barGlow: 'shadow-[0_0_10px_rgba(34,211,238,0.7)]',
  },
];

export const SubjectProgressCard: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 h-full min-h-[350px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Subject Progress
          </h3>
        </div>

        <button
          onClick={() => showToast('Opening detailed subject syllabus analytics...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View Details →
        </button>
      </div>

      {/* 5 Subjects List matching Image 1 */}
      <div className="divide-y divide-[#132242] mt-1">
        {DEFAULT_SUBJECTS.map((sub) => (
          <div
            key={sub.id}
            onClick={() => showToast(`Selected ${sub.name}: ${sub.completedCount}/${sub.totalCount} lessons completed (${sub.percentage}%)`, 'info')}
            className="group py-2.5 flex items-center gap-3 cursor-pointer hover:bg-[#0B1736]/40 px-1 rounded-xl transition-all"
          >
            {/* Subject Squircle Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner shrink-0 ${sub.iconBg}`}>
              <span className="text-sm">{sub.symbol}</span>
            </div>

            {/* Title + Progress Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs sm:text-[13px] font-bold text-white tracking-tight truncate group-hover:text-blue-200 transition-colors">
                  {sub.name}
                </span>
                <span className="text-xs font-bold text-white tabular-nums">
                  {sub.percentage}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 rounded-full bg-[#0E1A38] overflow-hidden">
                <div
                  style={{ width: `${sub.percentage}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${sub.barGradient} ${sub.barGlow} transition-all duration-700`}
                />
              </div>
            </div>

            {/* Ratio (e.g., 17/20) + Chevron */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium tabular-nums">
                {sub.completedCount}/{sub.totalCount}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

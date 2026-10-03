'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StudyStreakCardProps {
  streakDays?: number;
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({ streakDays = 3 }) => {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#070D1E] border border-[#162544] hover:border-amber-500/40 shadow-[0_16px_40px_-8px_rgba(2,6,23,0.9),0_0_25px_-5px_rgba(245,158,11,0.15)] p-4 transition-all duration-300 flex items-center justify-between group">
      <div className="flex items-center gap-3.5">
        {/* Glowing Flame Badge matching reference */}
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0 group-hover:scale-105 transition-transform">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400/30 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
        </div>

        <div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">
            Study Streak
          </p>
          <p className="text-lg font-bold text-white tracking-tight leading-snug">
            {streakDays} days
          </p>
          <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-0.5">
            <span>Keep it up!</span>
            <span>🔥</span>
          </p>
        </div>
      </div>
    </div>
  );
};

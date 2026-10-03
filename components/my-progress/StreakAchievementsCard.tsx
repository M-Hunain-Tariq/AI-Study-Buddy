'use client';

import React from 'react';
import { Trophy, Flame, Check, BookOpen, Star, Lock } from 'lucide-react';
import { useToast } from '../Toast';

export const StreakAchievementsCard: React.FC = () => {
  const { showToast } = useToast();

  const weekDays = [
    { day: 'Mon', status: 'checked' },
    { day: 'Tue', status: 'checked' },
    { day: 'Wed', status: 'checked' },
    { day: 'Thu', status: 'checked' },
    { day: 'Fri', status: 'flame' },
    { day: 'Sat', status: 'empty' },
    { day: 'Sun', status: 'empty' },
  ];

  const badges = [
    // Row 1: 3 unlocked + 1 locked
    { id: 'b1', name: 'Knowledge Seeker', icon: BookOpen, unlocked: true, color: 'bg-blue-600/30 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]' },
    { id: 'b2', name: 'Rising Star', icon: Star, unlocked: true, color: 'bg-amber-500/30 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]' },
    { id: 'b3', name: 'Quiz Champion', icon: Trophy, unlocked: true, color: 'bg-yellow-500/30 border-yellow-400/40 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.4)]' },
    { id: 'b4', name: 'Master Mind', icon: Lock, unlocked: false, color: 'bg-[#0B1530] border-[#182C56] text-slate-500' },

    // Row 2: 4 locked badges
    { id: 'b5', name: 'Night Owl', icon: Lock, unlocked: false, color: 'bg-[#0B1530] border-[#182C56] text-slate-500' },
    { id: 'b6', name: 'Consistency King', icon: Lock, unlocked: false, color: 'bg-[#0B1530] border-[#182C56] text-slate-500' },
    { id: 'b7', name: 'Math Wizard', icon: Lock, unlocked: false, color: 'bg-[#0B1530] border-[#182C56] text-slate-500' },
    { id: 'b8', name: 'Ultimate Scholar', icon: Lock, unlocked: false, color: 'bg-[#0B1530] border-[#182C56] text-slate-500' },
  ];

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 h-full min-h-[172px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Streak & Achievements
          </h3>
        </div>

        <button
          onClick={() => showToast('Opening all 8 student achievement trophies...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* Split: Left Streak Stats + Right Badge Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 items-center">
        {/* Left: Streak Counter & Week Days */}
        <div className="space-y-3 sm:pr-4 sm:border-r border-[#142345]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#38260F] border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white leading-none">5</span>
                <span className="text-xs font-bold text-slate-300">Day Streak</span>
              </div>
              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                Keep it up! 🔥
              </p>
            </div>
          </div>

          {/* Week Tracker */}
          <div className="flex items-center justify-between pt-1">
            {weekDays.map((wd) => (
              <div key={wd.day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                    wd.status === 'checked'
                      ? 'bg-blue-600/30 border-blue-400 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      : wd.status === 'flame'
                      ? 'bg-amber-500/30 border-amber-400 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                      : 'bg-[#0B1530] border-[#182C56] text-transparent'
                  }`}
                >
                  {wd.status === 'checked' && <Check className="w-3 h-3 stroke-[3]" />}
                  {wd.status === 'flame' && <Flame className="w-3 h-3 fill-amber-400" />}
                </div>
                <span className="text-[9px] text-slate-400 font-medium">{wd.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Achievements Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Your Achievements</span>
            <span className="text-[11px] font-semibold text-blue-400">3/8 unlocked</span>
          </div>

          {/* 4x2 Badge Grid matching screenshot */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {badges.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  onClick={() =>
                    showToast(
                      b.unlocked
                        ? `Achievement Unlocked: "${b.name}" 🏆`
                        : `Locked: Complete more practice to unlock "${b.name}" 🔒`,
                      b.unlocked ? 'success' : 'info'
                    )
                  }
                  className={`group relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${b.color}`}
                  title={b.name}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

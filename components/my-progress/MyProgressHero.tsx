'use client';

import React from 'react';
import Image from 'next/image';
import { Home, Zap, Flame, Clock, Target } from 'lucide-react';

interface MyProgressHeroProps {
  overallProgress?: number;
  streakDays?: number;
  studyHours?: number;
  goalsAchieved?: string;
}

export const MyProgressHero: React.FC<MyProgressHeroProps> = ({
  overallProgress = 68,
  streakDays = 5,
  studyHours = 12.5,
  goalsAchieved = '3/5',
}) => {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_35px_rgba(37,99,235,0.15)] transition-all duration-300 h-full min-h-[220px] sm:min-h-[235px] flex items-center group">
      {/* 1. CRYSTAL-CLEAR 3D ROBOT WITH LAPTOP & ILLUMINATED FOLIAGE */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/study_planner_robot_hero.jpg"
          alt="3D AI Robot student learning with laptop and glowing blue plants"
          fill
          unoptimized
          priority
          sizes="(max-width: 1536px) 100vw, 1500px"
          className="object-cover object-right sm:object-[85%_center] opacity-85 transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
          referrerPolicy="no-referrer"
        />

        {/* 2. TEXT-CONTRAST SCRIM */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[0%] lg:w-[60%] bg-gradient-to-r from-[#070F28] via-[#070F28]/95 sm:via-[#070F28]/90 to-transparent pointer-events-none" />
      </div>

      {/* Inner subtle glow border reflection */}
      <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none z-10" />

      {/* "Better Than Yesterday" neon cursive overlay with crown matching Image 1 */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-28 lg:right-32 z-20 flex flex-col items-center rotate-3 pointer-events-none select-none">
        <span className="text-[#38BDF8] text-xs drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] -mb-1 animate-pulse">
          👑
        </span>
        <span className="font-serif italic text-[#38BDF8] text-xs sm:text-sm lg:text-base font-bold drop-shadow-[0_0_12px_rgba(56,189,248,0.9)] tracking-wide">
          Better
        </span>
        <span className="font-serif italic text-[#67E8F9] text-xs sm:text-sm lg:text-base font-bold drop-shadow-[0_0_12px_rgba(103,232,249,0.9)] -mt-1 tracking-wide">
          Than
        </span>
        <span className="font-serif italic text-[#A5F3FC] text-xs sm:text-sm lg:text-base font-bold drop-shadow-[0_0_12px_rgba(165,243,252,0.9)] -mt-1 tracking-wide">
          Yesterday
        </span>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20 w-full max-w-2xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-3 sm:space-y-4">
        {/* Top Badge: "My Progress" matching screenshot */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0F224D]/90 border border-[#22448A] text-xs font-semibold text-blue-300 w-fit shadow-[0_0_12px_rgba(37,99,235,0.3)]">
          <Home className="w-3.5 h-3.5 text-blue-400" />
          <span>My Progress</span>
        </div>

        {/* Heading: Track Your Learning Journey */}
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight">
            Track Your{' '}
            <span className="text-[#22D3EE] drop-shadow-[0_0_18px_rgba(34,211,238,0.55)]">
              Learning
            </span>{' '}
            <span className="text-[#C084FC] drop-shadow-[0_0_18px_rgba(192,132,252,0.55)]">
              Journey
            </span>
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-300 font-normal mt-1 max-w-md">
            See your progress, stay motivated, and achieve your goals!
          </p>
        </div>

        {/* 4 Stat Pills matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 w-full">
          {/* Pill 1: Overall Progress */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#091533]/85 border border-[#182F5E] shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Overall Progress</p>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {overallProgress}%
              </p>
            </div>
          </div>

          {/* Pill 2: Study Streak */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#091533]/85 border border-[#182F5E] shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Study Streak</p>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {streakDays} days
              </p>
            </div>
          </div>

          {/* Pill 3: Total Study Time */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#091533]/85 border border-[#182F5E] shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Total Study Time</p>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {studyHours} hours
              </p>
            </div>
          </div>

          {/* Pill 4: Goals Achieved */}
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#091533]/85 border border-[#182F5E] shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 truncate">Goals Achieved</p>
              <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {goalsAchieved}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { MyProgressHero } from './MyProgressHero';
import { ProgressOverviewCard } from './ProgressOverviewCard';
import { SubjectProgressCard } from './SubjectProgressCard';
import { RecentActivityCard } from './RecentActivityCard';
import { WeeklyProgressChartCard } from './WeeklyProgressChartCard';
import { StudyTimeDonutCard } from './StudyTimeDonutCard';
import { StreakAchievementsCard } from './StreakAchievementsCard';
import { LearningGoalsCard } from './LearningGoalsCard';
import { MountainMotivationCard } from './MountainMotivationCard';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

export const MyProgressWorkspace: React.FC = () => {
  const [mobileProgressTab, setMobileProgressTab] = useState<'overview' | 'charts' | 'goals'>('overview');

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-5 overflow-x-hidden">
      {/* ========================================================
          MOBILE VIEW SWITCHER (Only visible on screens < 1024px)
          Prevents huge 4000px vertical scroll on phones!
          ======================================================== */}
      <div className="lg:hidden flex items-center p-1 rounded-xl bg-[#070F24] border border-[#16274D] shadow-inner mb-2">
        <button
          onClick={() => setMobileProgressTab('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileProgressTab === 'overview'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setMobileProgressTab('charts')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileProgressTab === 'charts'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Charts & Time</span>
        </button>

        <button
          onClick={() => setMobileProgressTab('goals')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileProgressTab === 'goals'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Goals</span>
        </button>
      </div>

      {/* ========================================================
          TOP ROW: HERO (8 COLS) + OVERVIEW DONUT CARD (4 COLS)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left Hero (8 cols out of 12) */}
        <div className={`lg:col-span-8 h-full ${mobileProgressTab !== 'overview' ? 'hidden lg:block' : 'block'}`}>
          <div className="h-full min-h-[235px]">
            <MyProgressHero
              overallProgress={68}
              streakDays={5}
              studyHours={12.5}
              goalsAchieved="3/5"
            />
          </div>
        </div>

        {/* Right Overview Donut Card (4 cols out of 12) */}
        <div className={`lg:col-span-4 h-full ${mobileProgressTab !== 'overview' ? 'hidden lg:block' : 'block'}`}>
          <div className="h-full min-h-[235px]">
            <ProgressOverviewCard
              completedPct={68}
              inProgressPct={22}
              notStartedPct={10}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM 3-COLUMN BALANCED GRID matching Image 1
          Column 1: Subject Progress + Recent Activity
          Column 2: Weekly Progress + (Study Time & Streak & Achievements)
          Column 3: Learning Goals + Mountain Motivation Card
          All 3 columns now have identical, pixel-aligned heights!
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {/* ==================== COLUMN 1 (Left) ==================== */}
        <div
          className={`flex-col space-y-4 sm:space-y-5 h-full ${
            mobileProgressTab !== 'overview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 1. Subject Progress (Row 1: min-h-[350px]) */}
          <div className="h-[350px]">
            <SubjectProgressCard />
          </div>

          {/* 2. Recent Activity (Row 2: min-h-[360px]) */}
          <div className="h-[360px]">
            <RecentActivityCard />
          </div>
        </div>

        {/* ==================== COLUMN 2 (Middle) ==================== */}
        <div
          className={`flex-col space-y-4 sm:space-y-5 h-full ${
            mobileProgressTab !== 'charts' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 1. Weekly Progress Spline Wave Chart (Row 1: min-h-[350px]) */}
          <div className="h-[350px]">
            <WeeklyProgressChartCard />
          </div>

          {/* 2. Combined Study Time & Streak (Row 2: min-h-[360px]) */}
          <div className="h-[360px] flex flex-col justify-between gap-3 sm:gap-3.5">
            <div className="h-[172px]">
              <StudyTimeDonutCard />
            </div>
            <div className="h-[172px]">
              <StreakAchievementsCard />
            </div>
          </div>
        </div>

        {/* ==================== COLUMN 3 (Right) ==================== */}
        <div
          className={`flex-col space-y-4 sm:space-y-5 h-full ${
            mobileProgressTab !== 'goals' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* 1. Learning Goals (Row 1: min-h-[350px]) */}
          <div className="h-[350px]">
            <LearningGoalsCard />
          </div>

          {/* 2. Mountain Motivation Card (Row 2: min-h-[360px]) */}
          <div className="h-[360px]">
            <MountainMotivationCard />
          </div>
        </div>
      </div>
    </div>
  );
};

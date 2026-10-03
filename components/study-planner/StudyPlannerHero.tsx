'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap, Sparkles, Target, Clock, CheckCircle2 } from 'lucide-react';

interface StudyPlannerHeroProps {
  onOpenAiPlanner: () => void;
  onOpenCreateGoal: () => void;
  onManageSchedule: () => void;
  onBuildHabits: () => void;
}

export const StudyPlannerHero: React.FC<StudyPlannerHeroProps> = ({
  onOpenAiPlanner,
  onOpenCreateGoal,
  onManageSchedule,
  onBuildHabits,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-[#070D1E] border border-[#1A284A] hover:border-blue-500/40 shadow-[0_24px_60px_rgba(2,6,23,0.9),0_0_45px_rgba(37,99,235,0.18)] transition-all duration-300 min-h-[360px] sm:min-h-[380px] lg:min-h-[400px] flex flex-col justify-between group">
      {/* 1. CRYSTAL-CLEAR 3D ROBOT PLANNER SCENE (Right side stage with unoptimized to ensure 100% reliable load) */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[52%] lg:w-[50%] h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/study_planner_robot_hero.jpg"
          alt="Friendly 3D AI Robot student assistant planning study schedule with laptop and calendar"
          fill
          priority
          unoptimized
          quality={100}
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover object-center sm:object-right transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />

        {/* Soft seam fade between robot picture and text container */}
        <div className="absolute inset-y-0 left-0 w-28 sm:w-36 bg-gradient-to-r from-[#070D1E] to-transparent pointer-events-none" />

        {/* Bottom subtle edge blend */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#070D1E]/70 to-transparent pointer-events-none" />
      </div>

      {/* Inner subtle glow border reflection */}
      <div className="absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/10 pointer-events-none z-10" />

      {/* FOREGROUND CONTENT: Left half dedicated container */}
      <div className="relative z-20 w-full sm:w-[56%] lg:w-[54%] p-6 sm:p-7 lg:p-8 flex flex-col justify-between h-full space-y-6">
        <div className="space-y-3">
          {/* 1. Study Planner Badge matching screenshot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16274E]/90 border border-[#2B4379] text-xs font-semibold text-blue-300 w-fit shadow-inner">
            <GraduationCap className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            <span>Study Planner</span>
          </div>

          {/* 2. Main Large Heading with gradient on "Achieve Bigger" */}
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold text-white tracking-tight leading-[1.15]">
            Plan Smarter,{' '}
            <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]">
              Achieve Bigger
            </span>
          </h2>

          {/* 3. Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
            Set your goals, create a study plan, and let AI help you stay on track. Your success is just a plan away!
          </p>
        </div>

        {/* 4. Quick Action Chips: 4 buttons matching reference image */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-2.5 pt-2 w-full">
          {/* Action 1: Create with AI */}
          <button
            onClick={onOpenAiPlanner}
            className="group/chip flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#0B1530]/90 hover:bg-[#12224A] border border-[#182B4F] hover:border-blue-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 min-w-0 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-blue-400 bg-blue-500/20 border-blue-500/30 shadow-inner group-hover/chip:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white tracking-tight leading-tight group-hover/chip:text-blue-200 transition-colors whitespace-normal">
                Create with AI
              </p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Smart study plans
              </p>
            </div>
          </button>

          {/* Action 2: Set Goals */}
          <button
            onClick={onOpenCreateGoal}
            className="group/chip flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#0B1530]/90 hover:bg-[#12224A] border border-[#182B4F] hover:border-purple-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 min-w-0 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-purple-400 bg-purple-500/20 border-purple-500/30 shadow-inner group-hover/chip:scale-105 transition-transform">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white tracking-tight leading-tight group-hover/chip:text-purple-200 transition-colors whitespace-normal">
                Set Goals
              </p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Track your progress
              </p>
            </div>
          </button>

          {/* Action 3: Manage Schedule */}
          <button
            onClick={onManageSchedule}
            className="group/chip flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#0B1530]/90 hover:bg-[#12224A] border border-[#182B4F] hover:border-indigo-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(99,102,241,0.35)] hover:-translate-y-0.5 min-w-0 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-indigo-400 bg-indigo-500/20 border-indigo-500/30 shadow-inner group-hover/chip:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white tracking-tight leading-tight group-hover/chip:text-indigo-200 transition-colors whitespace-normal">
                Manage Schedule
              </p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Stay organized
              </p>
            </div>
          </button>

          {/* Action 4: Build Habits */}
          <button
            onClick={onBuildHabits}
            className="group/chip flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-[#0B1530]/90 hover:bg-[#12224A] border border-[#182B4F] hover:border-teal-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_18px_rgba(20,184,166,0.35)] hover:-translate-y-0.5 min-w-0 backdrop-blur-sm"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-teal-400 bg-teal-500/20 border-teal-500/30 shadow-inner group-hover/chip:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white tracking-tight leading-tight group-hover/chip:text-teal-200 transition-colors whitespace-normal">
                Build Habits
              </p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                Be consistent
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

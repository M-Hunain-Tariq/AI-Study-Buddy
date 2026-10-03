'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Flame,
  Target,
  Calendar,
  Check,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { StudyPlanItem } from '@/types/dashboard';
import { useToast } from './Toast';

export const RightSidebarWidgets: React.FC = () => {
  const { showToast } = useToast();

  // Study Plan state matching Image 1
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([
    { id: '1', subject: 'Mathematics', duration: '60 min', completed: true },
    { id: '2', subject: 'Physics', duration: '45 min', completed: false },
    { id: '3', subject: 'English', duration: '30 min', completed: false },
    { id: '4', subject: 'Chemistry', duration: '30 min', completed: false },
  ]);

  const togglePlanItem = (id: string) => {
    const target = studyPlan.find((item) => item.id === id);
    if (!target) return;
    const next = !target.completed;
    setStudyPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: next } : item))
    );
    showToast(
      next
        ? `Completed ${target.subject} study session! 🎉`
        : `Marked ${target.subject} as pending`,
      next ? 'success' : 'info'
    );
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* 1. Study Streak Card matching Image 1 */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#3B2516] flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Study Streak</p>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-0.5">
              3 days
            </h4>
            <p className="text-[11px] text-amber-400 font-medium mt-0.5">
              Keep it up! 🔥
            </p>
          </div>
        </div>
      </div>

      {/* 2. Today's Goal Card matching Image 1 */}
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#132347] flex items-center justify-center text-blue-400 shadow-inner shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Today&apos;s Goal</p>
              <h4 className="text-xs sm:text-[13px] font-semibold text-white mt-0.5">
                Complete 2 study tasks
              </h4>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">
            1 / 2
          </span>
        </div>

        {/* 50% Glowing Progress Bar matching Image 1 */}
        <div className="mt-3.5">
          <div className="h-2 w-full bg-[#0E1834] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Today's Study Plan Card matching Image 1 */}
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-[#142240]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Today&apos;s Study Plan
            </h4>
          </div>

          <button
            onClick={() => showToast('Full calendar schedule in Step 3', 'info')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-2.5">Mon, 26 Aug 2025</p>

        <div className="mt-2 divide-y divide-[#142240] space-y-1">
          {studyPlan.map((item, idx) => {
            const ringBorder =
              idx === 1
                ? 'border-[#3B82F6]'
                : idx === 2
                ? 'border-[#6366F1]'
                : 'border-[#8B5CF6]';

            return (
              <div
                key={item.id}
                onClick={() => togglePlanItem(item.id)}
                className="group cursor-pointer flex items-center justify-between py-2 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlanItem(item.id);
                    }}
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.completed
                        ? 'bg-[#2563EB] text-white shadow-[0_0_8px_rgba(37,99,235,0.7)]'
                        : `border-2 ${ringBorder} bg-transparent`
                    }`}
                    aria-label={`Toggle ${item.subject} study plan`}
                  >
                    {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold transition-colors truncate ${
                        item.completed
                          ? 'text-slate-300'
                          : 'text-white'
                      }`}
                    >
                      {item.subject}
                    </p>
                    <p className="text-[10px] text-slate-400 tabular-nums">
                      {item.duration}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast(`Options for ${item.subject}`, 'info');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                  aria-label={`Options for ${item.subject}`}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Motivation Card with mountain peak & summit flag matching Image 1 */}
      <div className="relative overflow-hidden rounded-2xl border border-[#162544] hover:border-[#243B6B] min-h-[235px] flex flex-col justify-end p-5 shadow-lg group">
        <Image
          src="/images/motivation_mountain_exact.jpg"
          alt="Inspiring mountain night landscape with summit flag"
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Dark contrast scrim matching Image 1 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D20] via-[#060D20]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <h4 className="text-sm font-bold text-white tracking-tight">
            You&apos;re doing great!
          </h4>

          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
            Every small step counts. Keep going, you&apos;re closer to your goals than you think!
          </p>

          <button
            onClick={() => showToast('Keep up the brilliant momentum! You got this! 🚀', 'success')}
            className="mt-1.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white text-xs font-semibold shadow-[0_0_18px_rgba(79,70,229,0.55)] hover:shadow-[0_0_25px_rgba(79,70,229,0.75)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>View Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Zap, BookOpen, Brain, FileText, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '../Toast';

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Completed 2nd chapter of Physics',
    subtitle: 'Physics • Chapter 2 - Motion and Forces',
    timeAgo: '2 hours ago',
    icon: BookOpen,
    iconClass: 'bg-[#2A1550] border-purple-500/30 text-purple-400',
  },
  {
    id: 'act-2',
    title: 'Solved a quiz in Mathematics',
    subtitle: 'Mathematics • Algebra Quiz',
    timeAgo: '4 hours ago',
    icon: Brain,
    iconClass: 'bg-[#11244E] border-blue-500/30 text-blue-400',
  },
  {
    id: 'act-3',
    title: 'Added new note',
    subtitle: 'Chemistry • Organic Chemistry',
    timeAgo: '6 hours ago',
    icon: FileText,
    iconClass: 'bg-[#0B2C38] border-teal-500/30 text-teal-400',
  },
  {
    id: 'act-4',
    title: 'Updated study plan',
    subtitle: 'Weekly Plan • 3 sessions completed',
    timeAgo: '1 day ago',
    icon: Calendar,
    iconClass: 'bg-[#38260F] border-amber-500/30 text-amber-400',
  },
  {
    id: 'act-5',
    title: 'Achieved daily goal',
    subtitle: 'Study streak • 5 days',
    timeAgo: '1 day ago',
    icon: CheckCircle,
    iconClass: 'bg-[#0A2E22] border-emerald-500/30 text-emerald-400',
  },
];

export const RecentActivityCard: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 h-full min-h-[360px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Zap className="w-4 h-4 fill-blue-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Recent Activity
          </h3>
        </div>

        <button
          onClick={() => showToast('Displaying complete 30-day activity log...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* 5 Activity Rows matching Image 1 */}
      <div className="divide-y divide-[#132242] mt-1">
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={() => showToast(`Activity: "${act.title}" (${act.timeAgo})`, 'info')}
              className="group py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#0B1736]/40 px-1 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Icon Squircle */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner shrink-0 ${act.iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-white tracking-tight truncate group-hover:text-blue-200 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                {act.timeAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

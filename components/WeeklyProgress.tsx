'use client';

import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { calculateWeeklyActivity, type WeeklyActivityDay } from '@/lib/dashboard-stats';

export const WeeklyProgress: React.FC = () => {
  const [days, setDays] = useState<WeeklyActivityDay[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('study_planner_tasks');
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      setDays(calculateWeeklyActivity(parsed));
    } catch {
      // Keep the empty weekly state when local storage is unavailable or malformed.
    }
  }, []);

  const activeDays = days.filter((day) => day.minutes > 0).length;
  const maxMinutes = Math.max(1, ...days.map((day) => day.minutes));
  const percentage = Math.round((activeDays / 7) * 100);

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg flex flex-col transition-all duration-300 h-full min-h-[320px]">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#142240]">
        <div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center"><BarChart2 className="w-4 h-4" /></div>
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Weekly Progress</h3>
      </div>
      <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full p-[6px] text-xl font-extrabold text-white" style={{ background: `conic-gradient(#3b82f6 ${percentage * 3.6}deg, #172544 0deg)` }}>
          <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0A132C]">{percentage}%</span>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-200">{activeDays ? `${activeDays} of 7 days active` : 'No activity yet'}</p>
        <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400">Completed planner sessions from the last seven days.</p>
        <div className="mt-5 flex w-full items-end justify-around gap-2">
          {days.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-2" title={`${day.label}: ${day.minutes} minutes`}>
              <div className="flex h-9 w-4 items-end rounded-full bg-[#172544] overflow-hidden">
                <div className="w-full rounded-full bg-blue-500" style={{ height: `${day.minutes ? Math.max(12, (day.minutes / maxMinutes) * 100) : 0}%` }} />
              </div>
              <span className="text-[10px] text-slate-500">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

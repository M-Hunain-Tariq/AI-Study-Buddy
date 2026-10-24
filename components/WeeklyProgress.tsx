'use client';

import React from 'react';
import { BarChart2 } from 'lucide-react';

export const WeeklyProgress: React.FC = () => (
  <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg flex flex-col transition-all duration-300 h-full min-h-[320px]">
    <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#142240]"><div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center"><BarChart2 className="w-4 h-4" /></div><h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Weekly Progress</h3></div>
    <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center"><div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-[#172544] text-xl font-extrabold text-white">0%</div><p className="mt-4 text-sm font-semibold text-slate-200">No activity yet</p><p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400">Your chart will fill in after you start studying.</p><div className="mt-5 flex w-full items-end justify-around gap-2">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <div key={day} className="flex flex-col items-center gap-2"><div className="h-1 w-4 rounded-full bg-[#172544]" /><span className="text-[10px] text-slate-500">{day}</span></div>)}</div></div>
  </div>
);

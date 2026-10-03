'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useToast } from '../Toast';

interface DayPoint {
  day: string;
  pct: number;
  x: number;
  y: number;
}

const DAYS_DATA: DayPoint[] = [
  { day: 'Mon', pct: 48, x: 20, y: 78 },
  { day: 'Tue', pct: 78, x: 70, y: 33 },
  { day: 'Wed', pct: 62, x: 120, y: 57 },
  { day: 'Thu', pct: 48, x: 170, y: 78 },
  { day: 'Fri', pct: 66, x: 220, y: 51 },
  { day: 'Sat', pct: 52, x: 270, y: 72 },
  { day: 'Sun', pct: 72, x: 320, y: 42 },
];

export const WeeklyProgressChartCard: React.FC = () => {
  const { showToast } = useToast();
  const [activeDay, setActiveDay] = useState<DayPoint>(DAYS_DATA[1]); // Default to Tue (78%) matching screenshot

  const splinePath = "M 20,78 C 45,55 50,33 70,33 C 90,33 100,57 120,57 C 140,57 150,78 170,78 C 190,78 200,51 220,51 C 240,51 250,72 270,72 C 290,72 305,48 320,42";
  const areaPath = `${splinePath} L 320,135 L 20,135 Z`;

  return (
    <div className="rounded-[24px] bg-[#070F28] border border-[#1A2C59] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_30px_rgba(37,99,235,0.12)] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 h-full min-h-[350px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#142345]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Weekly Progress
          </h3>
        </div>

        <button
          onClick={() => showToast('Opening weekly study efficiency report...', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          View Details →
        </button>
      </div>

      {/* Chart Canvas with Y-Axis and Spline Curve */}
      <div className="relative mt-2 pt-2">
        <div className="flex items-stretch gap-2">
          {/* Y Axis percentage labels matching Image 1 */}
          <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium py-1 shrink-0 h-[150px] select-none text-right w-8">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* SVG Wave Chart Container */}
          <div className="relative flex-1 h-[150px] w-full">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 340 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="waveStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="25%" stopColor="#06B6D4" />
                  <stop offset="70%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="10" y1="5" x2="330" y2="5" stroke="#132242" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="10" y1="37" x2="330" y2="37" stroke="#132242" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="10" y1="70" x2="330" y2="70" stroke="#132242" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="10" y1="102" x2="330" y2="102" stroke="#132242" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="10" y1="135" x2="330" y2="135" stroke="#162852" strokeWidth="1" />

              {/* Shaded Area Under Curve */}
              <path d={areaPath} fill="url(#waveAreaGrad)" />

              {/* Glowing Spline Stroke */}
              <path
                d={splinePath}
                fill="none"
                stroke="url(#waveStrokeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]"
              />

              {/* Data Points */}
              {DAYS_DATA.map((p) => {
                const isActive = activeDay.day === p.day;
                return (
                  <g key={p.day} className="cursor-pointer" onClick={() => setActiveDay(p)}>
                    {isActive && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="#06B6D4"
                        fillOpacity="0.3"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? '5' : '3.5'}
                      fill={isActive ? '#FFFFFF' : '#06B6D4'}
                      stroke={isActive ? '#06B6D4' : '#070F28'}
                      strokeWidth="2"
                      className="drop-shadow-[0_0_6px_rgba(6,182,212,0.9)] transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Active Floating Tooltip */}
            <div
              style={{
                left: `${(activeDay.x / 340) * 100}%`,
                top: `${(activeDay.y / 150) * 100}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-[135%] z-20 pointer-events-none transition-all duration-300"
            >
              <div className="px-2.5 py-1 rounded-xl bg-[#091638]/95 border border-[#214385] shadow-[0_0_15px_rgba(37,99,235,0.4)] flex flex-col items-center backdrop-blur-md">
                <span className="text-[10px] text-slate-300 font-medium leading-none">
                  {activeDay.day}
                </span>
                <span className="text-xs font-bold text-white leading-tight mt-0.5 tabular-nums">
                  {activeDay.pct}%
                </span>
                <div className="w-1.5 h-1.5 bg-[#091638] border-b border-r border-[#214385] rotate-45 -mb-1 mt-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Days of Week Bottom Axis */}
        <div className="flex justify-between pl-10 pr-2 pt-1 text-[11px] text-slate-400 font-medium">
          {DAYS_DATA.map((p) => {
            const isActive = activeDay.day === p.day;
            return (
              <button
                key={p.day}
                onClick={() => {
                  setActiveDay(p);
                  showToast(`${p.day}: ${p.pct}% completion rate`, 'info');
                }}
                className={`transition-colors cursor-pointer ${
                  isActive ? 'text-cyan-400 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]' : 'hover:text-white'
                }`}
              >
                {p.day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

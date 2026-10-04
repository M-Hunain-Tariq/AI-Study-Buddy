'use client';

import React from 'react';
import { Calendar, Clock, ChevronRight, Sigma, Atom, BookOpen, FlaskConical, RotateCcw, Plus } from 'lucide-react';
import { StudyTask } from '@/types/study-planner';

interface WeeklyScheduleCardProps {
  tasks: StudyTask[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onViewCalendar?: () => void;
  onSelectSession?: (subject: string) => void;
  onAddTaskForDate?: (date: string) => void;
}

export const WeeklyScheduleCard: React.FC<WeeklyScheduleCardProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onViewCalendar,
  onSelectSession,
  onAddTaskForDate,
}) => {
  const monday = React.useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d;
  }, []);

  const days = React.useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      dayShort: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d),
      dateNum: d.getDate(),
      dateFull: d.toISOString().slice(0, 10),
      isToday: d.toDateString() === new Date().toDateString(),
      targetMinutes: [240, 210, 240, 200, 180, 240, 120][i],
    };
  }), [monday]);

  const dayTasks = tasks.filter((t) => (t.date || days[0].dateFull) === selectedDate);
  const currentDayInfo = days.find((d) => d.dateFull === selectedDate) || days[0];

  const totalStudyMinutes = dayTasks.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  const targetMinutes = currentDayInfo.targetMinutes;
  const percentage = targetMinutes > 0 ? Math.min(100, Math.round((totalStudyMinutes / targetMinutes) * 100)) : 0;

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return Sigma;
      case 'physics':
        return Atom;
      case 'english':
        return BookOpen;
      case 'chemistry':
        return FlaskConical;
      default:
        return Clock;
    }
  };

  const getSubjectColorClasses = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'physics':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'english':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'chemistry':
        return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
      default:
        return 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30';
    }
  };

  const getSubjectGradient = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
      case 'math':
      case 'maths':
        return 'from-blue-500 to-cyan-400';
      case 'physics':
        return 'from-purple-500 to-indigo-400';
      case 'english':
        return 'from-amber-500 to-orange-400';
      case 'chemistry':
        return 'from-teal-400 to-emerald-400';
      default:
        return 'from-indigo-500 to-blue-400';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/30 shadow-[0_20px_50px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.14)] p-4 sm:p-7 transition-all duration-300 flex flex-col justify-between group h-full min-h-[440px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142240]">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Weekly Schedule
          </h3>
          <button
            onClick={onViewCalendar}
            className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer group/link"
          >
            <span>View Calendar</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </button>
        </div>

        {/* 7-Day Selector Pills matching reference image */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 my-4">
          {days.map((day) => {
            const isSelected = selectedDate === day.dateFull;
            return (
              <button
                key={day.dateFull}
                onClick={() => onSelectDate(day.dateFull)}
                className={`flex flex-col items-center justify-center py-2 px-0.5 sm:px-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2563EB] to-[#4F46E5] text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-[1.03] ring-1 ring-blue-400/50'
                    : 'bg-[#0B1530] text-slate-400 hover:text-slate-200 hover:bg-[#112046] border border-[#162547]'
                }`}
              >
                <span className={`text-[10px] font-medium uppercase tracking-tight ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {day.dayShort}
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-tight mt-0.5">
                  {day.dateNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sessions for Selected Day List */}
        <div className="space-y-2 mt-2">
          {dayTasks.length > 0 ? (
            dayTasks.map((task) => {
              const Icon = getSubjectIcon(task.subject);
              const colorClass = getSubjectColorClasses(task.subject);
              const gradient = getSubjectGradient(task.subject);
              const progressWidth = task.completed ? 100 : 50;

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectSession?.(task.subject)}
                  className="flex items-center justify-between gap-2.5 sm:gap-3 p-2 rounded-xl hover:bg-[#0B1530]/60 transition-colors cursor-pointer group/session"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${colorClass} shadow-inner`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white tracking-tight truncate">
                        {task.subject}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {task.durationMinutes} min
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar in center matching reference image */}
                  <div className="flex-1 min-w-[50px] max-w-[110px] sm:max-w-[160px] h-2 bg-[#121B35] rounded-full overflow-hidden border border-[#1A2C52]">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>

                  <div className="text-slate-500 group-hover/session:text-slate-300 transition-colors shrink-0 pl-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-[#162547] rounded-xl p-4">
              <p>No study sessions scheduled for this day.</p>
              {onAddTaskForDate && (
                <button
                  onClick={() => onAddTaskForDate(selectedDate)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/30 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Session</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stat Card: Total Study Time with dynamically calculated SVG progress ring */}
      <div className="mt-4 pt-3 border-t border-[#121F3B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Total Study Time
            </p>
            <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {totalStudyMinutes} min{' '}
              <span className="text-[11px] text-slate-400 font-normal">
                / {targetMinutes} min
              </span>
            </p>
          </div>
        </div>

        {/* Circular Ring Gauge dynamically calculated */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="#132345"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="url(#studyTimeGrad)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={113}
              strokeDashoffset={113 - (113 * percentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="studyTimeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#38BDF8" />
                <stop offset="0.6" stopColor="#60A5FA" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-[10px] font-bold text-white">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

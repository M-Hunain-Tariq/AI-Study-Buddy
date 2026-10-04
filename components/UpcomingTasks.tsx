'use client';

import React from 'react';
import { CalendarCheck, Check } from 'lucide-react';
import { Task } from '@/types/dashboard';
import { useToast } from './Toast';

interface UpcomingTasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onViewAll?: () => void;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({
  tasks,
  onToggleTask,
  onViewAll,
}) => {
  const { showToast } = useToast();
  const remainingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300 h-full min-h-[320px]">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center shadow-inner">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Today&apos;s Tasks
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-normal">
          {remainingCount} remaining
        </span>
      </div>

      {/* Task Rows matching Image 1 */}
      <div className="mt-3 divide-y divide-[#142240] space-y-1">
        {tasks.slice(0, 3).map((task) => {
          const subjectColorClass =
            task.subject === 'Physics'
              ? 'text-cyan-400'
              : task.subject === 'Mathematics'
              ? 'text-purple-400'
              : 'text-indigo-400';

          return (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="group cursor-pointer flex items-center justify-between py-2.5 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
                {/* Rounded square checkbox matching Image 1 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-blue-600 text-white shadow-[0_0_8px_rgba(37,99,235,0.6)]'
                      : 'border border-slate-500 group-hover:border-indigo-400 bg-transparent'
                  }`}
                  aria-label={`Toggle task ${task.title}`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <h4
                    className={`text-xs sm:text-[13px] font-semibold transition-all truncate ${
                      task.completed
                        ? 'line-through text-slate-500'
                        : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className={`text-[11px] font-medium mt-0.5 truncate ${subjectColorClass}`}>
                    {task.subject}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                {task.deadline}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer matching Image 1 */}
      <div className="mt-3 pt-3 border-t border-[#142240]">
        <button
          onClick={() => onViewAll ? onViewAll() : showToast('Open Tasks from the navigation.', 'info')}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          View All Tasks →
        </button>
      </div>
    </div>
  );
};

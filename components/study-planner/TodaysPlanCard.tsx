'use client';

import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Circle, ChevronRight, Sigma, Atom, BookOpen, FlaskConical, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { StudyTask } from '@/types/study-planner';

interface TodaysPlanCardProps {
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  onViewFullPlan: () => void;
  onEditTask?: (task: StudyTask) => void;
  onDeleteTask?: (task: StudyTask) => void;
  displayDate?: string;
}

export const TodaysPlanCard: React.FC<TodaysPlanCardProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onViewFullPlan,
  onEditTask,
  onDeleteTask,
  displayDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date()),
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
        return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
      case 'physics':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'english':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'chemistry':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
      default:
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/30 shadow-[0_20px_50px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.14)] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group h-full min-h-[440px]">
      {/* Header with Title & Date matching Image */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Today&apos;s Plan
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {displayDate}
              </p>
            </div>
          </div>

          <button
            onClick={onViewFullPlan}
            className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer group/link"
          >
            <span>View Full Plan</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </button>
        </div>

        {/* Task Rows List matching Image or Empty State */}
        {tasks.length > 0 ? (
          <div className="divide-y divide-[#121F3B] mt-2">
            {tasks.map((task) => {
              const Icon = getSubjectIcon(task.subject);
              const colorClass = getSubjectColorClasses(task.subject);
              const isMenuOpen = activeMenuId === task.id;

              return (
                <div
                  key={task.id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3 group/task hover:bg-[#0C1630]/50 px-2 -mx-2 rounded-xl transition-all relative"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${colorClass} shadow-inner transition-transform group-hover/task:scale-105`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13px] sm:text-sm font-semibold tracking-tight truncate transition-colors ${
                          task.completed ? 'text-slate-300 line-through opacity-80' : 'text-white'
                        }`}
                      >
                        {task.subject}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate flex items-center gap-2 mt-0.5">
                        <span>{task.topic}</span>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-300">
                          <span className="text-amber-400/80 font-bold">—</span>
                          <span>{task.durationMinutes} min</span>
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit/Delete Menu + Completion Toggle */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Action Menu (Edit / Delete) */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : task.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#142345] transition-colors cursor-pointer"
                        aria-label="Task options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-1 w-32 rounded-xl bg-[#091530] border border-[#1B2F57] shadow-2xl py-1 z-30 animate-fade-in"
                        >
                          {onEditTask && (
                            <button
                              onClick={() => {
                                onEditTask(task);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-slate-300 hover:text-white hover:bg-blue-600/20 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-blue-400" />
                              <span>Edit</span>
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              onClick={() => {
                                onDeleteTask(task);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-rose-400" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Completion Toggle Button */}
                    <button
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Mark ${task.subject} as ${task.completed ? 'incomplete' : 'completed'}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-teal-400 transition-transform active:scale-95 cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <div className="w-6 h-6 rounded-full bg-teal-500/25 border border-teal-500/80 flex items-center justify-center text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.6)]">
                          <CheckCircle2 className="w-4 h-4 fill-teal-400/20" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-[#233866] hover:border-teal-400/80 flex items-center justify-center transition-colors">
                          <Circle className="w-4 h-4 text-transparent hover:text-teal-400/30" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State matching user instructions */
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-2 text-slate-400">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-white">No study sessions yet</p>
            <p className="text-xs text-slate-400 max-w-[220px]">
              Add your first study task to start planning your day.
            </p>
            <button
              onClick={onAddTask}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Add New Task Button */}
      {tasks.length > 0 && (
        <button
          onClick={onAddTask}
          className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#0B1530] hover:bg-[#12224A] border border-[#192B50] hover:border-indigo-500/40 text-slate-200 hover:text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Add New Task</span>
        </button>
      )}
    </div>
  );
};

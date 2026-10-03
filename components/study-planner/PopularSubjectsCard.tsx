'use client';

import React from 'react';
import { BookOpen, ChevronRight, Sigma, Atom, FlaskConical } from 'lucide-react';

interface PopularSubjectsCardProps {
  onSelectSubject: (subject: string) => void;
  selectedSubject?: string | null;
  onViewAll?: () => void;
}

export const PopularSubjectsCard: React.FC<PopularSubjectsCardProps> = ({
  onSelectSubject,
  selectedSubject,
  onViewAll,
}) => {
  const subjects = [
    {
      name: 'Mathematics',
      topics: 'Algebra, Geometry, Trigonometry',
      icon: Sigma,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    },
    {
      name: 'Physics',
      topics: 'Motion, Forces, Energy',
      icon: Atom,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    },
    {
      name: 'English',
      topics: 'Grammar, Writing, Literature',
      icon: BookOpen,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
    {
      name: 'Chemistry',
      topics: 'Atoms, Reactions, Periodic Table',
      icon: FlaskConical,
      color: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/30 shadow-[0_20px_50px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.14)] p-6 sm:p-7 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Popular Subjects
          </h3>
        </div>

        <button
          onClick={onViewAll}
          className="text-[12px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer group/link"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </button>
      </div>

      {/* Subjects List */}
      <div className="space-y-2 mt-3.5">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          const isSelected = selectedSubject === sub.name;
          return (
            <button
              key={sub.name}
              onClick={() => onSelectSubject(sub.name)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer group/sub ${
                isSelected
                  ? 'bg-[#12224A] border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'hover:bg-[#0C1630] border-transparent hover:border-[#1E325C]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${sub.color} shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white tracking-tight group-hover/sub:text-indigo-200 transition-colors truncate">
                    {sub.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {sub.topics}
                  </p>
                </div>
              </div>

              <ChevronRight className={`w-3.5 h-3.5 transition-all shrink-0 ${isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-500 group-hover/sub:text-slate-300 group-hover/sub:translate-x-0.5'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

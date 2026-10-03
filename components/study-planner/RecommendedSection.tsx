'use client';

import React from 'react';
import { Bookmark, ChevronRight, Sigma, Atom, BookOpen, FlaskConical } from 'lucide-react';
import { RecommendedItem } from '@/types/study-planner';

interface RecommendedSectionProps {
  onSelectItem: (item: RecommendedItem) => void;
  onViewAll?: () => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  onSelectItem,
  onViewAll,
}) => {
  const recommendations: RecommendedItem[] = [
    {
      id: 'rec-1',
      title: 'Algebra Practice',
      subject: 'Mathematics',
      meta: '10 questions',
      actionText: 'Start',
      buttonColor: 'from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] shadow-[0_0_15px_rgba(37,99,235,0.4)]',
      iconName: 'split',
    },
    {
      id: 'rec-2',
      title: 'Physics Quiz',
      subject: 'Physics',
      meta: '15 questions',
      actionText: 'Start',
      buttonColor: 'from-[#9333EA] to-[#6366F1] hover:from-[#7E22CE] hover:to-[#4F46E5] shadow-[0_0_15px_rgba(147,51,234,0.4)]',
      iconName: 'brain',
    },
    {
      id: 'rec-3',
      title: 'Essay Tips',
      subject: 'English',
      meta: '5 min read',
      actionText: 'Read',
      buttonColor: 'from-[#EA580C] to-[#F59E0B] hover:from-[#C2410C] hover:to-[#D97706] shadow-[0_0_15px_rgba(234,88,12,0.4)]',
      iconName: 'fileText',
    },
    {
      id: 'rec-4',
      title: 'Chemistry Notes',
      subject: 'Chemistry',
      meta: 'Key formulas',
      actionText: 'Open',
      buttonColor: 'from-[#0D9488] to-[#06B6D4] hover:from-[#0F766E] hover:to-[#0891B2] shadow-[0_0_15px_rgba(13,148,136,0.4)]',
      iconName: 'beaker',
    },
  ];

  const getSubjectIcon = (iconName: RecommendedItem['iconName']) => {
    switch (iconName) {
      case 'split':
        return Sigma;
      case 'brain':
        return Atom;
      case 'fileText':
        return BookOpen;
      case 'beaker':
        return FlaskConical;
    }
  };

  const getSubjectColors = (iconName: RecommendedItem['iconName']) => {
    switch (iconName) {
      case 'split':
        return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'brain':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
      case 'fileText':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'beaker':
        return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/30 shadow-[0_20px_50px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.14)] p-6 sm:p-7 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Bookmark className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Recommended for You
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

      {/* 4 Cards Grid matching Image Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {recommendations.map((item) => {
          const Icon = getSubjectIcon(item.iconName);
          const colorClass = getSubjectColors(item.iconName);

          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-[#09122C] border border-[#162544] hover:border-indigo-500/40 transition-all flex flex-col justify-between group/card hover:-translate-y-0.5 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colorClass} shadow-inner`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/card:text-slate-300 transition-colors" />
                </div>

                <div className="mt-2.5">
                  <h4 className="text-[13px] sm:text-sm font-bold text-white tracking-tight leading-snug group-hover/card:text-indigo-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.subject}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    {item.meta}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectItem(item)}
                className={`mt-3 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r ${item.buttonColor} text-white text-xs font-semibold text-center transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]`}
              >
                {item.actionText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

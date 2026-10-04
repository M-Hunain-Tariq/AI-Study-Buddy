'use client';

import React from 'react';
import { Bot, Calendar, Brain, FileText, ArrowRight } from 'lucide-react';
import { useToast } from './Toast';

interface QuickActionsProps {
  onAskAiTutor: () => void;
  onNavigateStudyPlanner?: () => void;
  onOpenNote?: () => void;
  onNavigateQuiz?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAskAiTutor,
  onNavigateStudyPlanner,
  onOpenNote,
  onNavigateQuiz
}) => {
  const { showToast } = useToast();

  const actions = [
    {
      title: 'Ask AI Tutor',
      icon: Bot,
      color: 'bg-[#151736] hover:bg-[#1D204A] border-[#2A2B5E] hover:border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.12)]',
      iconColor: 'text-purple-300 bg-purple-600/30',
      handler: onAskAiTutor
    },
    {
      title: 'Plan Study',
      icon: Calendar,
      color: 'bg-[#0D2436] hover:bg-[#12314A] border-[#183D5C] hover:border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.12)]',
      iconColor: 'text-teal-300 bg-teal-600/30',
      handler: () => {
        if (onNavigateStudyPlanner) onNavigateStudyPlanner();
        else showToast('Navigated to Study Planner', 'info');
      }
    },
    {
      title: 'Take a Quiz',
      icon: Brain,
      color: 'bg-[#291333] hover:bg-[#381A46] border-[#441B54] hover:border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.12)]',
      iconColor: 'text-pink-300 bg-pink-600/30',
      handler: () => { if (onNavigateQuiz) onNavigateQuiz(); else showToast('Quiz & Practice is available from the navigation.', 'info'); }
    },
    {
      title: 'Add Note',
      icon: FileText,
      color: 'bg-[#2B1D12] hover:bg-[#3D2918] border-[#4E2E18] hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.12)]',
      iconColor: 'text-amber-300 bg-amber-600/30',
      handler: () => {
        if (onOpenNote) onOpenNote();
        else showToast('Quick Note opened!', 'info');
      }
    }
  ];

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300 h-full min-h-[320px]">
      <div className="pb-3.5 border-b border-[#142240]">
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Quick Actions
        </h3>
      </div>

      <div className="mt-3.5 grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              onClick={act.handler}
              className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border ${act.color} transition-all duration-200 cursor-pointer shadow-sm`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.iconColor} shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-white tracking-tight truncate">
                  {act.title}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-white shrink-0 ml-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

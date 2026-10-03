'use client';

import React from 'react';
import Image from 'next/image';
import {
  Zap,
  BookOpen,
  Atom,
  FlaskConical,
  Calculator,
  HelpCircle,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../Toast';

interface AiTutorRightSidebarProps {
  onSelectPrompt: (promptText: string) => void;
  onSelectSubject: (subjectName: string, samplePrompt: string) => void;
}

export const AiTutorRightSidebar: React.FC<AiTutorRightSidebarProps> = ({
  onSelectPrompt,
  onSelectSubject,
}) => {
  const { showToast } = useToast();

  const quickPrompts = [
    {
      title: 'Explain a concept',
      desc: 'Get simple explanations',
      icon: Sparkles,
      iconColor: 'bg-[#1E1B4B] text-indigo-400 border border-indigo-500/20',
      prompt: 'Can you explain the difference between speed and velocity with a simple sports car example?',
    },
    {
      title: 'Solve a question',
      desc: 'Step by step solution',
      icon: Calculator,
      iconColor: 'bg-[#0F2942] text-blue-400 border border-blue-500/20',
      prompt: 'Solve this step by step: Find the perimeter and area of a right triangle with legs of length 6cm and 8cm.',
    },
    {
      title: 'Create a quiz',
      desc: 'Test your knowledge',
      icon: HelpCircle,
      iconColor: 'bg-[#2E1438] text-pink-400 border border-pink-500/20',
      prompt: 'Give me a 3-question quick quiz on cell organelles with explanations.',
    },
    {
      title: 'Summarize notes',
      desc: 'Quick summary',
      icon: FileText,
      iconColor: 'bg-[#181D45] text-indigo-400 border border-indigo-500/20',
      prompt: 'Summarize the primary themes and character motivations in Shakespeare\'s Macbeth in bullet points.',
    },
    {
      title: 'Study plan',
      desc: 'Personalized plan',
      icon: Calendar,
      iconColor: 'bg-[#0E323D] text-cyan-400 border border-cyan-500/20',
      prompt: 'Make me an actionable 5-day study plan to prepare for a high school Chemistry exam on covalent and ionic bonding.',
    },
  ];

  const popularSubjects = [
    {
      name: 'Mathematics',
      topics: 'Algebra, Geometry, Trigonometry',
      icon: Calculator,
      iconColor: 'bg-[#102A4A] text-blue-400 border border-blue-500/20',
      prompt: 'Give me a practice algebra problem on systems of equations with two variables.',
    },
    {
      name: 'Physics',
      topics: 'Motion, Forces, Energy',
      icon: Atom,
      iconColor: 'bg-[#2A1542] text-purple-400 border border-purple-500/20',
      prompt: 'Explain the law of conservation of energy using a roller coaster example.',
    },
    {
      name: 'English',
      topics: 'Grammar, Writing, Literature',
      icon: BookOpen,
      iconColor: 'bg-[#3A2212] text-amber-400 border border-amber-500/20',
      prompt: 'What are three effective figurative language techniques I can use to improve my descriptive essay writing?',
    },
    {
      name: 'Chemistry',
      topics: 'Atoms, Reactions, Periodic Table',
      icon: FlaskConical,
      iconColor: 'bg-[#0E3342] text-cyan-400 border border-cyan-500/20',
      prompt: 'Explain how to balance a chemical equation step-by-step with an example like H₂ + O₂ → H₂O.',
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* 1. Quick Prompts Card matching reference image */}
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-[#142240]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Quick Prompts
            </h4>
          </div>

          <button
            onClick={() => showToast('Full prompt library will be in Step 6 Practice Hub', 'info')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="mt-2 divide-y divide-[#142240] space-y-1">
          {quickPrompts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={`prompt-${item.title}`}
                onClick={() => {
                  onSelectPrompt(item.prompt);
                  showToast(`Selected "${item.title}"`, 'info');
                }}
                className="group cursor-pointer flex items-center justify-between py-2.5 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconColor} shadow-inner`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Popular Subjects Card matching reference image */}
      <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-4 sm:p-5 shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300">
        <div className="flex items-center gap-2 pb-3 border-b border-[#142240]">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-bold text-white tracking-tight">
            Popular Subjects
          </h4>
        </div>

        <div className="mt-2 divide-y divide-[#142240] space-y-1">
          {popularSubjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={`subject-${sub.name}`}
                onClick={() => {
                  onSelectSubject(sub.name, sub.prompt);
                  showToast(`Loaded question for ${sub.name}!`, 'info');
                }}
                className="group cursor-pointer flex items-center justify-between py-2.5 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sub.iconColor} shadow-inner`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors truncate">
                      {sub.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {sub.topics}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Motivation Card matching reference image */}
      <div className="relative overflow-hidden rounded-2xl border border-[#162544] hover:border-[#243B6B] min-h-[220px] flex flex-col justify-end p-5 shadow-lg group">
        <Image
          src="/images/motivation_mountain_exact.jpg"
          alt="Inspiring mountain night landscape with summit flag"
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Dark contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060D20] via-[#060D20]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>You can do it!</span>
          </h4>

          <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
            Every question you ask brings you closer to your goals.
          </p>

          <div className="pt-1 flex items-center gap-1 text-pink-400 text-xs">
            <span>💖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

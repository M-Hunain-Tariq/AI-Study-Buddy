'use client';

import React from 'react';
import Image from 'next/image';
import { Bot, Lightbulb, Split, HelpCircle, FileText } from 'lucide-react';

interface AiTutorHeroProps {
  onSelectActionChip: (prompt: string) => void;
}

export const AiTutorHero: React.FC<AiTutorHeroProps> = ({ onSelectActionChip }) => {
  const actionChips = [
    {
      title: 'Explain Concepts',
      desc: 'in simple words',
      icon: Lightbulb,
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
      prompt: 'Explain the concept of photosynthesis in simple terms with an everyday analogy.',
    },
    {
      title: 'Solve Problems',
      desc: 'step by step',
      icon: Split,
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      prompt: 'Can you show me step-by-step how to solve this quadratic equation: 2x² + 5x - 3 = 0?',
    },
    {
      title: 'Create Quizzes',
      desc: 'to practice',
      icon: HelpCircle,
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      prompt: 'Generate a 4-question multiple-choice practice quiz on Newton\'s laws of motion with explanations.',
    },
    {
      title: 'Summarize Notes',
      desc: 'in seconds',
      icon: FileText,
      color: 'text-teal-400 bg-teal-500/20 border-teal-500/30',
      prompt: 'Please give me a clean, bulleted summary of key formulas and concepts for Linear Equations.',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#1A284A] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_35px_rgba(37,99,235,0.15)] transition-all duration-300 min-h-[280px] lg:h-[305px] flex items-center group">
      {/* 1. CRYSTAL-CLEAR FULL-CARD 3D ROBOT SCENE (Zero blur layers over the scene) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/ai_tutor_robot_hero.jpg"
          alt="3D AI Robot student assistant at study desk with laptop and idea lightbulb"
          fill
          unoptimized
          priority
          quality={95}
          sizes="(max-width: 1536px) 100vw, 1500px"
          className="object-cover object-[80%_center] sm:object-[75%_center] lg:object-right transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
          referrerPolicy="no-referrer"
        />

        {/* 2. PRECISION TEXT-CONTRAST SCRIM (Confined to left so robot scene on right stays crystal clear) */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[56%] bg-gradient-to-r from-[#070D1E] via-[#070D1E]/95 via-50% to-transparent pointer-events-none" />

        {/* Subtle bottom edge blend */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#070D1E]/60 to-transparent pointer-events-none" />
      </div>

      {/* Inner subtle glow border reflection */}
      <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none z-10" />

      {/* FOREGROUND CONTENT: Integrated cleanly across the left half */}
      <div className="relative z-20 w-full lg:w-[58%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* 1. Small AI Tutor badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1836]/90 border border-[#213560] text-xs font-semibold text-indigo-300 w-fit shadow-inner">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Tutor</span>
          </div>

          {/* 2. Main heading with gradient on "AI Study Assistant" */}
          <h2 className="text-2xl sm:text-3xl lg:text-[28px] xl:text-[30px] font-bold text-white tracking-tight leading-tight">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]">
              AI Study Assistant
            </span>
          </h2>

          {/* 3. Description */}
          <p className="text-xs sm:text-[13px] text-slate-300 font-normal leading-relaxed max-w-md">
            Ask questions, get simple explanations, solve problems and learn at your own pace.
          </p>
        </div>

        {/* 4. Quick Action Chips: 4 buttons in ONE row on desktop */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4 gap-2 pt-1 w-full">
          {actionChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.title}
                onClick={() => onSelectActionChip(chip.prompt)}
                className="group/chip flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#0B1530]/90 hover:bg-[#12224A] border border-[#182B4F] hover:border-indigo-500/50 transition-all text-left cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 min-w-0 backdrop-blur-sm"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border ${chip.color} shadow-inner`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-white tracking-tight truncate group-hover/chip:text-indigo-200 transition-colors">
                    {chip.title}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">
                    {chip.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';
import { Bot, BookOpen, Calculator, Lightbulb, Sparkles } from 'lucide-react';
import { QUICK_PROMPTS } from '@/lib/ai/tutor-presets';

interface AiTutorHeroProps { onSelectActionChip?: (prompt: string) => void }

export const AiTutorHero: React.FC<AiTutorHeroProps> = ({ onSelectActionChip }) => {
  return (
    <section className={`relative isolate flex ${onSelectActionChip ? 'min-h-[220px] sm:min-h-[224px]' : 'min-h-[176px] sm:min-h-[190px]'} items-center overflow-hidden rounded-[24px] border border-[#20365B] bg-[#071329] shadow-[0_18px_48px_rgba(0,0,0,0.26)]`}>
      <Image
        src="/images/ai_tutor_robot_hero.jpg"
        alt="StudyBuddy AI robot learning beside a laptop"
        fill
        priority
        sizes="(max-width: 1280px) 70vw, 1000px"
        className="absolute inset-0 -z-20 object-cover object-[72%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061225] via-[#071329]/95 via-45% to-[#071329]/15" />
      <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-[62%] bg-gradient-to-r from-[#071329]/80 to-transparent" />
      <div className={`relative z-10 max-w-[610px] px-5 pt-5 sm:px-7 sm:pt-6 ${onSelectActionChip ? 'pb-14' : 'pb-5 sm:pb-6'}`}>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-[#0B1A35]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200 shadow-lg backdrop-blur-sm">
          <Bot className="h-3.5 w-3.5 text-cyan-300" />
          Your learning companion
        </div>
        <h1 className="max-w-xl text-[26px] font-bold leading-[1.12] tracking-tight text-white sm:text-[31px] lg:text-[34px]">
          Learn with your <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">AI Tutor</span>
        </h1>
        <p className="mt-2 max-w-[430px] text-[12px] leading-relaxed text-slate-300 sm:text-[13px]">
          Ask questions, explore ideas, and work through difficult topics at your own pace.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-300/90 sm:text-[11px]">
          <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-cyan-300" />Clear explanations</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Step-by-step support</span>
        </div>
      </div>
      {onSelectActionChip && (
        <div className="absolute bottom-4 left-5 z-10 hidden flex-wrap gap-2 sm:flex sm:left-7">
          {[
            { prompt: QUICK_PROMPTS[0], Icon: Calculator },
            { prompt: QUICK_PROMPTS[1], Icon: BookOpen },
            { prompt: QUICK_PROMPTS[4], Icon: Lightbulb },
          ].map(({ prompt, Icon }) => (
            <button key={prompt.title} type="button" onClick={() => onSelectActionChip(prompt.prompt)} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-blue-200/15 bg-[#0a1b35]/80 px-3 text-[10px] font-semibold text-blue-100 backdrop-blur-md transition hover:border-cyan-200/35 hover:bg-blue-500/20">
              <Icon className="h-3 w-3 text-cyan-300" />{prompt.label}
            </button>
          ))}
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10" />
    </section>
  );
};

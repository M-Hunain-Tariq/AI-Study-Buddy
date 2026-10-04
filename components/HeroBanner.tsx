'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onContinueLearning: () => void;
  onAskAiTutor: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onContinueLearning,
  onAskAiTutor,
}) => {
  return (
    <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#070D1E] border border-[#1A284A] hover:border-blue-500/40 shadow-[0_20px_50px_rgba(2,6,23,0.85),0_0_35px_rgba(37,99,235,0.15)] transition-all duration-300 min-h-[185px] sm:min-h-[260px] lg:h-[320px] flex items-center group">
      {/* 1. CRYSTAL-CLEAR FULL-CARD IMAGE (Zero blur overlays over the scene) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero_study_desk_exact.jpg"
          alt="Student study desk with open laptop displaying learning dashboard"
          fill
          unoptimized
          priority
          quality={95}
          sizes="(max-width: 1536px) 100vw, 1500px"
          className="object-cover object-right sm:object-right transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
          referrerPolicy="no-referrer"
        />

        {/* 2. PRECISION TEXT-CONTRAST SCRIM (Confined to left side so the right photo remains razor-sharp) */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[65%] lg:w-[55%] bg-gradient-to-r from-[#070D1E] via-[#070D1E]/95 sm:via-[#070D1E]/90 to-transparent pointer-events-none" />
      </div>

      {/* Inner subtle glow border reflection */}
      <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none z-10" />

      {/* "Keep Going! 💖" handwritten quote overlay floating naturally above the desk scene */}
      <div className="absolute top-2.5 right-3 sm:top-5 sm:right-16 lg:right-24 z-20 flex items-center gap-1 -rotate-6 font-serif italic text-[#FBBF24] text-[11px] sm:text-sm font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-float-slow pointer-events-none select-none">
        <span>Keep Going!</span>
        <span className="text-pink-400 text-[11px] sm:text-sm drop-shadow-[0_0_10px_rgba(244,114,182,0.9)]">💖</span>
      </div>

      {/* FOREGROUND CONTENT: Integrated cleanly across the left half */}
      <div className="relative z-20 w-full max-w-xl p-3.5 sm:p-8 lg:p-10 flex flex-col justify-center space-y-2 sm:space-y-4">
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0D1836]/90 border border-[#213560] text-[10px] sm:text-xs font-semibold text-indigo-300 w-fit shadow-inner">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
          <span>Study Dashboard</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight">
            Welcome to your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]">
              Study Space
            </span>{' '}
            👋
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-300 font-normal mt-0.5 sm:mt-1.5 line-clamp-1 sm:line-clamp-none">
            Your new study workspace is ready. Start with one small step.
          </p>
        </div>

        {/* Motivational Quote (hidden on very small phones to save height) */}
        <div className="hidden xs:block pl-3 border-l-2 border-[#A855F7] py-0.5">
          <p className="text-[11px] sm:text-[13px] text-slate-300 font-normal italic font-serif">
            &ldquo;The future belongs to those who learn today.&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3.5 pt-1 sm:pt-2">
          <button
            onClick={onContinueLearning}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(79,70,229,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={onAskAiTutor}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0C152B]/90 hover:bg-[#132040] text-slate-200 hover:text-white border border-[#23355C] text-xs sm:text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

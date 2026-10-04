'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface MotivationCardProps {
  onViewProgress: () => void;
}

export const MotivationCard: React.FC<MotivationCardProps> = ({ onViewProgress }) => {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#070D1E] border border-[#162544] hover:border-blue-500/35 shadow-[0_20px_45px_-8px_rgba(2,6,23,0.9),0_0_35px_-5px_rgba(37,99,235,0.15)] p-6 transition-all duration-300 min-h-[190px] sm:min-h-[210px] flex flex-col justify-between group">
      {/* Background Mountain Visual: Cleanly fills the right half with unoptimized */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-[24px]">
        <Image
          src="/images/motivation_mountain_exact.jpg"
          alt="Majestic mountain summit with victory flag under cosmic starlight"
          fill
          unoptimized
          priority
          sizes="(max-width: 1024px) 100vw, 100vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070D1E] via-[#070D1E]/72 to-[#070D1E]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/65 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#070D1E] via-[#070D1E]/95 to-transparent pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-[60%] space-y-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          You can do it!
        </h3>
        <p className="text-xs sm:text-[13px] text-slate-300 font-normal leading-relaxed">
          Every small step counts. Keep going, you&apos;re closer to your goals.{' '}
          <span className="text-pink-400">💖</span>
        </p>
      </div>

      <div className="relative z-10 mt-5">
        <button
          onClick={onViewProgress}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white font-semibold text-xs shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>View Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

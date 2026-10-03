'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useToast } from '../Toast';

interface MountainMotivationCardProps {
  onKeepGoing?: () => void;
}

export const MountainMotivationCard: React.FC<MountainMotivationCardProps> = ({ onKeepGoing }) => {
  const { showToast } = useToast();

  const handleAction = () => {
    if (onKeepGoing) {
      onKeepGoing();
    } else {
      showToast('Keep pushing forward! Every small step adds up to great achievements. 🏔️✨', 'success');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#0A1132] border border-[#213872]/80 hover:border-blue-500/50 shadow-[0_20px_50px_rgba(2,6,23,0.9),0_0_35px_rgba(37,99,235,0.2)] p-5 sm:p-6 flex flex-col justify-between h-full min-h-[360px] transition-all duration-300 group">
      {/* 1. CRYSTAL-CLEAR 3D MOUNTAIN BACKGROUND */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/motivation_mountain_exact.jpg"
          alt="3D Glowing neon mountain peak with golden flag on summit"
          fill
          unoptimized
          priority
          sizes="(max-width: 1536px) 100vw, 500px"
          className="object-cover object-right opacity-80 transition-transform duration-1000 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* 2. TEXT CONTRAST GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060D24] via-[#060D24]/85 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060D24] to-transparent pointer-events-none" />
      </div>

      {/* Inner subtle glow border reflection */}
      <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none z-10" />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20 space-y-1">
        <h3 className="font-serif italic text-2xl sm:text-3xl font-bold tracking-tight text-[#C084FC] drop-shadow-[0_0_15px_rgba(192,132,252,0.85)]">
          Big Goals
        </h3>
        <h4 className="font-serif italic text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Small Steps
        </h4>
        <h4 className="font-serif italic text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Real Progress
        </h4>
      </div>

      {/* Action Button: Keep Going → matching Image 1 */}
      <div className="relative z-20 pt-4">
        <button
          onClick={handleAction}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(37,99,235,0.7)] hover:shadow-[0_0_28px_rgba(37,99,235,0.9)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Keep Going</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

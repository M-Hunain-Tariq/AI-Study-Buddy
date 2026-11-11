'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Menu, Sparkles } from 'lucide-react';

interface MobileTopBarProps {
  onOpenMenu: () => void;
  onAskAi?: () => void;
}

/** Phone top bar: menu button (opens the side drawer) · app name · quick "Ask AI". Hidden on laptop. */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onOpenMenu, onAskAi }) => {
  const router = useRouter();
  return (
    <div className="m-topbar lg:hidden">
      <button type="button" className="m-icon-btn" onClick={onOpenMenu} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <div className="m-brand">
        <span className="m-logo"><GraduationCap size={16} /></span>
        <span>StudyBuddy</span>
      </div>
      <button type="button" className="m-icon-btn" onClick={onAskAi ?? (() => router.push('/ai-tutor'))} aria-label="Ask AI Tutor">
        <Sparkles size={20} />
      </button>
    </div>
  );
};

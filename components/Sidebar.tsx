'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GraduationCap, LayoutDashboard, Bot, CalendarDays, FileText, CheckSquare, Brain, TrendingUp, Settings, X, Sparkles } from 'lucide-react';
import { useToast } from './Toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onNavigateAiTutor?: () => void;
  onSelectPage?: (page: 'Dashboard' | 'AI Tutor' | 'Study Planner' | 'My Notes' | 'Tasks' | 'Quiz & Practice' | 'My Progress') => void;
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'AI Tutor', icon: Bot },
  { name: 'Study Planner', icon: CalendarDays },
  { name: 'My Notes', icon: FileText },
  { name: 'Tasks', icon: CheckSquare },
  { name: 'Quiz & Practice', icon: Brain },
  { name: 'My Progress', icon: TrendingUp },
] as const;

type PageName = (typeof navItems)[number]['name'];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem = 'Dashboard', onNavigateAiTutor, onSelectPage }) => {
  const router = useRouter();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const go = (name: PageName) => {
    if (onSelectPage) onSelectPage(name);
    else if (name === 'AI Tutor' && onNavigateAiTutor) onNavigateAiTutor();
    else {
      const routes: Record<PageName, string> = {
        Dashboard: '/dashboard', 'AI Tutor': '/ai-tutor', 'Study Planner': '/study-planner', 'My Notes': '/my-notes',
        Tasks: '/tasks', 'Quiz & Practice': '/quiz-practice', 'My Progress': '/my-progress'
      };
      router.push(routes[name]);
    }
    onClose();
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" />}
      <aside className={`sb-sidebar fixed inset-y-0 left-0 z-50 w-[272px] max-w-[88vw] flex flex-col px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-2 mb-7">
            <button onClick={() => go('Dashboard')} className="flex items-center gap-3 text-left group">
              <span className="sb-brand-mark"><GraduationCap className="h-5 w-5" /></span>
              <span>
                <span className="block text-[15px] font-extrabold tracking-tight text-white">StudyBuddy</span>
                <span className="block text-[10px] font-medium tracking-[0.16em] uppercase text-slate-500">Your learning space</span>
              </span>
            </button>
            <button onClick={onClose} className="lg:hidden rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
          <nav className="space-y-1">
            {navItems.map(({ name, icon: Icon }) => {
              const active = activeItem === name;
              return (
                <button key={name} onClick={() => go(name)} className={`sb-nav-item ${active ? 'is-active' : ''}`}>
                  <span className="flex items-center gap-3 min-w-0"><Icon className="h-[18px] w-[18px] shrink-0" /><span className="truncate">{name}</span></span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.9)]" />}
                </button>
              );
            })}
          </nav>

          <div className="my-6 border-t border-white/[0.07]" />
          <button onClick={() => { router.push('/settings'); onClose(); }} className={`sb-nav-item ${activeItem === 'Settings' ? 'is-active' : ''}`}>
            <span className="flex items-center gap-3"><Settings className="h-[18px] w-[18px]" />Settings</span>
          </button>

          <div className="mt-auto pt-6">
            <div className="sb-focus-card">
              <div className="relative z-10">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200"><Sparkles className="h-3 w-3" /> Keep going</div>
                <p className="text-sm font-bold text-white">One focused session at a time.</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Build momentum without burning out.</p>
              </div>
              <div className="relative mt-3 h-20 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
                <Image src="/images/sidebar_robot_exact.jpg" alt="StudyBuddy companion" fill unoptimized sizes="230px" className="object-cover object-center opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08101e] via-transparent to-transparent" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px]"><span className="text-slate-500">Getting started</span><span className="font-bold text-cyan-300">0%</span></div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" /></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

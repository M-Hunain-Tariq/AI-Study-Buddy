'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Bot,
  Calendar,
  FileText,
  CheckSquare,
  Brain,
  TrendingUp,
  Settings,
  X
} from 'lucide-react';
import { useToast } from './Toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onNavigateAiTutor?: () => void;
  onSelectPage?: (page: 'Dashboard' | 'AI Tutor' | 'Study Planner' | 'My Notes' | 'Tasks' | 'Quiz & Practice' | 'My Progress') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeItem = 'Dashboard',
  onNavigateAiTutor,
  onSelectPage,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, step: 1 },
    { name: 'AI Tutor', icon: Bot, step: 2 },
    { name: 'Study Planner', icon: Calendar, step: 3 },
    { name: 'My Notes', icon: FileText, step: 4 },
    { name: 'Tasks', icon: CheckSquare, step: 5 },
    { name: 'Quiz & Practice', icon: Brain, step: 6 },
    { name: 'My Progress', icon: TrendingUp, step: 7 },
  ];

  const handleNavClick = (name: string, step: number) => {
    if (name === 'Dashboard') {
      if (onSelectPage) {
        onSelectPage('Dashboard');
      } else if (activeItem !== 'Dashboard') {
        router.push('/dashboard');
      } else {
        showToast('You are on the Dashboard', 'info');
      }
      onClose();
      return;
    }

    if (name === 'AI Tutor') {
      if (onSelectPage) {
        onSelectPage('AI Tutor');
      } else if (onNavigateAiTutor) {
        onNavigateAiTutor();
      } else if (activeItem !== 'AI Tutor') {
        router.push('/ai-tutor');
      } else {
        showToast('You are in the AI Tutor workspace', 'info');
      }
      onClose();
      return;
    }

    if (name === 'Study Planner') {
      if (onSelectPage) {
        onSelectPage('Study Planner');
      } else if (activeItem !== 'Study Planner') {
        router.push('/study-planner');
      } else {
        showToast('You are on the Study Planner', 'info');
      }
      onClose();
      return;
    }

    if (name === 'My Notes') {
      if (onSelectPage) {
        onSelectPage('My Notes');
      } else if (activeItem !== 'My Notes') {
        router.push('/my-notes');
      } else {
        showToast('You are on My Notes', 'info');
      }
      onClose();
      return;
    }

    if (name === 'Tasks') {
      if (onSelectPage) {
        onSelectPage('Tasks');
      } else if (activeItem !== 'Tasks') {
        router.push('/tasks');
      } else {
        showToast('You are on Tasks', 'info');
      }
      onClose();
      return;
    }

    if (name === 'Quiz & Practice') {
      if (onSelectPage) {
        onSelectPage('Quiz & Practice');
      } else if (activeItem !== 'Quiz & Practice') {
        router.push('/quiz-practice');
      } else {
        showToast('You are on Quiz & Practice', 'info');
      }
      onClose();
      return;
    }

    if (name === 'My Progress') {
      if (onSelectPage) {
        onSelectPage('My Progress');
      } else if (activeItem !== 'My Progress') {
        router.push('/my-progress');
      } else {
        showToast('You are on My Progress', 'info');
      }
      onClose();
      return;
    }

    showToast(`${name} will be unlocked in Step ${step}!`, 'info');
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container matching Image 1 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-[240px] max-w-[85vw] bg-[#050B1E] border-r border-[#142240] flex flex-col justify-between py-5 px-3.5 transition-transform duration-300 ease-in-out overflow-y-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-5">
          {/* Logo & Brand Header matching Image 1 */}
          <div className="flex items-center justify-between px-1.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white shadow-[0_0_22px_rgba(79,70,229,0.55)] shrink-0">
                <GraduationCap className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-white tracking-tight leading-tight">
                  AI Study Buddy
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  Learn · Grow · Succeed
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links matching Image 1 */}
          <nav className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name, item.step)}
                  className={`group relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_0_22px_rgba(79,70,229,0.55)] font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#0C1833] hover:shadow-[0_0_12px_rgba(59,130,246,0.12)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.name === 'My Notes' && !isActive && (
                    <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.6)]">
                      3
                    </span>
                  )}
                  {isActive && (
                    <div className="flex items-center gap-1.5">
                      {item.name === 'My Notes' && (
                        <span className="w-5 h-5 rounded-full bg-white/25 text-white text-[11px] font-bold flex items-center justify-center">
                          3
                        </span>
                      )}
                      <span className="text-white text-sm font-semibold">›</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-[#142240] my-0.5" />

          {/* Bottom Settings Link */}
          <button
            onClick={() => {
              if (activeItem !== 'Settings') router.push('/settings');
              else if (typeof window !== 'undefined' && window.location.hash) window.location.hash = '';
              onClose();
            }}
            className={`group relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              activeItem === 'Settings'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_0_22px_rgba(79,70,229,0.55)] font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-[#0C1833]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${activeItem === 'Settings' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>Settings</span>
            </span>
            {activeItem === 'Settings' && <span className="text-white text-sm font-semibold">›</span>}
          </button>
        </div>

        {/* Motivational Card at Bottom of Sidebar matching image.png */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-3.5 text-left shadow-lg transition-all duration-300 group">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h4 className="text-[12px] font-medium text-white tracking-tight">
                Start your journey
              </h4>
              <p className="text-[12px] font-semibold text-white flex items-center gap-1">
                one step at a time. <span className="text-pink-500 text-xs">❤️</span>
              </p>
            </div>
          </div>

          <div className="relative mt-2.5 h-32 w-full rounded-xl overflow-hidden shadow-inner">
            <Image
              src="/images/sidebar_robot_exact.jpg"
              alt="Cute futuristic robot companion with laptop"
              fill
              unoptimized
              sizes="220px"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Getting Started with 68% bar matching image.png */}
          <div className="mt-2.5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Getting Started</span>
              <span className="text-white font-bold">0%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#132247] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#A855F7] w-0" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

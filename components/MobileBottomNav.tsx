'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  CalendarDays,
  FileText,
  CheckSquare,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeItem?: string;
  onSelectPage?: (page: 'Dashboard' | 'AI Tutor' | 'Study Planner' | 'My Notes' | 'Tasks' | 'Quiz & Practice' | 'My Progress') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeItem,
  onSelectPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current active page
  const currentActive =
    activeItem ||
    (pathname === '/my-progress'
      ? 'My Progress'
      : pathname === '/quiz-practice'
      ? 'Quiz & Practice'
      : pathname === '/tasks'
      ? 'Tasks'
      : pathname === '/my-notes'
      ? 'My Notes'
      : pathname === '/study-planner'
      ? 'Study Planner'
      : pathname === '/ai-tutor'
      ? 'AI Tutor'
      : 'Dashboard');

  const navItems: {
    id: 'Dashboard' | 'AI Tutor' | 'Study Planner' | 'My Notes' | 'Tasks' | 'Quiz & Practice' | 'My Progress';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    route: string;
  }[] = [
    { id: 'Dashboard', label: 'Home', icon: LayoutDashboard, route: '/dashboard' },
    { id: 'AI Tutor', label: 'AI Tutor', icon: Brain, route: '/ai-tutor' },
    { id: 'Study Planner', label: 'Planner', icon: CalendarDays, route: '/study-planner' },
    { id: 'My Notes', label: 'Notes', icon: FileText, route: '/my-notes' },
    { id: 'Tasks', label: 'Tasks', icon: CheckSquare, route: '/tasks' },
    { id: 'Quiz & Practice', label: 'Quiz', icon: HelpCircle, route: '/quiz-practice' },
    { id: 'My Progress', label: 'Progress', icon: TrendingUp, route: '/my-progress' },
  ];

  const handleTabClick = (item: (typeof navItems)[0]) => {
    if (onSelectPage) {
      onSelectPage(item.id);
    } else {
      router.push(item.route);
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#060D20]/95 backdrop-blur-xl border-t border-[#182B55] px-1.5 py-1.5 pb-safe flex items-center justify-around shadow-[0_-10px_25px_rgba(2,6,23,0.8)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentActive === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer active:scale-90 ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Background */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/25 to-purple-600/25 rounded-xl border border-blue-400/30 -z-10 shadow-[0_0_12px_rgba(59,130,246,0.3)]" />
            )}

            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform ${
                isActive ? 'scale-110 text-blue-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>

            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isActive ? 'font-bold text-white' : 'font-medium text-slate-400'
              }`}
            >
              {item.label}
            </span>

            {/* Glowing Active Dot */}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

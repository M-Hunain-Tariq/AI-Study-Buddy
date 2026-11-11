import { LayoutDashboard, Bot, CalendarDays, FileText, CheckSquare, Brain, TrendingUp } from 'lucide-react';

/** Single list of app pages used by the phone drawer. Same names/routes as the laptop Sidebar. */
export const PAGES = [
  { name: 'Dashboard', label: 'Home', route: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Tutor', label: 'AI Tutor', route: '/ai-tutor', icon: Bot },
  { name: 'Study Planner', label: 'Study Planner', route: '/study-planner', icon: CalendarDays },
  { name: 'My Notes', label: 'My Notes', route: '/my-notes', icon: FileText },
  { name: 'Tasks', label: 'Tasks', route: '/tasks', icon: CheckSquare },
  { name: 'Quiz & Practice', label: 'Quiz & Practice', route: '/quiz-practice', icon: Brain },
  { name: 'My Progress', label: 'My Progress', route: '/my-progress', icon: TrendingUp },
] as const;

export type PageName = (typeof PAGES)[number]['name'];

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  CheckCircle2,
  User,
  Award,
  LogOut,
  Sun
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onSearchQuery?: (q: string) => void;
  onNavigateAiTutor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onSearchQuery,
  onNavigateAiTutor,
}) => {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setShowNotifications(false);
        setShowProfile(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Math Homework Due Today',
      time: '10:00 PM',
      read: false,
      desc: 'Complete Algebra exercises before deadline.'
    },
    {
      id: '2',
      title: '3-Day Study Streak! 🔥',
      time: '1 hour ago',
      read: false,
      desc: 'You unlocked the Consistent Scholar badge.'
    },
    {
      id: '3',
      title: 'Quiz Performance High',
      time: '3 hours ago',
      read: false,
      desc: 'Your quiz average jumped to 82% this week!'
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const searchResults = [
    { type: 'topic', title: 'Linear Equations — Algebra', subject: 'Mathematics' },
    { type: 'note', title: 'Cell Structure & Organelles', subject: 'Biology' },
    { type: 'task', title: 'Read chapter 2 (Physics)', subject: 'Physics' },
    { type: 'note', title: 'Essay Outline on Macbeth', subject: 'English' },
    { type: 'ai', title: 'Ask AI Study Tutor', subject: 'AI Assistant' },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (onSearchQuery) onSearchQuery(val);
    setIsSearchOpen(val.length > 0);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060C1D]/90 backdrop-blur-md border-b border-[#142240] px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 transition-all">
      {/* Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl min-w-0">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2.5 rounded-xl text-slate-300 hover:text-white bg-[#0A132C] border border-[#162544] transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar matching Image 1 */}
        <div ref={searchRef} className="relative flex-1 min-w-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (search) setIsSearchOpen(true);
              }}
              placeholder="Search anything..."
              className="w-full bg-[#0A132C] hover:bg-[#0E1B3D] focus:bg-[#0E1B3D] border border-[#162544] focus:border-blue-500 rounded-xl pl-9 pr-8 sm:pr-9 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner truncate"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#091530] border border-[#1A2D54] rounded-xl shadow-2xl p-2 z-50 overflow-hidden">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Results</span>
                <span className="text-[10px] text-indigo-400">Press Esc to close</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#142340]">
                  {searchResults.map((res) => (
                    <button
                      key={`search-${res.type}-${res.title}`}
                      onClick={() => {
                        if (res.type === 'ai' && onNavigateAiTutor) {
                          onNavigateAiTutor();
                        } else {
                          showToast(`Opened ${res.title}`, 'info');
                        }
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#12213F] transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          {res.type === 'topic' ? (
                            <BookOpen className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{res.title}</p>
                          <p className="text-[10px] text-slate-400">{res.subject}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {res.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching lessons found for &quot;{search}&quot;.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right zone: Notification & User Profile matching Image 1 */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#0A1630] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-[#091530] border border-[#1A2D54] rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#142340] px-1">
                <span className="text-xs font-bold text-white">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      n.read
                        ? 'bg-transparent border-transparent text-slate-400'
                        : 'bg-[#0E1E40] border-[#1C325A] text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme indicator/toggle matching reference image */}
        <button
          onClick={() => router.push('/settings#appearance')}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#0A1630] transition-colors cursor-pointer"
          aria-label="Theme mode"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* User Profile matching Image 1: [M] Muhammad ⌄ */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-1.5 sm:gap-2.5 py-1 px-1 sm:px-1.5 rounded-xl hover:bg-[#0A1630] transition-colors group cursor-pointer"
          >
            {/* Avatar circle with letter M and glow */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(147,51,234,0.5)] shrink-0">
              M
            </div>
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white">
              Muhammad
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-[#091530] border border-[#1A2D54] rounded-2xl shadow-2xl p-2 z-50">
              <div className="p-2.5 border-b border-[#142340]">
                <p className="text-xs font-bold text-white">Muhammad</p>
                <p className="text-[11px] text-indigo-400">High School · Grade 10</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 bg-white/[0.04] px-2 py-1 rounded-md">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>3-Day Study Streak Active</span>
                </div>
              </div>

              <div className="mt-1">
                <button
                  onClick={() => {
                    router.push('/settings#profile');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Profile</span>
                </button>
                <div className="border-t border-[#142340] my-1" />
                <button
                  onClick={() => {
                    showToast('Demo profile session is always active.', 'info');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Settings, X, ChevronRight } from 'lucide-react';
import { PAGES, PageName } from './pages';
import { useUserName } from './data';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onNavigateAiTutor?: () => void;
  onSelectPage?: (page: PageName) => void;
}

/** Phone side menu (slides in from the left). Hidden on laptop. Same navigation rules as the laptop Sidebar. */
export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, activeItem = 'Dashboard', onNavigateAiTutor, onSelectPage }) => {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const userName = useUserName();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const go = (page: (typeof PAGES)[number]) => {
    if (onSelectPage) onSelectPage(page.name);
    else if (page.name === 'AI Tutor' && onNavigateAiTutor) onNavigateAiTutor();
    else router.push(page.route);
    onClose();
  };

  return (
    <div className={`m-drawer-root lg:hidden${isOpen ? ' is-open' : ''}`}>
      <div className="m-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="m-drawer" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!isOpen}>
        <div className="m-drawer-head">
          <div className="m-brand">
            <span className="m-logo"><GraduationCap size={16} /></span>
            <span>StudyBuddy</span>
          </div>
          <button ref={closeRef} type="button" className="m-icon-btn" onClick={onClose} aria-label="Close menu" tabIndex={isOpen ? 0 : -1}>
            <X size={22} />
          </button>
        </div>

        <nav className="m-drawer-nav" aria-label="Pages">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const active = activeItem === page.name;
            return (
              <button key={page.name} type="button" className={`m-nav-item${active ? ' is-active' : ''}`} onClick={() => go(page)} aria-current={active ? 'page' : undefined} tabIndex={isOpen ? 0 : -1}>
                <Icon size={20} />
                <span>{page.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="m-drawer-foot">
          <button type="button" className="m-profile" onClick={() => { router.push('/settings'); onClose(); }} tabIndex={isOpen ? 0 : -1}>
            <span className="m-avatar">{userName.charAt(0).toUpperCase()}</span>
            <span className="m-profile-text"><strong>{userName}</strong><small>Settings</small></span>
            <Settings size={18} />
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
};

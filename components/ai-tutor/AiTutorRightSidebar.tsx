'use client';

import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal, History, FileUp, Globe2, ChevronRight,
  MessageSquare, Trash2, X, Sparkles, ArrowUpRight, FileText, ShieldCheck,
} from 'lucide-react';
import { useToast } from '../Toast';

type SavedChat = { id: string; title: string; updatedAt: string; messages?: unknown[] };

interface AiTutorRightSidebarProps {
  onRequestFileUpload: () => void;
}

export const AiTutorRightSidebar: React.FC<AiTutorRightSidebarProps> = ({ onRequestFileUpload }) => {
  const { showToast } = useToast();
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const refreshHistory = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('studybuddy_ai_chat_history') || '[]');
      setHistory(Array.isArray(saved) ? saved : []);
    } catch { setHistory([]); }
  };

  useEffect(() => {
    refreshHistory();
    try {
      const savedLanguage = localStorage.getItem('studybuddy_ai_language');
      if (savedLanguage && ['English', 'Urdu', 'Roman Urdu', 'Hindi'].includes(savedLanguage)) setLanguage(savedLanguage);
    } catch { /* local storage may be unavailable */ }
    window.addEventListener('studybuddy-chat-history-updated', refreshHistory);
    window.addEventListener('storage', refreshHistory);
    return () => {
      window.removeEventListener('studybuddy-chat-history-updated', refreshHistory);
      window.removeEventListener('storage', refreshHistory);
    };
  }, []);

  const options = [
    {
      title: 'Chat History',
      description: 'Continue a previous conversation',
      hint: 'Your recent sessions',
      icon: History,
      action: () => { refreshHistory(); setHistoryOpen(true); },
      iconStyle: 'from-indigo-500/25 to-blue-600/10 text-indigo-200 border-indigo-300/20',
      number: '01',
    },
    {
      title: 'Upload Files',
      description: 'Add images, PDFs, or study notes',
      hint: 'Up to 4 MB per file',
      icon: FileUp,
      action: onRequestFileUpload,
      iconStyle: 'from-cyan-500/25 to-blue-600/10 text-cyan-200 border-cyan-300/20',
      number: '02',
    },
  ];

  return (
    <>
      <aside className="relative isolate overflow-hidden rounded-2xl border border-blue-400/15 bg-[linear-gradient(155deg,rgba(10,27,57,0.98),rgba(5,15,34,0.98))] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.24)] sm:p-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-14 -z-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-12 -z-10 h-36 w-36 rounded-full bg-cyan-400/[0.07] blur-3xl" />

        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-200 shadow-inner">
              <SlidersHorizontal className="h-[18px] w-[18px]" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-white">Chat Options</h3>
              <p className="mt-0.5 text-[11px] text-slate-400">Your study workspace</p>
            </div>
          </div>
          <span className="flex h-7 items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2 text-[10px] font-medium text-emerald-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.65)]" />
            Ready
          </span>
        </div>

        <div className="space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.title}
                type="button"
                onClick={option.action}
                className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-white/[0.018] p-3.5 text-left shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-300/30 hover:from-blue-500/[0.10] hover:to-cyan-500/[0.035] hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${option.iconStyle} shadow-inner transition duration-200 group-hover:scale-[1.03]`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  <span className="flex items-center gap-2">
                    <span className="block text-[13px] font-semibold text-slate-50 transition-colors group-hover:text-white">{option.title}</span>
                    <span className="rounded-md border border-white/[0.07] bg-white/[0.035] px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-slate-500">{option.number}</span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">{option.description}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-blue-200/80">
                    {option.title === 'Upload Files' ? <FileText className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                    {option.hint}
                  </span>
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-slate-500 transition group-hover:border-blue-300/20 group-hover:bg-blue-400/10 group-hover:text-blue-100">
                  {option.title === 'Upload Files' ? <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> : <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">Preferences</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/10 p-3.5 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-gradient-to-br from-violet-400/15 to-blue-500/10 text-violet-200">
              <Globe2 className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-100">Response language</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">Choose your preferred language</p>
            </div>
            <Sparkles className="h-4 w-4 text-violet-300/60" />
          </div>
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); try { localStorage.setItem('studybuddy_ai_language', e.target.value); } catch {} showToast(`Language preference set to ${e.target.value}.`, 'success'); }}
            className="mt-3 w-full cursor-pointer rounded-xl border border-blue-300/15 bg-[#071329] px-3 py-2.5 text-xs font-medium text-blue-50 outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
          >
            <option>English</option><option>Urdu</option><option>Roman Urdu</option><option>Hindi</option>
          </select>
        </div>

        <p className="mt-3 px-1 text-center text-[10px] leading-relaxed text-slate-500">A calmer space to focus, learn, and keep your ideas together.</p>
      </aside>

      {historyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setHistoryOpen(false); }}>
          <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-blue-800 bg-[#071832] shadow-2xl">
            <header className="flex items-center justify-between border-b border-blue-900/70 p-4">
              <div className="flex items-center gap-2"><History className="h-5 w-5 text-blue-300"/><h2 className="font-semibold text-white">Chat History</h2></div>
              <button onClick={() => setHistoryOpen(false)} className="rounded-lg p-2 text-blue-200 hover:bg-blue-900/60" aria-label="Close history"><X className="h-4 w-4"/></button>
            </header>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="py-10 text-center"><MessageSquare className="mx-auto mb-3 h-10 w-10 text-blue-400/70"/><p className="font-medium text-blue-50">No saved chats yet</p><p className="mt-1 text-sm text-blue-200/70">Your conversations will appear here after you chat with the tutor.</p></div>
              ) : history.map((chat) => (
                <div key={chat.id} className="flex items-center gap-3 rounded-xl border border-blue-900/70 bg-[#0A2045] p-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-blue-300"/>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{chat.title || 'Study conversation'}</p><p className="mt-1 text-xs text-blue-200/70">{chat.updatedAt || 'Saved conversation'}</p></div>
                  <button aria-label="Delete saved chat" onClick={() => { const next = history.filter((item) => item.id !== chat.id); setHistory(next); try { localStorage.setItem('studybuddy_ai_chat_history', JSON.stringify(next)); } catch {} window.dispatchEvent(new Event('studybuddy-chat-history-updated')); }} className="rounded-lg p-2 text-blue-300 hover:bg-red-950/50 hover:text-red-300"><Trash2 className="h-4 w-4"/></button>
                </div>
              ))}
            </div>
            <footer className="border-t border-blue-900/70 p-3 text-right"><button onClick={() => setHistoryOpen(false)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Done</button></footer>
          </section>
        </div>
      )}
    </>
  );
};

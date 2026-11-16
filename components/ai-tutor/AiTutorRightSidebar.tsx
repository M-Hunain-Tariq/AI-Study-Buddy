'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Globe2, History, MessageSquare, ShieldCheck, Sparkles,
  Trash2, UploadCloud, X, Clock3,
} from 'lucide-react';
import { normalizeSavedChatHistory } from '@/lib/ai/chat-history';
import type { SavedChat } from '@/lib/ai/chat-history';
import { useToast } from '../Toast';

interface AiTutorRightSidebarProps {
  onRequestFileUpload: () => void;
  onSelectChat?: (chat: SavedChat) => void;
}

const LANGUAGES = ['English', 'Urdu', 'Roman Urdu', 'Hindi'];

export const AiTutorRightSidebar: React.FC<AiTutorRightSidebarProps> = ({ onRequestFileUpload, onSelectChat }) => {
  const { showToast } = useToast();
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [language, setLanguage] = useState('English');

  const refreshHistory = useCallback(() => {
    try {
      setHistory(normalizeSavedChatHistory(JSON.parse(localStorage.getItem('studybuddy_ai_chat_history') || '[]')));
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
    try {
      const savedLanguage = localStorage.getItem('studybuddy_ai_language');
      if (savedLanguage && LANGUAGES.includes(savedLanguage)) setLanguage(savedLanguage);
    } catch { /* optional preference */ }
    window.addEventListener('studybuddy-chat-history-updated', refreshHistory);
    window.addEventListener('storage', refreshHistory);
    return () => {
      window.removeEventListener('studybuddy-chat-history-updated', refreshHistory);
      window.removeEventListener('storage', refreshHistory);
    };
  }, [refreshHistory]);

  const changeLanguage = (value: string) => {
    setLanguage(value);
    try { localStorage.setItem('studybuddy_ai_language', value); } catch { /* storage unavailable */ }
    showToast(`Response language set to ${value}.`, 'success');
  };

  const removeChat = (id: string) => {
    const next = normalizeSavedChatHistory(history.filter((chat) => chat.id !== id));
    setHistory(next);
    try {
      localStorage.setItem('studybuddy_ai_chat_history', JSON.stringify(next));
      window.dispatchEvent(new Event('studybuddy-chat-history-updated'));
    } catch { showToast('Could not update chat history.', 'info'); }
  };

  const openChat = (chat: SavedChat) => {
    if (!onSelectChat) {
      showToast('Open the AI Tutor workspace to continue this conversation.', 'info');
      return;
    }
    onSelectChat(chat);
    setHistoryOpen(false);
  };

  return (
    <>
      <aside className="relative isolate overflow-hidden rounded-[22px] border border-[#203657] bg-[linear-gradient(155deg,rgba(10,27,54,0.98),rgba(5,15,31,0.99))] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:p-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-14 -z-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/10 text-cyan-200"><Sparkles className="h-4 w-4" /></span>
            <div><h3 className="text-sm font-semibold text-white">Workspace tools</h3><p className="mt-0.5 text-[10px] text-slate-500">Keep your study flow organized</p></div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2 py-1 text-[9px] font-semibold text-emerald-200"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Ready</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { refreshHistory(); setHistoryOpen(true); }} className="group flex min-h-[86px] flex-col items-start justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 text-left transition hover:border-blue-300/30 hover:bg-blue-500/[0.08]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-400/10 text-indigo-200"><History className="h-4 w-4" /></span>
            <span><span className="block text-xs font-semibold text-slate-100">Chat history</span><span className="mt-0.5 block text-[10px] text-slate-500">{history.length} saved chats</span></span>
          </button>
          <button type="button" onClick={onRequestFileUpload} className="group flex min-h-[86px] flex-col items-start justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3 text-left transition hover:border-cyan-300/30 hover:bg-cyan-500/[0.07]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-200"><UploadCloud className="h-4 w-4" /></span>
            <span><span className="block text-xs font-semibold text-slate-100">Upload material</span><span className="mt-0.5 block text-[10px] text-slate-500">Files up to 4 MB</span></span>
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">Recent conversations</h4>
            <button type="button" onClick={() => { refreshHistory(); setHistoryOpen(true); }} className="text-[10px] font-semibold text-blue-300 transition hover:text-cyan-200">View all</button>
          </div>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.10] px-3 py-5 text-center">
              <MessageSquare className="mx-auto mb-2 h-5 w-5 text-slate-600" />
              <p className="text-[11px] font-medium text-slate-300">No conversations yet</p>
              <p className="mt-1 text-[10px] text-slate-500">Your saved chats will appear here.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {history.slice(0, 4).map((chat) => (
                <button key={chat.id} type="button" onClick={() => openChat(chat)} className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-white/[0.07] hover:bg-white/[0.04]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/[0.09] text-blue-200"><MessageSquare className="h-3.5 w-3.5" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium text-slate-200">{chat.title || 'Study conversation'}</span><span className="mt-0.5 block truncate text-[9px] text-slate-500">{chat.updatedAt || 'Saved conversation'}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-violet-300" /><div><p className="text-xs font-semibold text-slate-100">Response language</p><p className="mt-0.5 text-[10px] text-slate-500">AI replies in your preferred language</p></div></div>
          <select value={language} onChange={(event) => changeLanguage(event.target.value)} className="mt-3 w-full rounded-xl border border-blue-300/15 bg-[#071329] px-3 py-2.5 text-xs font-medium text-blue-50 outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10">
            {LANGUAGES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-400/[0.045] px-3 py-2.5 text-[10px] leading-relaxed text-slate-400"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300/80" />Files are checked before sending. Chat history is saved in this browser.</div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-slate-600"><Clock3 className="h-3 w-3" />Your learning space, ready when you are</p>
      </aside>

      {historyOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setHistoryOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="ai-history-title" className="flex max-h-[82dvh] w-full max-w-xl flex-col overflow-hidden rounded-[22px] border border-blue-300/20 bg-[#08172D] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
            <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200"><History className="h-4 w-4" /></span><div><h2 id="ai-history-title" className="text-sm font-semibold text-white">Chat history</h2><p className="mt-0.5 text-[10px] text-slate-500">Open a conversation to continue learning</p></div></div>
              <button type="button" onClick={() => setHistoryOpen(false)} aria-label="Close chat history" className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            </header>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="py-12 text-center"><MessageSquare className="mx-auto mb-3 h-9 w-9 text-blue-300/60" /><p className="text-sm font-semibold text-slate-100">No saved chats yet</p><p className="mt-1 text-xs text-slate-500">Your conversations will appear here after your first chat.</p></div>
              ) : history.map((chat) => (
                <div key={chat.id} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 transition hover:border-blue-300/20 hover:bg-blue-500/[0.05]">
                  <button type="button" onClick={() => openChat(chat)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200"><MessageSquare className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-100">{chat.title || 'Study conversation'}</span><span className="mt-1 block text-[10px] text-slate-500">{chat.updatedAt || 'Saved conversation'} · {chat.messages.length} messages</span></span>
                  </button>
                  <button type="button" aria-label={`Delete ${chat.title}`} onClick={() => removeChat(chat.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <footer className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3"><span className="text-[10px] text-slate-500">Saved locally on this device</span><button type="button" onClick={() => setHistoryOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">Done</button></footer>
          </section>
        </div>
      )}
    </>
  );
};

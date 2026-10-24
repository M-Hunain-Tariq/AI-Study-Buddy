'use client';

import React, { useEffect, useState } from 'react';
import {
  SlidersHorizontal, History, FileUp, Mic, Globe2, ChevronRight,
  MessageSquare, Trash2, X,
} from 'lucide-react';
import { useToast } from '../Toast';

type SavedChat = { id: string; title: string; updatedAt: string; messages?: unknown[] };

interface AiTutorRightSidebarProps {
  onSelectPrompt: (promptText: string) => void;
  onSelectSubject: (subjectName: string, samplePrompt: string) => void;
}

export const AiTutorRightSidebar: React.FC<AiTutorRightSidebarProps> = () => {
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
    window.addEventListener('studybuddy-chat-history-updated', refreshHistory);
    window.addEventListener('storage', refreshHistory);
    return () => {
      window.removeEventListener('studybuddy-chat-history-updated', refreshHistory);
      window.removeEventListener('storage', refreshHistory);
    };
  }, []);

  const options = [
    { title: 'Chat History', description: 'View past conversations', icon: History, action: () => { refreshHistory(); setHistoryOpen(true); } },
    { title: 'File Upload', description: 'Attach an image to your question', icon: FileUp, action: () => showToast('Use the paperclip beside the message box to attach an image.', 'info') },
    { title: 'Voice Input', description: 'Speak your question', icon: Mic, action: () => showToast('Tap the microphone beside the message box to speak.', 'info') },
  ];

  return (
    <>
      <aside className="rounded-2xl border border-[#12366C] bg-[#061632]/95 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.2)]">
        <div className="mb-4 flex items-center gap-2 border-b border-blue-900/60 pb-4">
          <SlidersHorizontal className="h-5 w-5 text-blue-300" />
          <h3 className="text-base font-semibold text-white">Chat Options</h3>
        </div>
        <div className="space-y-2.5">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button key={option.title} type="button" onClick={option.action}
                className="group flex w-full items-center gap-3 rounded-xl border border-[#12366C] bg-[#0A2045]/90 p-3 text-left transition hover:border-blue-500/70 hover:bg-[#0D2A5A]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/80 to-blue-900 text-blue-100 shadow-inner">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-blue-50">{option.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-blue-200/75">{option.description}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-blue-300 transition group-hover:translate-x-0.5" />
              </button>
            );
          })}
          <div className="rounded-xl border border-[#12366C] bg-[#0A2045]/90 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/80 to-blue-900 text-blue-100">
                <Globe2 className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-blue-50">Language</p>
                <p className="mt-1 text-xs text-blue-200/75">Choose your chat language</p>
              </div>
            </div>
            <select value={language} onChange={(e) => { setLanguage(e.target.value); try { localStorage.setItem('studybuddy_ai_language', e.target.value); } catch {} showToast(`Language preference set to ${e.target.value}.`, 'success'); }}
              className="mt-3 w-full rounded-lg border border-blue-800 bg-[#061632] px-3 py-2 text-sm text-blue-100 outline-none focus:border-blue-400">
              <option>English</option><option>Urdu</option><option>Roman Urdu</option><option>Hindi</option>
            </select>
          </div>
        </div>
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

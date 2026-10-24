'use client';

import React, { useEffect, useState } from 'react';
import { FileText, MoreVertical, Plus } from 'lucide-react';
import { NoteItem } from '@/types/dashboard';
import { useRouter } from 'next/navigation';

interface RecentNotesProps {
  onSelectNote: (note: NoteItem) => void;
  onViewAll?: () => void;
}

type StoredNote = { id: string; title?: string; subject?: string; color?: string; content?: string; lastEdited?: string };

export const RecentNotes: React.FC<RecentNotesProps> = ({ onSelectNote, onViewAll }) => {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      if (Array.isArray(stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotes(stored.filter((n: StoredNote) => n && typeof n.id === 'string' && !['note-math-algebra', 'note-physics-motion', 'note-chem-periodic'].includes(n.id)).slice(0, 3).map((n: StoredNote) => ({
          id: n.id,
          title: n.title || 'Untitled note',
          subject: n.subject || 'General',
          timeAgo: n.lastEdited || 'Recently edited',
          color: n.color || 'blue',
          content: n.content || '',
        })));
      }
    } catch {
      setNotes([]);
    }
  }, []);

  const viewAll = () => onViewAll ? onViewAll() : router.push('/my-notes');

  return (
    <div className="rounded-2xl bg-[#0A132C] border border-[#162544] hover:border-[#243B6B] p-5 shadow-lg flex flex-col transition-all duration-300 h-full min-h-[300px]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#142240]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Recent Notes</h3>
        </div>
        <button onClick={viewAll} className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All →</button>
      </div>
      {notes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-slate-400"><FileText size={19} /></span>
          <p className="mt-3 text-sm font-semibold text-slate-200">No notes yet</p>
          <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400">Your notes will appear here after you create your first one.</p>
          <button onClick={viewAll} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-400/15"><Plus size={14} /> Create a note</button>
        </div>
      ) : (
        <div className="mt-2 divide-y divide-[#142240] space-y-1">{notes.map((note) => (
          <div key={note.id} onClick={() => onSelectNote(note)} className="group cursor-pointer flex items-center justify-between py-2.5 px-1 hover:bg-[#101D3D]/50 rounded-xl transition-all">
            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2"><div className="w-8 h-8 rounded-lg bg-[#142244] text-blue-400 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div><div className="min-w-0 flex-1"><h4 className="text-xs sm:text-[13px] font-semibold text-white truncate">{note.title}</h4><p className="text-[11px] text-slate-400 truncate">{note.subject} · {note.timeAgo}</p></div></div>
            <button onClick={(e) => { e.stopPropagation(); onSelectNote(note); }} className="p-1 rounded-md text-slate-400 hover:text-white" aria-label={`Open note ${note.title}`}><MoreVertical className="w-3.5 h-3.5" /></button>
          </div>
        ))}</div>
      )}
    </div>
  );
};

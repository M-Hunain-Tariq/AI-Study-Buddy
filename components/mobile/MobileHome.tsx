'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Brain, CalendarDays, Check, CheckSquare, ChevronRight, FileText, Plus } from 'lucide-react';
import { NoteItem, Task } from '@/types/dashboard';
import { useUserName } from './data';

interface MobileHomeProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAskAi: () => void;
  onOpenQuiz: () => void;
  onOpenPlanner: () => void;
  onNewNote: () => void;
  onViewTasks: () => void;
  onViewNotes: () => void;
}

type StoredNote = { id: string; title?: string; subject?: string; lastEdited?: string };

const DEMO_NOTE_IDS = ['note-math-algebra', 'note-physics-motion', 'note-chem-periodic'];
const DOT: Record<string, string> = {
  purple: '#a78bfa', blue: '#60a5fa', indigo: '#818cf8', amber: '#fbbf24', emerald: '#34d399',
  rose: '#fb7185', cyan: '#22d3ee', orange: '#fb923c', green: '#4ade80', pink: '#f472b6',
};

const RADIUS = 34;
const CIRC = 2 * Math.PI * RADIUS;

/** Phone Home screen. Reads the same data as the laptop dashboard (tasks via props, notes from localStorage). */
export const MobileHome: React.FC<MobileHomeProps> = ({ tasks, onToggleTask, onAskAi, onOpenQuiz, onOpenPlanner, onNewNote, onViewTasks, onViewNotes }) => {
  const [notes, setNotes] = useState<Pick<NoteItem, 'id' | 'title' | 'subject' | 'timeAgo'>[]>([]);
  const [today, setToday] = useState('');
  const userName = useUserName();

  useEffect(() => {
    setToday(new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }));
    try {
      const stored = JSON.parse(localStorage.getItem('study_notes_v5') || '[]');
      if (Array.isArray(stored)) {
        setNotes(
          stored
            .filter((n: StoredNote) => n && typeof n.id === 'string' && !DEMO_NOTE_IDS.includes(n.id))
            .slice(0, 3)
            .map((n: StoredNote) => ({ id: n.id, title: n.title || 'Untitled note', subject: n.subject || 'General', timeAgo: n.lastEdited || 'Recently edited' })),
        );
      }
    } catch {
      setNotes([]);
    }
  }, []);

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const tiles = [
    { label: 'Tasks', icon: CheckSquare, onClick: onViewTasks },
    { label: 'Quiz', icon: Brain, onClick: onOpenQuiz },
    { label: 'New note', icon: FileText, onClick: onNewNote },
    { label: 'Planner', icon: CalendarDays, onClick: onOpenPlanner },
  ];

  return (
    <section className="m-home lg:hidden" aria-label="Home">
      <header className="m-greet">
        {today && <p className="m-eyebrow">{today}</p>}
        <h1>Hi, {userName} 👋</h1>
      </header>

      <div className="m-card m-progress">
        <div className="m-ring" role="img" aria-label={`${pct}% of tasks done`}>
          <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
            <circle cx="40" cy="40" r={RADIUS} className="m-ring-bg" />
            <circle cx="40" cy="40" r={RADIUS} className="m-ring-fg" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct / 100)} />
          </svg>
          <span>{pct}%</span>
        </div>
        <div className="m-progress-text">
          <p className="m-big">{total ? `${done} of ${total} tasks done` : 'No tasks yet'}</p>
          <p className="m-sub">{total ? (pending.length ? `${pending.length} left to finish` : 'All done. Great work!') : 'Add a task to start your day.'}</p>
        </div>
      </div>

      <button type="button" className="m-cta" onClick={onAskAi}>
        <Bot size={18} /> Ask AI Tutor
      </button>

      <div className="m-tiles">
        {tiles.map(({ label, icon: Icon, onClick }) => (
          <button key={label} type="button" className="m-tile" onClick={onClick}>
            <span className="m-tile-icon"><Icon size={20} /></span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="m-section-head">
        <h2>Your tasks</h2>
        <button type="button" onClick={onViewTasks}>See all <ChevronRight size={14} /></button>
      </div>
      <div className="m-card m-list">
        {pending.length === 0 ? (
          <div className="m-empty">
            <p>{total ? 'Everything is done 🎉' : 'Nothing planned yet'}</p>
            <button type="button" className="m-link-btn" onClick={onViewTasks}><Plus size={14} /> Add a task</button>
          </div>
        ) : (
          pending.slice(0, 4).map((task) => (
            <button key={task.id} type="button" className="m-row" onClick={() => onToggleTask(task.id)} aria-label={`Mark "${task.title}" as done`}>
              <span className="m-check" aria-hidden="true"><Check size={14} /></span>
              <span className="m-row-main">
                <strong>{task.title}</strong>
                <small><i className="m-dot" style={{ background: DOT[task.subjectColor] || DOT.blue }} />{task.subject}{task.deadline ? ` · ${task.deadline}` : ''}</small>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="m-section-head">
        <h2>Recent notes</h2>
        <button type="button" onClick={onViewNotes}>See all <ChevronRight size={14} /></button>
      </div>
      <div className="m-card m-list">
        {notes.length === 0 ? (
          <div className="m-empty">
            <p>No notes yet</p>
            <button type="button" className="m-link-btn" onClick={onNewNote}><Plus size={14} /> Create a note</button>
          </div>
        ) : (
          notes.map((note) => (
            <button key={note.id} type="button" className="m-row" onClick={onViewNotes}>
              <span className="m-note-icon" aria-hidden="true"><FileText size={16} /></span>
              <span className="m-row-main">
                <strong>{note.title}</strong>
                <small>{note.subject} · {note.timeAgo}</small>
              </span>
              <ChevronRight size={16} className="m-row-arrow" />
            </button>
          ))
        )}
      </div>
    </section>
  );
};

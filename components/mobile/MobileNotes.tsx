'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Pin, Plus, Search, Trash2 } from 'lucide-react';
import { StudyNote } from '../my-notes/types';
import { useToast } from '../Toast';
import { Sheet } from './Sheet';
import { SUBJECTS, readStored, writeStored } from './data';

const KEY = 'study_notes_v5';
const DEMO_IDS = ['note-math-algebra', 'note-physics-motion', 'note-chem-periodic'];

interface MobileNotesProps {
  initialOpenCreate?: boolean;
}

/** Phone Notes screen. Same data (study_notes_v5) and fields as the laptop Notes page. */
export const MobileNotes: React.FC<MobileNotesProps> = ({ initialOpenCreate = false }) => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openNew = () => {
    setEditingId(null); setTitle(''); setSubject(SUBJECTS[0]); setContent(''); setPinned(false);
    setError(''); setConfirmDelete(false); setSheetOpen(true);
  };
  const openEdit = (n: StudyNote) => {
    setEditingId(n.id); setTitle(n.title); setSubject(n.subject); setContent(n.content); setPinned(!!n.isPinned);
    setError(''); setConfirmDelete(false); setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  useEffect(() => {
    setNotes(readStored<StudyNote>(KEY, DEMO_IDS));
    if (initialOpenCreate) openNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commit = (next: StudyNote[]) => { setNotes(next); writeStored(KEY, next); };

  const save = () => {
    if (!title.trim()) { setError('Please give your note a title.'); return; }
    const excerpt = content.trim()
      ? content.slice(0, 95) + (content.length > 95 ? '...' : '')
      : 'Your note content will appear here...';
    const stamp = { lastEdited: 'Just now', lastEditedTimestamp: Date.now() };
    if (editingId) {
      commit(notes.map((n) => (n.id === editingId ? { ...n, title: title.trim(), subject, content, excerpt, isPinned: pinned, ...stamp } : n)));
      showToast('Note updated', 'success');
    } else {
      const created: StudyNote = {
        id: `note-${Date.now()}`, title: title.trim(), subject, color: 'blue', content, excerpt,
        priority: 'Medium', tags: [], isPrivate: false, isPinned: pinned, addToPlanner: false, ...stamp,
      };
      commit([created, ...notes]);
      showToast('Note created', 'success');
    }
    closeSheet();
  };

  const remove = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    commit(notes.filter((n) => n.id !== editingId));
    showToast('Note deleted', 'info');
    closeSheet();
  };

  const subjects = useMemo(() => Array.from(new Set(notes.map((n) => n.subject))), [notes]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => (!subjectFilter || n.subject === subjectFilter) && (!q || `${n.title} ${n.excerpt} ${n.subject}`.toLowerCase().includes(q)))
      .sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned) || (b.lastEditedTimestamp || 0) - (a.lastEditedTimestamp || 0));
  }, [notes, subjectFilter, query]);

  return (
    <section className="m-page" aria-label="My Notes">
      <header className="m-page-head">
        <h1>My Notes</h1>
        <p>{notes.length ? `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}` : 'Write down what you learn'}</p>
      </header>

      <label className="m-search">
        <Search size={18} />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes" aria-label="Search notes" />
      </label>

      {subjects.length > 1 && (
        <div className="m-chips" role="group" aria-label="Filter by subject">
          <button type="button" className={!subjectFilter ? 'is-on' : ''} aria-pressed={!subjectFilter} onClick={() => setSubjectFilter(null)}>All</button>
          {subjects.map((s) => (
            <button key={s} type="button" className={subjectFilter === s ? 'is-on' : ''} aria-pressed={subjectFilter === s} onClick={() => setSubjectFilter(s)}>{s}</button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="m-card m-empty">
          <p>{notes.length ? 'No notes match your search' : 'No notes yet'}</p>
          {!notes.length && <button type="button" className="m-link-btn" onClick={openNew}><Plus size={14} /> Create your first note</button>}
        </div>
      ) : (
        <ul className="m-notes m-plain">
          {visible.map((n) => (
            <li key={n.id}>
              <button type="button" className="m-note" onClick={() => openEdit(n)}>
                <span className="m-note-top">
                  <strong>{n.title}</strong>
                  {n.isPinned && <Pin size={14} aria-label="Pinned" />}
                </span>
                <span className="m-note-excerpt">{n.excerpt}</span>
                <small>{n.subject} · {n.lastEdited}</small>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="m-fab" onClick={openNew} aria-label="New note"><Plus size={26} /></button>

      <Sheet
        open={sheetOpen}
        title={editingId ? 'Edit note' : 'New note'}
        onClose={closeSheet}
        footer={
          <>
            {editingId && (
              <button type="button" className={`m-btn m-btn-danger${confirmDelete ? ' is-armed' : ''}`} onClick={remove}>
                <Trash2 size={16} /> {confirmDelete ? 'Tap again to delete' : 'Delete'}
              </button>
            )}
            <button type="button" className="m-btn m-btn-primary" onClick={save}>{editingId ? 'Save note' : 'Create note'}</button>
          </>
        }
      >
        <label className="m-field">
          <span>Title</span>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} placeholder="e.g. Photosynthesis summary" autoFocus={!editingId} aria-invalid={!!error} />
          {error && <em className="m-error">{error}</em>}
        </label>
        <label className="m-field">
          <span>Subject</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {!SUBJECTS.includes(subject) && <option>{subject}</option>}
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="m-field">
          <span>Note</span>
          <textarea rows={9} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing..." />
        </label>
        <button type="button" className={`m-toggle${pinned ? ' is-on' : ''}`} aria-pressed={pinned} onClick={() => setPinned((v) => !v)}>
          <Pin size={16} /> {pinned ? 'Pinned to top' : 'Pin to top'}
        </button>
      </Sheet>
    </section>
  );
};

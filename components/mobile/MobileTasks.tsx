'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Check, Plus, Search, Trash2 } from 'lucide-react';
import { StudyTask, TaskPriority, TaskStatus } from '../tasks/types';
import { useToast } from '../Toast';
import { Sheet } from './Sheet';
import { SUBJECTS, readStored, writeStored } from './data';

const KEY = 'study_tasks_v4';
const DEMO_IDS = ['task-math-assign', 'task-physics-read', 'task-english-essay', 'task-chem-notes', 'task-cs-quiz'];
const FILTERS: { id: 'All' | TaskStatus; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Pending', label: 'To do' },
  { id: 'In Progress', label: 'Doing' },
  { id: 'Completed', label: 'Done' },
];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

/** Phone Tasks screen. Same data (study_tasks_v4) and fields as the laptop Tasks page. */
export const MobileTasks: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');
  const [query, setQuery] = useState('');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [dueDate, setDueDate] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => { setTasks(readStored<StudyTask>(KEY, DEMO_IDS)); }, []);

  const commit = (next: StudyTask[]) => { setTasks(next); writeStored(KEY, next); };

  const openNew = () => {
    setEditingId(null); setTitle(''); setSubject(SUBJECTS[0]); setPriority('Medium'); setStatus('Pending');
    setDueDate(''); setDesc(''); setError(''); setConfirmDelete(false); setSheetOpen(true);
  };
  const openEdit = (t: StudyTask) => {
    setEditingId(t.id); setTitle(t.title); setSubject(t.subject); setPriority(t.priority); setStatus(t.status);
    setDueDate(t.dueDate); setDesc(t.description || ''); setError(''); setConfirmDelete(false); setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  const toggle = (t: StudyTask) => {
    const next: TaskStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
    commit(tasks.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    showToast(next === 'Completed' ? `Task "${t.title}" completed! 🎉` : `Task "${t.title}" set to pending`, next === 'Completed' ? 'success' : 'info');
  };

  const save = () => {
    if (!title.trim()) { setError('Please enter a task title.'); return; }
    const due = dueDate.trim() || 'Today, 5:00 PM';
    if (editingId) {
      commit(tasks.map((t) => (t.id === editingId ? { ...t, title: title.trim(), subject, priority, status, dueDate: due, description: desc.trim() } : t)));
      showToast('Task updated successfully!', 'success');
    } else {
      const created: StudyTask = { id: `task-${Date.now()}`, title: title.trim(), subject, priority, status: 'Pending', dueDate: due, description: desc.trim() };
      commit([created, ...tasks]);
      showToast('New task added!', 'success');
    }
    closeSheet();
  };

  const remove = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    commit(tasks.filter((t) => t.id !== editingId));
    showToast('Task removed', 'info');
    closeSheet();
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => (filter === 'All' || t.status === filter) && (!q || `${t.title} ${t.subject} ${t.dueDate}`.toLowerCase().includes(q)));
  }, [tasks, filter, query]);

  const open = tasks.filter((t) => t.status !== 'Completed').length;
  const done = tasks.length - open;

  return (
    <section className="m-page" aria-label="Tasks">
      <header className="m-page-head">
        <h1>Tasks</h1>
        <p>{tasks.length ? `${open} to do · ${done} done` : 'Plan what you need to finish'}</p>
      </header>

      <label className="m-search">
        <Search size={18} />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
      </label>

      <div className="m-seg" role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className={filter === f.id ? 'is-on' : ''} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="m-card m-empty">
          <p>{tasks.length ? 'No tasks match this filter' : 'No tasks yet'}</p>
          {!tasks.length && <button type="button" className="m-link-btn" onClick={openNew}><Plus size={14} /> Add your first task</button>}
        </div>
      ) : (
        <ul className="m-card m-list m-plain">
          {visible.map((t) => {
            const isDone = t.status === 'Completed';
            return (
              <li key={t.id} className={`m-task${isDone ? ' is-done' : ''}`}>
                <button type="button" className={`m-check-btn${isDone ? ' is-on' : ''}`} onClick={() => toggle(t)} aria-label={isDone ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`} aria-pressed={isDone}>
                  <Check size={16} />
                </button>
                <button type="button" className="m-row-main m-task-main" onClick={() => openEdit(t)} aria-label={`Edit "${t.title}"`}>
                  <strong>{t.title}</strong>
                  <small>{t.subject} · {t.dueDate}{t.status === 'In Progress' ? ' · Doing' : ''}</small>
                </button>
                <span className={`m-pri m-pri-${t.priority.toLowerCase()}`}>{t.priority}</span>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="m-fab" onClick={openNew} aria-label="Add task"><Plus size={26} /></button>

      <Sheet
        open={sheetOpen}
        title={editingId ? 'Edit task' : 'New task'}
        onClose={closeSheet}
        footer={
          <>
            {editingId && (
              <button type="button" className={`m-btn m-btn-danger${confirmDelete ? ' is-armed' : ''}`} onClick={remove}>
                <Trash2 size={16} /> {confirmDelete ? 'Tap again to delete' : 'Delete'}
              </button>
            )}
            <button type="button" className="m-btn m-btn-primary" onClick={save}>{editingId ? 'Save changes' : 'Add task'}</button>
          </>
        }
      >
        <label className="m-field">
          <span>Title</span>
          <input value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} placeholder="e.g. Finish algebra worksheet" autoFocus={!editingId} aria-invalid={!!error} />
          {error && <em className="m-error">{error}</em>}
        </label>
        <label className="m-field">
          <span>Subject</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {!SUBJECTS.includes(subject) && <option>{subject}</option>}
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="m-field">
          <span>Priority</span>
          <div className="m-seg m-seg-3" role="group" aria-label="Priority">
            {PRIORITIES.map((p) => <button key={p} type="button" aria-pressed={priority === p} className={priority === p ? 'is-on' : ''} onClick={() => setPriority(p)}>{p}</button>)}
          </div>
        </div>
        {editingId && (
          <div className="m-field">
            <span>Status</span>
            <div className="m-seg m-seg-3" role="group" aria-label="Status">
              {STATUSES.map((s) => <button key={s} type="button" aria-pressed={status === s} className={status === s ? 'is-on' : ''} onClick={() => setStatus(s)}>{s === 'Pending' ? 'To do' : s === 'In Progress' ? 'Doing' : 'Done'}</button>)}
            </div>
          </div>
        )}
        <label className="m-field">
          <span>Due</span>
          <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Today, 5:00 PM" />
        </label>
        <label className="m-field">
          <span>Notes (optional)</span>
          <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Anything to remember" />
        </label>
      </Sheet>
    </section>
  );
};

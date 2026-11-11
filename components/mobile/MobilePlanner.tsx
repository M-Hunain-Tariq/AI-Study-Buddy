'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Flame, Plus, Sparkles, Trash2 } from 'lucide-react';
import { StudyGoal, StudyTask } from '@/types/study-planner';
import { getWeekDate, normalizePlannerTasks } from '../study-planner/StudyPlannerWorkspace';
import { AddTaskModal } from '../study-planner/AddTaskModal';
import { CreateGoalModal } from '../study-planner/CreateGoalModal';
import { AiPlanGeneratorModal } from '../study-planner/AiPlanGeneratorModal';
import { DeleteTaskModal } from '../study-planner/DeleteTaskModal';
import { useToast } from '../Toast';
import { readStored, writeStored } from './data';
import { getCurrentStudyStreak, recordStudyDay } from '@/lib/streak';

const TASKS_KEY = 'study_planner_tasks';
const GOALS_KEY = 'study_planner_goals';
const DOT: Record<string, string> = { teal: '#2dd4bf', purple: '#a78bfa', orange: '#fb923c', cyan: '#22d3ee', blue: '#60a5fa' };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const todayOffset = () => (new Date().getDay() + 6) % 7; // Monday = 0, same week logic as the laptop planner
const dayNumber = (iso: string) => Number(iso.slice(8, 10));
const longDate = (iso: string) => new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${iso}T12:00:00`));

/** Phone Study Planner. Same data (study_planner_tasks / _goals / study_streak_days) and the same forms as the laptop planner. */
export const MobilePlanner: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState(() => getWeekDate(todayOffset()));
  const [addOpen, setAddOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [toEdit, setToEdit] = useState<StudyTask | null>(null);
  const [toDelete, setToDelete] = useState<StudyTask | null>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTasks(normalizePlannerTasks(readStored<StudyTask>(TASKS_KEY, [])));
    setGoals(readStored<StudyGoal>(GOALS_KEY, []).filter((goal) => typeof goal.title === 'string' && typeof goal.subject === 'string')); 
    setStreak(getCurrentStudyStreak());
  }, []);

  useEffect(() => { selectedRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' }); }, []);

  const saveTasks = (next: StudyTask[]) => { setTasks(next); writeStored(TASKS_KEY, next); };
  const saveGoals = (next: StudyGoal[]) => { setGoals(next); writeStored(GOALS_KEY, next); };

  const weekDates = useMemo(() => DAYS.map((_, i) => getWeekDate(i)), []);
  const dayTasks = tasks.filter((t) => (t.date || getWeekDate(0)) === selected);
  const doneToday = dayTasks.filter((t) => t.completed).length;

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const next = !task.completed;
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, completed: next } : t)));
    saveGoals(goals.map((g) => {
      if (typeof g.subject === 'string' && (g.subject.toLowerCase() === task.subject.toLowerCase() || task.topic.toLowerCase().includes(g.subject.toLowerCase()))) {
        const count = next ? (g.completedSessions || 0) + 1 : Math.max(0, (g.completedSessions || 0) - 1);
        return { ...g, completedSessions: count, completed: count >= (g.targetSessions || 4) };
      }
      return g;
    }));
    if (next) setStreak(recordStudyDay());
    showToast(next ? `Completed: ${task.subject} (${task.topic}) 🎉` : `Reopened session: ${task.subject}`, next ? 'success' : 'info');
  };

  const addTask = (t: Omit<StudyTask, 'id' | 'completed'>) => {
    saveTasks([...tasks, { ...t, id: `task-${Date.now()}`, completed: false }]);
    showToast('Study task added successfully.', 'success');
  };
  const updateTask = (t: StudyTask) => {
    saveTasks(tasks.map((x) => (x.id === t.id ? t : x)));
    setToEdit(null);
    showToast('Study task updated successfully.', 'success');
  };
  const confirmDelete = () => {
    if (!toDelete) return;
    saveTasks(tasks.filter((t) => t.id !== toDelete.id));
    setToDelete(null);
    showToast('Study task deleted successfully.', 'info');
  };
  const toggleGoal = (id: string) => {
    saveGoals(goals.map((g) => {
      if (g.id !== id) return g;
      const next = !g.completed;
      showToast(next ? `Goal Achieved: "${g.title}" 🏆` : `Goal marked in progress: "${g.title}"`, next ? 'success' : 'info');
      return { ...g, completed: next, completedSessions: next ? g.targetSessions || 4 : 0 };
    }));
  };
  const createGoal = (g: Omit<StudyGoal, 'id' | 'completed'>) => {
    saveGoals([...goals, { ...g, id: `goal-${Date.now()}`, completed: false }]);
    showToast('Goal created successfully.', 'success');
  };
  const applyAiPlan = (generated: StudyTask[]) => {
    saveTasks([...tasks, ...generated]);
    showToast('Your AI study plan has been added.', 'ai');
  };

  return (
    <section className="m-page" aria-label="Study Planner">
      <header className="m-page-head m-plan-head">
        <div>
          <h1>Study Planner</h1>
          <p>{longDate(selected)}</p>
        </div>
        <span className="m-streak" title="Study streak"><Flame size={16} /> {streak}</span>
      </header>

      <div className="m-week" role="tablist" aria-label="Pick a day">
        {weekDates.map((d, i) => {
          const count = tasks.filter((t) => (t.date || getWeekDate(0)) === d).length;
          const on = d === selected;
          return (
            <button key={d} ref={on ? selectedRef : undefined} type="button" role="tab" aria-selected={on} className={on ? 'is-on' : ''} onClick={() => setSelected(d)} aria-label={`${longDate(d)}${count ? `, ${count} sessions` : ''}`}>
              <small>{DAYS[i]}</small>
              <strong>{dayNumber(d)}</strong>
              <i className={count ? 'has' : ''} />
            </button>
          );
        })}
      </div>

      <div className="m-plan-actions">
        <button type="button" className="m-btn m-btn-primary" onClick={() => { setToEdit(null); setAddOpen(true); }}><Plus size={18} /> Add session</button>
        <button type="button" className="m-btn m-btn-ghost" onClick={() => setAiOpen(true)}><Sparkles size={18} /> AI plan</button>
      </div>

      <div className="m-section-head m-tight">
        <h2>Sessions</h2>
        <span className="m-count">{dayTasks.length ? `${doneToday}/${dayTasks.length} done` : ''}</span>
      </div>
      {dayTasks.length === 0 ? (
        <div className="m-card m-empty"><p>No sessions planned for this day</p></div>
      ) : (
        <ul className="m-card m-list m-plain">
          {dayTasks.map((t) => (
            <li key={t.id} className={`m-task${t.completed ? ' is-done' : ''}`}>
              <button type="button" className={`m-check-btn${t.completed ? ' is-on' : ''}`} onClick={() => toggleTask(t.id)} aria-pressed={t.completed} aria-label={t.completed ? `Reopen ${t.subject} session` : `Complete ${t.subject} session`}><Check size={16} /></button>
              <button type="button" className="m-row-main m-task-main" onClick={() => { setToEdit(t); setAddOpen(true); }} aria-label={`Edit ${t.subject}: ${t.topic}`}>
                <strong>{t.subject}</strong>
                <small><i className="m-dot" style={{ background: DOT[t.color] || DOT.blue }} />{t.topic} · {t.time ? `${t.time} · ` : ''}{t.durationMinutes} min</small>
              </button>
              <button type="button" className="m-icon-btn" onClick={() => setToDelete(t)} aria-label={`Delete ${t.subject} session`}><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}

      <div className="m-section-head m-tight">
        <h2>Goals</h2>
        <button type="button" onClick={() => setGoalOpen(true)}><Plus size={14} /> New goal</button>
      </div>
      {goals.length === 0 ? (
        <div className="m-card m-empty"><p>No goals yet</p></div>
      ) : (
        <ul className="m-card m-list m-plain">
          {goals.map((g) => {
            const target = g.targetSessions || 4;
            const pct = g.completed ? 100 : Math.min(100, Math.round(((g.completedSessions || 0) / target) * 100));
            return (
              <li key={g.id} className={`m-task${g.completed ? ' is-done' : ''}`}>
                <button type="button" className={`m-check-btn${g.completed ? ' is-on' : ''}`} onClick={() => toggleGoal(g.id)} aria-pressed={g.completed} aria-label={g.completed ? `Reopen goal ${g.title}` : `Complete goal ${g.title}`}><Check size={16} /></button>
                <span className="m-row-main">
                  <strong>{g.title}</strong>
                  <small>{g.subject} · {g.dueDate} · {pct}%</small>
                  <span className="m-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {addOpen && (
        <AddTaskModal key={toEdit?.id ? `edit-${toEdit.id}` : `add-${selected}`} isOpen={addOpen} onClose={() => { setAddOpen(false); setToEdit(null); }} onAddTask={addTask} taskToEdit={toEdit} onUpdateTask={updateTask} defaultDate={selected} />
      )}
      {goalOpen && <CreateGoalModal isOpen={goalOpen} onClose={() => setGoalOpen(false)} onCreateGoal={createGoal} defaultSubject="Mathematics" />}
      {aiOpen && <AiPlanGeneratorModal isOpen={aiOpen} onClose={() => setAiOpen(false)} onAddPlanToSchedule={applyAiPlan} startDate={selected} initialSubject="Mathematics" />}
      {!!toDelete && <DeleteTaskModal isOpen onClose={() => setToDelete(null)} onConfirm={confirmDelete} taskTitle={toDelete.topic} taskSubject={toDelete.subject} />}
    </section>
  );
};

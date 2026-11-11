'use client';

import React, { useEffect, useState } from 'react';
import { readStored } from './data';
import { getCurrentStudyStreak } from '@/lib/streak';

interface Stats {
  percent: number;
  minutes: number;
  streak: number;
  tasksDone: number;
  notes: number;
  quizzes: number;
  subjects: { subject: string; avg: number; count: number }[];
  hasData: boolean;
}

const EMPTY: Stats = { percent: 0, minutes: 0, streak: 0, tasksDone: 0, notes: 0, quizzes: 0, subjects: [], hasData: false };
const R = 34;
const C = 2 * Math.PI * R;

function compute(): Stats {
  try {
    const tasks = readStored<{ id: string; status?: string; completed?: boolean }>('study_tasks_v4', []);
    const sessions = readStored<{ id: string; completed: boolean; durationMinutes: number }>('study_planner_tasks', []);
    const notes = readStored<{ id: string }>('study_notes_v5', []);
    const quizzes = readStored<{ id: string; subject: string; score: number }>('study_quiz_history_v1', []);
    const doneTasks = tasks.filter((t) => t.status === 'Completed' || t.completed === true).length;
    const doneSessions = sessions.filter((s) => s.completed);
    const total = tasks.length + sessions.length;
    const bySubject = new Map<string, number[]>();
    quizzes.forEach((q) => bySubject.set(q.subject, [...(bySubject.get(q.subject) || []), q.score]));
    const subjects = [...bySubject.entries()].map(([subject, scores]) => ({ subject, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length }));
    return {
      percent: total ? Math.round(((doneTasks + doneSessions.length) / total) * 100) : 0,
      minutes: doneSessions.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0),
      streak: getCurrentStudyStreak(),
      tasksDone: doneTasks + doneSessions.length,
      notes: notes.length,
      quizzes: quizzes.length,
      subjects,
      hasData: total + notes.length + quizzes.length > 0,
    };
  } catch {
    return EMPTY;
  }
}

/** Phone My Progress. Built from the same saved data the other screens write (the laptop page is a static placeholder). */
export const MobileProgress: React.FC = () => {
  const [s, setS] = useState<Stats>(EMPTY);
  useEffect(() => { setS(compute()); }, []);
  const h = Math.floor(s.minutes / 60);
  const m = s.minutes % 60;

  return (
    <section className="m-page" aria-label="My Progress">
      <header className="m-page-head">
        <h1>My Progress</h1>
        <p>From your tasks, planner sessions and quizzes</p>
      </header>

      <div className="m-card m-prog-top">
        <div className="m-ring" role="img" aria-label={`${s.percent}% overall progress`}>
          <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
            <circle cx="40" cy="40" r={R} className="m-ring-bg" />
            <circle cx="40" cy="40" r={R} className="m-ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - s.percent / 100)} />
          </svg>
          <span>{s.percent}%</span>
        </div>
        <div className="m-progress-text">
          <p className="m-big">Overall progress</p>
          <p className="m-sub">{s.hasData ? 'Tasks and sessions completed' : 'Nothing recorded yet'}</p>
        </div>
      </div>

      <div className="m-stats2">
        <div><strong>{h}h {String(m).padStart(2, '0')}m</strong><span>Study time</span></div>
        <div><strong>{s.streak} {s.streak === 1 ? 'day' : 'days'}</strong><span>Study streak</span></div>
        <div><strong>{s.tasksDone}</strong><span>Tasks completed</span></div>
        <div><strong>{s.notes}</strong><span>Notes saved</span></div>
      </div>

      <div className="m-section-head m-tight"><h2>Quiz scores</h2><span className="m-count">{s.quizzes ? `${s.quizzes} taken` : ''}</span></div>
      {s.subjects.length === 0 ? (
        <div className="m-card m-empty"><p>{s.hasData ? 'Take a quiz to see subject scores' : 'Complete a task, plan a session or take a quiz to build your progress'}</p></div>
      ) : (
        <div className="m-card m-bars">
          {s.subjects.map((x) => (
            <div key={x.subject}>
              <p><strong>{x.subject}</strong><span>{x.avg}% · {x.count} {x.count === 1 ? 'quiz' : 'quizzes'}</span></p>
              <span className="m-bar" aria-hidden="true"><i style={{ width: `${x.avg}%` }} /></span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Bot,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  MessageCircle,
  Plus,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import type { NoteItem, Task } from '@/types/dashboard';
import type { StudyGoal } from '@/types/study-planner';
import { calculateDashboardStats, calculateWeeklyActivity, type DashboardStats, type WeeklyActivityDay } from '@/lib/dashboard-stats';
import { getCurrentStudyStreak } from '@/lib/streak';
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

const EMPTY_STATS: DashboardStats = {
  completedStudyMinutes: 0,
  savedAiQuestions: 0,
  recentQuizAccuracy: null,
  quizCount: 0,
};

function readStoredList(key: string): unknown[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatStudyTime(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainder = safeMinutes % 60;
  if (hours === 0) return `${remainder}m`;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Mobile dashboard: a compact, desktop-inspired workspace using the same saved data and actions. */
export const MobileHome: React.FC<MobileHomeProps> = ({
  tasks,
  onToggleTask,
  onAskAi,
  onOpenQuiz,
  onOpenPlanner,
  onNewNote,
  onViewTasks,
  onViewNotes,
}) => {
  const [notes, setNotes] = useState<Pick<NoteItem, 'id' | 'title' | 'subject' | 'timeAgo'>[]>([]);
  const [today, setToday] = useState('');
  const [greeting, setGreeting] = useState('Welcome back');
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [week, setWeek] = useState<WeeklyActivityDay[]>([]);
  const [streak, setStreak] = useState(0);
  const [activeGoal, setActiveGoal] = useState<StudyGoal | null>(null);
  const [hasGoals, setHasGoals] = useState(false);
  const userName = useUserName();
  const firstName = userName.trim().split(/\s+/)[0] || 'Student';

  useEffect(() => {
    const now = new Date();
    setToday(now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }));
    setGreeting(getGreeting());

    const plannerTasks = readStoredList('study_planner_tasks');
    const savedChats = readStoredList('studybuddy_ai_chat_history');
    const quizHistory = readStoredList('study_quiz_history_v1');
    setStats(calculateDashboardStats(plannerTasks, savedChats, quizHistory));
    setWeek(calculateWeeklyActivity(plannerTasks, now));
    setStreak(getCurrentStudyStreak(now));

    const goals = readStoredList('study_planner_goals') as StudyGoal[];
    const nextGoal = goals.find((goal) => goal && typeof goal.id === 'string' && typeof goal.title === 'string' && !goal.completed);
    setActiveGoal(nextGoal || null);
    setHasGoals(goals.length > 0);

    const storedNotes = readStoredList('study_notes_v5') as StoredNote[];
    setNotes(
      storedNotes
        .filter((note) => note && typeof note.id === 'string' && !DEMO_NOTE_IDS.includes(note.id))
        .slice(0, 2)
        .map((note) => ({
          id: note.id,
          title: note.title || 'Untitled note',
          subject: note.subject || 'General',
          timeAgo: note.lastEdited || 'Recently edited',
        })),
    );
  }, []);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed);
  const taskProgress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const weeklyActiveDays = week.filter((day) => day.minutes > 0).length;
  const weeklyTotalMinutes = week.reduce((sum, day) => sum + day.minutes, 0);
  const weeklyMax = Math.max(1, ...week.map((day) => day.minutes));
  const goalTarget = activeGoal ? Math.max(1, Number(activeGoal.targetSessions) || 4) : 0;
  const goalDone = activeGoal ? Math.max(0, Number(activeGoal.completedSessions) || 0) : 0;
  const goalProgress = activeGoal ? Math.min(100, Math.round((goalDone / goalTarget) * 100)) : 0;

  const statItems = useMemo(() => [
    { label: 'Study time', value: formatStudyTime(stats.completedStudyMinutes), icon: Clock3, tone: 'blue' },
    { label: 'Tasks done', value: `${doneTasks}/${totalTasks}`, icon: Check, tone: 'cyan' },
    { label: 'AI questions', value: String(stats.savedAiQuestions), icon: MessageCircle, tone: 'violet' },
    { label: 'Quiz average', value: stats.recentQuizAccuracy === null ? '—' : `${stats.recentQuizAccuracy}%`, icon: Trophy, tone: 'amber' },
  ], [stats, doneTasks, totalTasks]);

  const shortcuts = [
    { label: 'Tasks', icon: Check, onClick: onViewTasks, tone: 'blue' },
    { label: 'Planner', icon: CalendarDays, onClick: onOpenPlanner, tone: 'cyan' },
    { label: 'Quiz', icon: Brain, onClick: onOpenQuiz, tone: 'violet' },
    { label: 'New note', icon: FileText, onClick: onNewNote, tone: 'amber' },
  ];

  return (
    <section className="m-home m-home-premium lg:hidden" aria-label="Home dashboard">
      <header className="m-home-heading">
        <div className="m-home-welcome">
          {today && <p className="m-home-date">{today}</p>}
          <h1>{greeting}, <span>{firstName}</span></h1>
          <p className="m-home-subtitle">Your learning space is ready.</p>
        </div>
        <div className={`m-home-streak${streak > 0 ? ' is-active' : ''}`} aria-label={`${streak} day study streak`}>
          <Flame size={15} />
          <span>{streak > 0 ? `${streak} day streak` : 'Start streak'}</span>
        </div>
      </header>

      <section className="m-home-hero" aria-label="Study space introduction">
        <img src="/images/hero_study_desk_exact.jpg" alt="A calm, modern study desk with a laptop and books" />
        <div className="m-home-hero-shade" />
        <div className="m-home-hero-content">
          <span className="m-home-hero-kicker"><Sparkles size={12} /> YOUR STUDY SPACE</span>
          <h2>Make today <span>count.</span></h2>
          <p>One focused session can move you forward.</p>
          <div className="m-home-hero-actions">
            <button type="button" className="m-home-primary" onClick={onAskAi}>
              <Bot size={15} /> Ask AI Tutor <ArrowUpRight size={14} />
            </button>
            <button type="button" className="m-home-secondary" onClick={onOpenPlanner}>Open planner</button>
          </div>
        </div>
      </section>

      <section className="m-home-stats" aria-label="Study statistics">
        {statItems.map(({ label, value, icon: Icon, tone }, index) => (
          <div className={`m-home-stat m-tone-${tone}`} key={label}>
            <span className="m-home-stat-icon"><Icon size={14} /></span>
            <strong>{value}</strong>
            <small>{label}</small>
            {index < statItems.length - 1 && <i className="m-home-stat-divider" aria-hidden="true" />}
          </div>
        ))}
      </section>

      <nav className="m-home-shortcuts" aria-label="Quick actions">
        {shortcuts.map(({ label, icon: Icon, onClick, tone }) => (
          <button type="button" className={`m-home-shortcut m-tone-${tone}`} key={label} onClick={onClick}>
            <span><Icon size={17} /></span>
            <small>{label}</small>
          </button>
        ))}
      </nav>

      <section className="m-home-board" aria-label="Daily study overview">
        <div className="m-home-board-main">
          <div className="m-home-section-title">
            <div>
              <span className="m-home-overline">STAY ON TRACK</span>
              <h2>Today&apos;s focus</h2>
            </div>
            <button type="button" onClick={onViewTasks}>All tasks <ChevronRight size={14} /></button>
          </div>
          <div className="m-home-task-meta">
            <span>{pendingTasks.length} remaining</span>
            <strong>{taskProgress}% complete</strong>
          </div>
          <div className="m-home-progress-track" role="progressbar" aria-label="Task completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={taskProgress}>
            <span style={{ width: `${taskProgress}%` }} />
          </div>
          <div className="m-home-task-list">
            {pendingTasks.length === 0 ? (
              <div className="m-home-empty-task">
                <span className="m-home-empty-icon"><Check size={16} /></span>
                <div>
                  <strong>{totalTasks ? 'All caught up!' : 'Nothing planned yet'}</strong>
                  <small>{totalTasks ? 'You have completed every task.' : 'Add a task and make a start.'}</small>
                </div>
                <button type="button" onClick={onViewTasks} aria-label="Open tasks"><Plus size={17} /></button>
              </div>
            ) : (
              pendingTasks.slice(0, 3).map((task) => (
                <button key={task.id} type="button" className="m-home-task" onClick={() => onToggleTask(task.id)} aria-label={`Mark ${task.title} as complete`}>
                  <span className="m-home-task-check"><Check size={12} /></span>
                  <span className="m-home-task-copy">
                    <strong>{task.title}</strong>
                    <small><i style={{ background: DOT[task.subjectColor] || DOT.blue }} />{task.subject}</small>
                  </span>
                  {task.deadline && <span className="m-home-task-deadline">{task.deadline}</span>}
                </button>
              ))
            )}
          </div>
        </div>

        <aside className="m-home-weekly" aria-label="Weekly activity">
          <div className="m-home-section-title m-home-week-title">
            <div>
              <span className="m-home-overline">LAST 7 DAYS</span>
              <h2>Activity</h2>
            </div>
            <Activity size={16} />
          </div>
          <div className="m-home-week-summary">
            <strong>{weeklyActiveDays}<small>/7</small></strong>
            <span>active days</span>
          </div>
          <div className="m-home-week-bars" aria-label={`${weeklyActiveDays} active days in the last seven days`}>
            {week.map((day) => (
              <div className="m-home-week-day" key={day.key} title={`${day.label}: ${day.minutes} minutes`}>
                <span className={day.minutes > 0 ? 'has-activity' : ''} style={{ height: `${day.minutes > 0 ? Math.max(18, (day.minutes / weeklyMax) * 100) : 5}%` }} />
                <small>{day.label.slice(0, 1)}</small>
              </div>
            ))}
          </div>
          <p className="m-home-week-time">{formatStudyTime(weeklyTotalMinutes)} studied</p>
          <button type="button" className="m-home-inline-link" onClick={onOpenPlanner}>Study planner <ArrowUpRight size={13} /></button>
        </aside>

        <div className="m-home-goal-strip">
          <span className="m-home-goal-icon"><Target size={15} /></span>
          <div className="m-home-goal-copy">
            <strong>{activeGoal ? activeGoal.title : hasGoals ? 'All learning goals completed' : 'Your learning goal'}</strong>
            <small>{activeGoal ? `${goalDone} of ${goalTarget} sessions` : hasGoals ? 'Great work — every saved goal is complete' : 'Set a goal in your planner to track progress'}</small>
          </div>
          {activeGoal || hasGoals ? (
            <div className="m-home-goal-meter" role="progressbar" aria-label="Learning goal progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={activeGoal ? goalProgress : 100}>
              <span style={{ width: `${activeGoal ? goalProgress : 100}%` }} />
            </div>
          ) : (
            <button type="button" onClick={onOpenPlanner} aria-label="Set a learning goal"><ChevronRight size={17} /></button>
          )}
        </div>
      </section>

      <section className="m-home-notes" aria-label="Recent notes">
        <div className="m-home-section-title">
          <div>
            <span className="m-home-overline">YOUR LIBRARY</span>
            <h2>Recent notes</h2>
          </div>
          <button type="button" onClick={onViewNotes}>View all <ChevronRight size={14} /></button>
        </div>
        {notes.length === 0 ? (
          <button type="button" className="m-home-note-empty" onClick={onNewNote}>
            <span><Plus size={16} /></span>
            <strong>Create your first note</strong>
            <small>Keep useful ideas in one place</small>
          </button>
        ) : (
          <div className="m-home-note-grid">
            {notes.map((note) => (
              <button type="button" className="m-home-note" key={note.id} onClick={onViewNotes}>
                <span className="m-home-note-icon"><FileText size={15} /></span>
                <span className="m-home-note-copy">
                  <strong>{note.title}</strong>
                  <small>{note.subject} · {note.timeAgo}</small>
                </span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};
